from rest_framework import serializers
from api.models import Restaurant, Item, ItemImage
from api.serializers.item_serializer import ItemImageSerializer

class MenuItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'item_name', 'prix', 'categorie', 'images']

class MenuSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = ['id', 'company_name', 'items']
    
    def get_items(self, obj):
        items = Item.objects.filter(user=obj.user)
        return MenuItemSerializer(items, many=True).data