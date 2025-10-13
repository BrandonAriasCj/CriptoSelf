"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from .views import ReactAppView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')),
    path('api/backtesting/', include('backtesting.urls')),
    
    # Authentication
    path('api/auth/', include('authentication.urls')),
    
    # OAuth2 Provider (Django OAuth Toolkit)
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    
    # Django Allauth
    path('accounts/', include('allauth.urls')),
    
    # React App - debe ir al final para capturar todas las rutas no API
    re_path(r'^.*$', ReactAppView.as_view(), name='react_app'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)