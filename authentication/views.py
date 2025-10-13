from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from oauth2_provider.models import Application, AccessToken
from oauth2_provider import permissions as oauth2_permissions
from users.serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer, 
    ChangePasswordSerializer
)
import requests

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    Registro de nuevos usuarios
    """
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Enviar email de verificación (opcional)
        # self.send_verification_email(user)
        
        return Response({
            'message': 'Usuario creado exitosamente',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Ver y actualizar perfil del usuario autenticado
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [oauth2_permissions.TokenHasScope]
    required_scopes = ['read', 'write']

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UserUpdateSerializer


class ChangePasswordView(APIView):
    """
    Cambiar contraseña del usuario autenticado
    """
    permission_classes = [oauth2_permissions.TokenHasScope]
    required_scopes = ['write']

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Verificar contraseña actual
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({
                    'error': 'Contraseña actual incorrecta'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Cambiar contraseña
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def oauth_token(request):
    """
    Obtener token OAuth2 usando credenciales
    """
    username = request.data.get('username')
    password = request.data.get('password')
    client_id = request.data.get('client_id')
    client_secret = request.data.get('client_secret')
    
    if not all([username, password, client_id, client_secret]):
        return Response({
            'error': 'Faltan parámetros requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verificar aplicación OAuth2
        application = Application.objects.get(
            client_id=client_id,
            client_secret=client_secret
        )
        
        # Autenticar usuario
        user = authenticate(username=username, password=password)
        if not user:
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Hacer request al endpoint de token de Django OAuth Toolkit
        token_url = request.build_absolute_uri('/o/token/')
        token_data = {
            'grant_type': 'password',
            'username': username,
            'password': password,
            'client_id': client_id,
            'client_secret': client_secret,
        }
        
        response = requests.post(token_url, data=token_data)
        
        if response.status_code == 200:
            token_info = response.json()
            return Response({
                'access_token': token_info['access_token'],
                'refresh_token': token_info['refresh_token'],
                'expires_in': token_info['expires_in'],
                'token_type': token_info['token_type'],
                'scope': token_info['scope'],
                'user': UserSerializer(user).data
            })
        else:
            return Response({
                'error': 'Error al generar token'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Application.DoesNotExist:
        return Response({
            'error': 'Aplicación OAuth2 no válida'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([oauth2_permissions.TokenHasScope])
def logout(request):
    """
    Cerrar sesión revocando el token
    """
    required_scopes = ['write']
    
    try:
        token = request.auth
        token.delete()
        return Response({
            'message': 'Sesión cerrada exitosamente'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Error al cerrar sesión'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([oauth2_permissions.TokenHasScope])
def user_info(request):
    """
    Información del usuario autenticado
    """
    required_scopes = ['read']
    
    return Response({
        'user': UserSerializer(request.user).data,
        'scopes': request.auth.scope.split() if request.auth else []
    })


class SocialAuthView(APIView):
    """
    Autenticación con proveedores sociales (Google, GitHub, etc.)
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = request.data.get('provider')
        access_token = request.data.get('access_token')
        
        if not provider or not access_token:
            return Response({
                'error': 'Provider y access_token son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Aquí integrarías con django-allauth
        # Por ahora retornamos un placeholder
        return Response({
            'message': f'Autenticación con {provider} en desarrollo',
            'provider': provider
        }, status=status.HTTP_501_NOT_IMPLEMENTED)