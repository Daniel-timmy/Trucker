from django.shortcuts import render
from .models import Driver
from rest_framework.generics import CreateAPIView
from .serializers import DriverSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

class RegisterView(CreateAPIView):
    """
    Register view
    """
    permission_classes = (AllowAny,)
    serializer_class = DriverSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        driver = serializer.save()
        print(driver)
        
        return Response({'data': serializer.data})