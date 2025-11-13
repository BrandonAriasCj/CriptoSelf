from django.urls import path, include
from . import views

urlpatterns = [
    # Registro y perfil
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # OAuth2 endpoints
    path('token/', views.oauth_token, name='oauth_token'),
    path('logout/', views.logout, name='logout'),
    path('user-info/', views.user_info, name='user_info'),
    
    # Autenticación social
    path('social/', views.SocialAuthView.as_view(), name='social_auth'),
    path('google/exchange-code/', views.google_exchange_code, name='google_exchange_code'),
    path('google/register/', views.google_register, name='google_register'),
    
    # Django OAuth Toolkit URLs
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    
    # Django Allauth URLs
    path('accounts/', include('allauth.urls')),
    
    # Test endpoint
    path('test/', views.test_auth, name='test_auth'),
]