from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from ..models import Todo, Product, Banner
from ..serializers import TodoSerializer, ProductSerializer, BannerSerializer
from django.views.decorators.csrf import csrf_exempt  # Import csrf_exempt
import json  # Import json module

@require_http_methods(['GET'])
def todo_list(request):
    todos = Todo.objects.all()
    serializer = TodoSerializer(todos, many=True)
    return JsonResponse(serializer.data, safe=False)

@csrf_exempt  # Add csrf_exempt decorator
@require_http_methods(['POST'])
def create_todo(request):
    try:
        # Parse the JSON body from the request
        data = json.loads(request.body)
        serializer = TodoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201, safe=False)
        return JsonResponse(serializer.errors, status=400, safe=False)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

@require_http_methods(['GET'])
def get_todo(request, pk):
    todo = Todo.objects.get(pk=pk)
    serializer = TodoSerializer(todo)
    return JsonResponse(serializer.data, safe=False)

@csrf_exempt 
@require_http_methods(['PUT'])
def update_todo(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
        data = json.loads(request.body)
        serializer = TodoSerializer(todo, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, safe=False)
        return JsonResponse(serializer.errors, status=400, safe=False)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
@csrf_exempt 
@require_http_methods(['DELETE'])
def delete_todo(request, pk):
    todo = Todo.objects.get(pk=pk)
    todo.delete()
    return JsonResponse({}, status=204, safe=False)

@require_http_methods(['GET'])
def products_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)

@require_http_methods(['GET'])
def product_detail(request, product_id):
    # Retrieve the product by ID or return a 404 if not found
    product = get_object_or_404(Product, id=product_id)
    serializer = ProductSerializer(product)
    return JsonResponse(serializer.data)

@require_http_methods(['GET'])
def get_banner(request):
    banner = Banner.objects.all()
    serializer = BannerSerializer(banner, many=True)
    return JsonResponse(serializer.data, safe=False)

