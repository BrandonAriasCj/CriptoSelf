from rest_framework import permissions
from oauth2_provider import permissions as oauth2_permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los propietarios editar sus objetos
    """
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permisos de escritura solo para el propietario del objeto
        return obj == request.user


class HasRequiredScope(oauth2_permissions.TokenHasScope):
    """
    Permiso que verifica scopes específicos basado en el método HTTP
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Definir scopes requeridos por método
        method_scopes = {
            'GET': ['read'],
            'POST': ['write'],
            'PUT': ['write'],
            'PATCH': ['write'],
            'DELETE': ['write'],
        }
        
        required_scopes = method_scopes.get(request.method, [])
        token = request.auth
        
        if not token:
            return False
        
        token_scopes = token.scope.split()
        return any(scope in token_scopes for scope in required_scopes)


class IsVerifiedUser(permissions.BasePermission):
    """
    Permiso que requiere que el usuario esté verificado
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_verified
        )