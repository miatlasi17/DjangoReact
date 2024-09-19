from rest_framework import serializers
from .models import Todo, Product, Banner, Cart, CartItem
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from .models import CustomUser

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'completed']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'image']
        
class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'banner_image', 'expiry_date', 'expired']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    product_id = serializers.IntegerField(source='product.id', read_only=True)  # You can keep this if needed

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'product_id']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)  # Removed source argument

    class Meta:
        model = Cart
        fields = ['id', 'user', 'total_price', 'items']  # Changed user_id to user
        

User = get_user_model()

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user