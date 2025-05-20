from rest_framework import serializers
from api.models.order import Order, OrderItem
from api.models.item import Item
from api.serializers.item_serializer import ItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    item_detail = ItemSerializer(source='item', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'item', 'item_detail', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'restaurant', 'status',
            'total_amount', 'items', 'order_items',
            'stripe_payment_intent_id', 'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'user', 'status', 'total_amount',
            'stripe_payment_intent_id', 'created_at',
            'updated_at'
        ]
    
    def create(self, validated_data):
        order_items = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        
        total_amount = 0
        for item_data in order_items:
            item_id = item_data['item']
            quantity = item_data['quantity']
            
            item = Item.objects.get(id=item_id)
            order_item = OrderItem.objects.create(
                order=order,
                item=item,
                quantity=quantity,
                price=item.prix
            )
            total_amount += order_item.price * quantity
        
        order.total_amount = total_amount
        order.save()
        return order