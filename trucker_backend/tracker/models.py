from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django_ulid.models import ULIDField, default
import uuid
import ulid
from django.core.validators import MaxValueValidator, MinValueValidator


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        """
            Create and return a user with an email and password.
        """
        if not email:
            raise ValueError("The email field is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class Driver(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that extends AbstractBaseUser.
    """
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False, max_length=36)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.IntegerField(null=True)
    password = models.CharField(max_length=255)
    total_cycle_hours = models.FloatField(default=70.0)  # 70hrs/8days
    current_cycle_used = models.FloatField(default=0.0)
    driver_number = models.CharField(max_length=255, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    objects = UserManager()

    def __str__(self):
        return self.email

class Trip(models.Model):
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False, max_length=36)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    home_operating_center = models.CharField(max_length=255)
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True)
    status = models.CharField(max_length=20, choices=[('planned', 'Planned'), ('in_progress', 'In Progress'), ('completed', 'Completed')])
    vehicle_no = models.IntegerField(default=0)
    trailer_no = models.CharField(max_length=25)#A list is more suitable since there may be multiple trialers

class LogSheet(models.Model):
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False, max_length=36)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    # co_driver = models.ForeignKey(Driver, on_delete=models.SET_NULL)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    shipper = models.CharField(max_length=255)
    commodity = models.CharField(max_length=255)
    total_mileage = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)
    remarks = models.CharField(default="No Remarks", max_length=10000)
    off_duty = models.FloatField(default=0.0)#seconds
    on_duty = models.FloatField(default=0.0)
    berth = models.FloatField(default=0.0)
    driving = models.FloatField(default=0.0)


class LogEntry(models.Model):
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False, max_length=36)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    logsheet = models.ForeignKey(LogSheet, on_delete=models.CASCADE)

    # Automatic update
    lat = models.FloatField([MinValueValidator(-90), MaxValueValidator(90)])
    long = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    location = models.CharField(max_length=255)
    
    start_time = models.TimeField(auto_now_add=True)
    end_time = models.TimeField(null=True, blank=True)
    duration = models.FloatField(default=0.0)  # in hours

    duty_status = models.CharField(
        max_length=20,
        choices=[
            ('off_duty', 'Off Duty'),
            ('sleeper', 'Sleeper'),
            ('driving', 'Driving'),
            ('on_duty', 'On Duty')
        ]
    )
    activity = models.TextField(null=True, blank=True)


# pip install psycopg2-binary django gdal

# INSTALLED_APPS = [
#     ...
#     'django.contrib.gis',
#     ...
# ]


# from django.contrib.gis.db import models

# class Place(models.Model):
#     name = models.CharField(max_length=100)
#     location = models.PointField()  # Stores longitude and latitude

#     def __str__(self):
#         return self.name
    
# from django.contrib.gis.geos import Point

# place = Place(
#     name="Example Location",
#     location=Point(-73.935242, 40.730610)  # (longitude, latitude)
# )
# place.save()