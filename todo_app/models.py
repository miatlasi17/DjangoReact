from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

User = get_user_model()

def set_default_user(apps, schema_editor):
    Cart = apps.get_model('your_app_name', 'Cart')
    default_user = User.objects.first()  # Get the first user or create a default user
    if default_user is None:
        # Create a default user if none exists
        default_user = User.objects.create_user(username='defaultuser', password='password')
    Cart.objects.update(user=default_user)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, username, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Todo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title  # Display the title of each entry in the admin interface
    

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    inStock = models.BooleanField(default=False)
    image = models.ImageField(upload_to='product/images/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return self.name

class Banner(models.Model):
    title = models.CharField(max_length=100)
    banner_image = models.ImageField(upload_to='banner/images/')
    expiry_date = models.DateField()
    expired = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

    def check_expiry(self):
        if self.expiry_date and self.expiry_date < timezone.now().date():
            self.expired = True
            self.save()

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Changed from user_id to user
    cart_items = models.ManyToManyField('Product', through='CartItem')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for user {self.user.username}"
    
    def update_total_price(self):
        self.total_price = sum(item.product.price * item.quantity for item in self.items.all())
        self.save()

    def add_item(self, product, quantity):
        CartItem.objects.create(
            cart=self,
            product=product,
            quantity=quantity
        )
        self.update_total_price()

    def remove_item(self, cart_item):
        cart_item.delete()
        self.update_total_price()

    def clear(self):
        self.items.all().delete()
        self.total_price = 0
        self.save()

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def get_total_price(self):
        return self.product.price * self.quantity