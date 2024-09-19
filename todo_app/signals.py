from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Cart, CartItem

@receiver(m2m_changed, sender=Cart.items.through)
def cart_item_changed(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove']:
        instance.update_total_price()
        # You can add more logic here, such as sending notifications or updating order totals
        
    if action == 'pre_remove':
        # Prevent deletion of items if they're part of an active order
        if CartItem.objects.filter(cart=instance).exclude(order__isnull=True).exists():
            raise Exception("Cannot remove item from cart if it's part of an active order")

@receiver(m2m_changed, sender=Cart.items.through)
def cart_item_changed_after(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove']:
        # Update product inventory
        for item in instance.items.all():
            item.product.inStock -= item.quantity
            item.product.save()