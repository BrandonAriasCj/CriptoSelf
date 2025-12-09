from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from .models import Operacion
from .serializers import OperacionSerializer

User = get_user_model()

class IsOwner(permissions.BasePermission):
    """
    Permiso para que solo el dueño pueda ver/editar sus operaciones
    """
    def has_object_permission(self, request, view, obj):
        return obj.usuario == request.user

class OperacionViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para operaciones de criptoactivos.
    Solo muestra las operaciones del usuario autenticado.
    """
    serializer_class = OperacionSerializer
    # TEMPORALMENTE DESACTIVADO PARA TESTING - REVERTIR ANTES DE PRODUCCIÓN
    permission_classes = [permissions.AllowAny]  # Antes: [permissions.IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['criptoactivo', 'tipo_operacion', 'estado']
    ordering_fields = ['fecha_operacion', 'created_at', 'monto_total']
    ordering = ['-fecha_operacion']
    search_fields = ['criptoactivo__symbol', 'notas']


    def get_queryset(self):
        # TEMPORALMENTE MODIFICADO: Mostrar todas las operaciones cuando no hay autenticación
        if self.request.user.is_authenticated:
            return Operacion.objects.filter(usuario=self.request.user)
        return Operacion.objects.all()

    def perform_create(self, serializer):
        # TEMPORALMENTE MODIFICADO: Solo asignar usuario si está autenticado
        if self.request.user.is_authenticated:
            serializer.save(usuario=self.request.user)
        else:
            # Sin autenticación, debe enviar el usuario en el body
            usuarioprimero = User.objects.first()
            serializer.save(usuario=usuarioprimero)

