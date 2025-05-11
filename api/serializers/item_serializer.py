from rest_framework import serializers
from api.models import Item, ItemImage

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image_url']

class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Item
        fields = ['id', 'user', 'item_name', 'prix', 'categorie', 'images', 'uploaded_images']
        read_only_fields = ['user']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        item = Item.objects.create(**validated_data)
        
        for image in uploaded_images:
            ItemImage.objects.create(item=item, image_url=image)
        
        return item