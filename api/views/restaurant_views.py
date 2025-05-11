from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import Restaurant
from api.serializers.restaurant_serializer import RestaurantSerializer
from api.permissions import IsOwnerOrAdmin, IsRestaurantOwner

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner, IsOwnerOrAdmin]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'restaurant_owner':
            raise PermissionError("Only restaurant owners can create restaurants")
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Restaurant.objects.all()
        elif self.action == 'list':
            return Restaurant.objects.all()
        return Restaurant.objects.filter(user=self.request.user)