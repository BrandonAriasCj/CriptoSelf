"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')),
    path('api/backtesting/', include('backtesting.urls')),
    path('api/lessons/', include('lessons.urls')),
    
    # Authentication
    path('api/auth/', include('authentication.urls')),
    
    # OAuth2 Provider (Django OAuth Toolkit)
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider_backend')),
]