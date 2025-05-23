from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from api.models import Restaurant
from api.serializers.menu_serializer import MenuSerializer

class RestaurantMenuView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'