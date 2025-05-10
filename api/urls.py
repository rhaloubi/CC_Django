from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views.auth_views import RegisterView, LoginView
from api.views.user_views import UserViewSet, AdminUserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
]
