from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser
    """
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True)
    date_of_birth = models.DateField(_('date of birth'), null=True, blank=True)
    avatar = models.ImageField(_('avatar'), upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(_('bio'), max_length=500, blank=True)
    
    # Configuración de cuenta
    is_verified = models.BooleanField(_('is verified'), default=False)
    email_verified = models.BooleanField(_('email verified'), default=False)
    phone_verified = models.BooleanField(_('phone verified'), default=False)
    
    # Configuración de privacidad
    is_public_profile = models.BooleanField(_('public profile'), default=True)
    allow_notifications = models.BooleanField(_('allow notifications'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    last_login_ip = models.GenericIPAddressField(_('last login IP'), null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        db_table = 'users_user'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Retorna el nombre completo del usuario"""
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def display_name(self):
        """Retorna el nombre para mostrar (nombre completo o username)"""
        return self.full_name if self.full_name else self.username


class UserProfile(models.Model):
    """
    Perfil extendido del usuario para información adicional
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Información profesional
    company = models.CharField(_('company'), max_length=100, blank=True)
    job_title = models.CharField(_('job title'), max_length=100, blank=True)
    website = models.URLField(_('website'), blank=True)
    
    # Redes sociales
    linkedin_url = models.URLField(_('LinkedIn URL'), blank=True)
    github_url = models.URLField(_('GitHub URL'), blank=True)
    twitter_url = models.URLField(_('Twitter URL'), blank=True)
    
    # Configuración de trading/backtesting
    preferred_currency = models.CharField(_('preferred currency'), max_length=10, default='USD')
    risk_tolerance = models.CharField(
        _('risk tolerance'),
        max_length=20,
        choices=[
            ('conservative', _('Conservative')),
            ('moderate', _('Moderate')),
            ('aggressive', _('Aggressive')),
        ],
        default='moderate'
    )
    
    # Configuración de notificaciones
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    sms_notifications = models.BooleanField(_('SMS notifications'), default=False)
    push_notifications = models.BooleanField(_('push notifications'), default=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')

    def __str__(self):
        return f"Profile of {self.user.email}"