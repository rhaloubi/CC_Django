from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from api.views.auth_views import RegisterView, LoginView
from api.views.user_views import UserViewSet, AdminUserViewSet
from api.views.restaurant_views import RestaurantViewSet
from api.views.item_views import ItemViewSet
from api.views.menu_views import RestaurantMenuView
from api.views.order_views import OrderViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'items', ItemViewSet, basename='item')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('restaurant/<str:company_name>/menu/', RestaurantMenuView.as_view(), name='restaurant-menu'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
