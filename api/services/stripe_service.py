import stripe
from django.conf import settings
from api.models.order import Order

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    @staticmethod
    def create_payment_intent(order: Order):
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(order.total_amount * 100),  # Convert to cents
                currency='usd',
                metadata={
                    'order_id': order.id,
                    'user_id': order.user.id
                }
            )
            order.stripe_payment_intent_id = intent.id
            order.save()
            return intent
        except stripe.error.StripeError as e:
            raise ValueError(f"Stripe error: {str(e)}")
    
    @staticmethod
    def confirm_payment(order: Order):
        try:
            intent = stripe.PaymentIntent.retrieve(
                order.stripe_payment_intent_id
            )
            if intent.status == 'succeeded':
                order.status = 'paid'
                order.save()
                return True
            return False
        except stripe.error.StripeError as e:
            raise ValueError(f"Stripe error: {str(e)}")