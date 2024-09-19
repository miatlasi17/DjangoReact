# admin.py

from django.contrib import admin
from .models import Todo, Product, Banner

class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')  # Customize the fields to display in the list view

class ProductsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'inStock', 'price')  # Customize the fields to display in the list view

class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'banner_image', 'expiry_date', 'expired')  # Customize the fields to display in the list view

# Register your models here
admin.site.register(Todo, TodoAdmin)
admin.site.register(Product, ProductsAdmin)
admin.site.register(Banner, BannerAdmin)
