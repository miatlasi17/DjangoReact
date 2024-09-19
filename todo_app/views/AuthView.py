from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from djoser.serializers import UserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import time

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers import UserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

class SignupView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            
            return Response({
                'user': serializer.data,
                'access': access_token,
                'refresh': refresh_token
            }, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = TokenObtainPairSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.user
            
            # Create a custom refresh token
            refresh_token = RefreshToken.for_user(user)
            
            # Create a custom access token
            access_token = AccessToken()
            access_token.payload['custom_claims'] = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
            
            # Set the expiration time for the access token
            access_token.payload['exp'] = int(time.time()) + 3600  # Expire in 1 hour
            
            # Manually populate the user data
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
            
            return Response({
                'refresh': str(refresh_token),
                'access': str(access_token),
                'user': user_data
            })
        return Response(serializer.errors, status=400)