from django.db import models
from django.conf import settings

class Item(models.Model):
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='items'
    )
    item_name = models.CharField(max_length=255)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    categorie = models.CharField(max_length=50)
    
    def __str__(self):
        return self.item_name

class ItemImage(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_url = models.ImageField(upload_to='items/')
    
    def __str__(self):
        return f"Image for {self.item.item_name}"