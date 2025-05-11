from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from api.models import Item, ItemImage
from api.serializers.item_serializer import ItemSerializer, ItemImageSerializer
from api.permissions import IsOwnerOrAdminForItem

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdminForItem]
    parser_classes = (MultiPartParser, FormParser)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        if self.action == 'list':
            return Item.objects.all()
        return Item.objects.filter(user=self.request.user)