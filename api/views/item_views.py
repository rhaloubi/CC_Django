from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action
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

    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        item = self.get_object()
        image_id = request.query_params.get('image_id')
        
        if not image_id:
            return Response(
                {'error': 'image_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            image = ItemImage.objects.get(id=image_id, item=item)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ItemImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )