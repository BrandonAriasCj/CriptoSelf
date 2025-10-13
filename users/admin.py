from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = (
        ('company', 'job_title'),
        'website',
        ('linkedin_url', 'github_url', 'twitter_url'),
        ('preferred_currency', 'risk_tolerance'),
        ('email_notifications', 'sms_notifications', 'push_notifications'),
    )


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    
    list_display = (
        'email', 'username', 'first_name', 'last_name', 
        'is_verified', 'email_verified', 'is_staff', 'date_joined'
    )
    list_filter = (
        'is_staff', 'is_superuser', 'is_active', 'is_verified', 
        'email_verified', 'date_joined'
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'email', 'phone_number', 'date_of_birth', 'avatar', 'bio')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Verification'), {
            'fields': ('is_verified', 'email_verified', 'phone_verified'),
        }),
        (_('Privacy'), {
            'fields': ('is_public_profile', 'allow_notifications'),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined', 'last_login_ip'),
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login', 'last_login_ip')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'job_title', 'preferred_currency', 'risk_tolerance')
    list_filter = ('risk_tolerance', 'preferred_currency', 'email_notifications')
    search_fields = ('user__email', 'user__username', 'company', 'job_title')
    raw_id_fields = ('user',)