from rest_framework import serializers
from .models import Driver
from rest_framework.serializers import ValidationError
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction



class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id','email', 'first_name', 'last_name', 'password', 'phone_number']

    def create(self, validated_data):
        try:
            with transaction.atomic():
                if Driver.objects.filter(email=validated_data['email']).exists():
                    raise ValidationError({'error': 'User with email already exist!'})
                driver = Driver.objects.create(email=validated_data['email'],
                                           first_name=validated_data['first_name'],
                                           last_name=validated_data['last_name'],
                                           phone_number=validated_data['phone_number']
                                             )
                driver.set_password(validated_data['password'])
                driver.save()
            return driver
        except Exception as e:
            #  logger.error(f"Error during user registration: {e}")
            return Response({'error': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
