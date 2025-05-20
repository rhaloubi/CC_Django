from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models.order import Order
from api.serializers.order_serializer import OrderSerializer
from api.services.stripe_service import StripeService

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        # Create Stripe payment intent
        try:
            intent = StripeService.create_payment_intent(order)
            return Response({
                'client_secret': intent.client_secret,
                'order': OrderSerializer(order).data
            })
        except ValueError as e:
            order.delete()
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        order = self.get_object()
        try:
            if StripeService.confirm_payment(order):
                return Response({'status': 'payment confirmed'})
            return Response(
                {'error': 'payment not confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )