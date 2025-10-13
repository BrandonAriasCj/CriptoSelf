from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, health_check, ProfileView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),

]