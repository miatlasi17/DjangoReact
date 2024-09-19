# views/cart_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Product, Cart, CartItem
from ..serializers import CartSerializer, CartItemSerializer

class CartView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            # Authenticated user logic
            try:
                cart = Cart.objects.get(user=user)
                serializer = CartSerializer(cart)
                return Response(serializer.data)
            except Cart.DoesNotExist:
                cart = Cart.objects.create(user=user)
                serializer = CartSerializer(cart)
                return Response(serializer.data)
        else:
            # Guest user logic using sessions
            session_cart = request.session.get('cart', {})
            cart_items = []

            for item_id, item in session_cart.items():
                try:
                    product = Product.objects.get(id=item_id)
                    cart_items.append({
                        'product_id': product.id,
                        'name': item.get('name', product.name),  # Get 'name' from session or use product name
                        'quantity': item.get('quantity', 1),  # Default value if 'quantity' is missing
                        'price': item.get('price', str(product.price)),  # Default value if 'price' is missing
                        'image': item.get('image', '')  # Default value if 'image' is missing
                    })
                except Product.DoesNotExist:
                    continue  # Skip if the product does not exist

            total_price = sum(float(item.get('price', '0.00')) * item.get('quantity', 1) for item in cart_items)

            return Response({
                'total_price': round(total_price, 2),
                'items': cart_items
            })

    def post(self, request):
        action = request.data.get('action')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if action == 'add':
            try:
                product = Product.objects.get(id=product_id)

                if request.user.is_authenticated:
                    # Authenticated user logic
                    cart, _ = Cart.objects.get_or_create(user=request.user)
                    cart.add_item(product, quantity)
                    return Response({"message": "Item added successfully"})
                else:
                    # Guest user logic using sessions
                    session_cart = request.session.get('cart', {})

                    if str(product_id) in session_cart:
                        session_cart[str(product_id)]['quantity'] += quantity
                    else:
                        session_cart[str(product_id)] = {
                            'quantity': quantity,
                            'price': str(product.price),
                            'name': product.name,
                            'image': request.build_absolute_uri(product.image.url),
                            'product_id': product.id
                        }

                    request.session['cart'] = session_cart
                    request.session.modified = True
                    return Response({"message": "Item added to guest cart successfully"})

            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        elif action == 'remove':
            if request.user.is_authenticated:
                # Authenticated user logic
                cart_item_id = request.data.get('cart_item_id')
                try:
                    cart_item = CartItem.objects.get(id=cart_item_id)
                    cart_item.cart.remove_item(cart_item)
                    return Response({"message": "Item removed successfully"})
                except CartItem.DoesNotExist:
                    return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)
            else:
                # Guest user logic using sessions
                session_cart = request.session.get('cart', {})
                if str(product_id) in session_cart:
                    del session_cart[str(product_id)]
                    request.session['cart'] = session_cart
                    request.session.modified = True
                    return Response({"message": "Item removed from guest cart"})
                else:
                    return Response({"error": "Item not found in guest cart"}, status=status.HTTP_404_NOT_FOUND)

        elif action == 'clear':
            if request.user.is_authenticated:
                # Authenticated user logic
                cart, _ = Cart.objects.get_or_create(user=request.user)
                cart.clear()
                return Response({"message": "Cart cleared successfully"})
            else:
                # Guest user logic using sessions
                request.session['cart'] = {}
                request.session.modified = True
                return Response({"message": "Guest cart cleared successfully"})

        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
