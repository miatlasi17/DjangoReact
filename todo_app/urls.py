# myapp/urls.py
from django.urls import path
from .views.ProductView import (
    todo_list, create_todo, get_todo, update_todo, delete_todo,
    products_list, get_banner, product_detail
)
from .views.CartView import CartView
from .views.AuthView import SignupView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('todos/', todo_list),
    path('products/', products_list),
    path('products/<int:product_id>/', product_detail, name='product_detail'),
    path('banners/', get_banner),
    path('todos/create/', create_todo),
    path('todos/<pk>/', get_todo),
    path('todos/<pk>/update/', update_todo),
    path('todos/<pk>/delete/', delete_todo),
    path('cart/', CartView.as_view(), name='cart'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
