from rest_framework import serializers
from .models import Driver, Trip, LogEntry, LogSheet
from rest_framework.serializers import ValidationError
from django.db import transaction
from datetime import datetime, timedelta   
from .utils import seventy_hour_window_checker, geocode_address  




class DriverSerializer(serializers.ModelSerializer):
    total_mileage = serializers.ReadOnlyField()
    total_hours = serializers.ReadOnlyField()
    total_on_duty_time = serializers.ReadOnlyField()
    total_driving_time = serializers.ReadOnlyField()

    class Meta:
        model = Driver
        fields = ['id','email', 'first_name', 'last_name', 
                  'password', 'phone_number','current_cycle_used',
                    'cycle_hours', 'cycle_days', 'driver_number',
                      'start_date', 'total_mileage', 'total_hours',
                        'total_on_duty_time', 'total_driving_time',]
        read_only_fields = ['id', 'current_cycle_used', 'cycle_hours', 'cycle_days', 'driver_number', 'start_date']

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
            raise ValidationError('An error occurred during registration.')

class TripSerializer(serializers.ModelSerializer):
    total_mileage = serializers.ReadOnlyField()
    refuel = serializers.ReadOnlyField()
    miles_to_refuel = serializers.ReadOnlyField()
    last_refuel = serializers.ReadOnlyField()
    class Meta:
        model = Trip
        fields = ['id',
                  'home_operating_center', 
                  'current_location', 
                  'pickup_location',
                  'dropoff_location',
                  'status',
                  'vehicle_no',
                  'trailer_no',
                   'driver', 
                   'start_date', 
                   'end_date', 
                   'end_coords',
                    'start_coords',
                     'last_refuel_mileage',
                     'total_mileage',
                     'refuel',
                     'miles_to_refuel', 'last_refuel']
        read_only_fields = ['driver', 'end_coords', 'start_coords', 'last_refuel_mileage']
    
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user

        try:
            if Trip.objects.filter(driver=user, status='in_progress').exists():
                    raise ValidationError('Driver already have a trip In progress')
            print(validated_data)
            with transaction.atomic():

                start_address = validated_data['dropoff_location']
                end_address = validated_data['pickup_location']
                start_coords = geocode_address(start_address)
                end_coords = geocode_address(end_address)
                
                trip = Trip.objects.create(
                    driver=user,
                    home_operating_center=validated_data['home_operating_center'], 
                    current_location=validated_data['current_location'], 
                    pickup_location= validated_data['pickup_location'],
                    dropoff_location=validated_data['dropoff_location'],
                    status=validated_data['status'],
                    end_date=validated_data['end_date'],
                    vehicle_no=validated_data['vehicle_no'],
                    trailer_no=validated_data['trailer_no'],
                    start_coords=start_coords,
                    end_coords=end_coords
                    )
                
                trip.save()
                driver = Driver.objects.filter(id=user).first()

                if driver.start_date == None:
                    driver.start_date = trip.start_date
                elif driver.start_date and driver.start_date > datetime.now().date():
                    seventy_hour_window_checker(driver=driver)
   
                driver.save()
                return trip
        except Exception as e:
            raise ValidationError(f'An error occurred during trip creation.{e} { self.context}')
        
    


class LogSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogSheet
        fields = ['id', 'driver', 'trip', 'shipper', 'commodity', 'total_mileage', 'date', 'berth', 'on_duty', 'off_duty', 'driving', 'on_duty_start_time']
        read_only_fields = ['id', 'driver', 'date', 'trip', 'berth', 'on_duty', 'off_duty', 'driving', 'on_duty_start_time']

    def create(self, validated_data):
        request = self.context.get('request')
        driver = Driver.objects.filter(id=request.user).first()
        trip_id = request.parser_context['kwargs'].get('id') 
        todays_date = datetime.now().strftime('%Y-%m-%d')
        seventy_hour_window_checker(driver=driver)

        try:
            with transaction.atomic():
                if not Trip.objects.filter(driver=driver, status='in_progress', id=trip_id).exists():
                    raise ValidationError({'error': 'Incorrect trip id','success': 'False'})
                if LogSheet.objects.filter(trip_id=trip_id, date=todays_date).exists():
                    raise ValidationError({'error': f'A LogSheet for today {todays_date} already exist','success': 'False'})
                trip = Trip.objects.get(id=trip_id)
                print(request.user)


                logsheet = LogSheet.objects.create(
                    driver=driver,
                    trip=trip,
                    shipper=validated_data['shipper'],
                    commodity=validated_data['commodity'],
                )
                logsheet.save()
                return logsheet
                    
        except Exception as e:
            print(e)
            raise ValidationError({'error': 'Error creating Logsheet','success': 'False', 'msg': str(e)})

class LogEntrySerializer(serializers.ModelSerializer):
    log_id = serializers.CharField(write_only=True, required=False)
    trip_id = serializers.CharField(write_only=True, required=False)
    span = serializers.CharField(write_only=True, required=True)
    startTime = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = LogEntry
        fields = ['id', 'trip', 'logsheet',
                   'start_time', 'end_time', 'lat',
                     'long', 'location', 'duration',
                       'duty_status', 'activity', 'log_id', 'trip_id', 'span', 'startTime']
        read_only_fields = ['id', 'trip', 'logsheet', 'duration', 'start_time', 'end_time', 'long', 'lat']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        sheet_id = validated_data.pop('log_id', None)
        trip_id = validated_data.pop('trip_id', None)
        startTime = validated_data.pop('startTime', None)
        todays_date = datetime.now().strftime('%Y-%m-%d')
        driving_time = 11.0

        driver = Driver.objects.filter(id=request.user).first()
        seventy_hour_window_checker(driver=driver)

        try:
            with transaction.atomic():
                if not Trip.objects.filter(driver=user, status='in_progress', id=trip_id).exists():
                    raise ValidationError({'error': 'Incorrect trip id', 'success': 'False'})
                trip = Trip.objects.filter(id=trip_id).first()
                if not LogSheet.objects.filter(id=sheet_id, trip_id=trip.id, date=todays_date).exists():
                    raise ValidationError(f'A LogSheet with id {sheet_id} does not exist')

                span =  validated_data['span'].split(':')
                start_time = datetime.strptime(startTime, "%H:%M").time()
                start_time_datetime_obj = datetime.combine(datetime.today(), start_time)
                end_time_datetime_obj = start_time_datetime_obj + timedelta(hours=int(span[0]), minutes=int(span[1]))
                end_time = end_time_datetime_obj.time()
                
               
                logsheet = LogSheet.objects.filter(id=sheet_id, trip_id=trip.id, date=todays_date).first()
                prev_logentry = LogEntry.objects.filter(logsheet=logsheet).order_by('-start_time').first()
                if datetime.combine(datetime.today(), start_time) > datetime.now():
                    raise ValidationError('You can not enter activities you have not done.')

                if prev_logentry and prev_logentry.end_time != start_time:
                    raise ValidationError(f'Your start time must be the same as the end time of the previous log entry {prev_logentry.end_time}')

                if start_time > end_time:
                    raise ValidationError('Your duration must be within 24hours')
                
                location_coords = geocode_address(validated_data['location'])
                
        
                duration = float(span[0]) + (float(span[1]) / 60)
                logentry = LogEntry.objects.create(
                    trip=trip,
                    logsheet=logsheet,
                    lat=float(location_coords['latitude']),
                    long=float(location_coords['longitude']),
                    location=validated_data['location'],
                    duration=duration,
                    duty_status=validated_data['duty_status'],
                    start_time=start_time,
                    end_time=end_time,
                    activity=validated_data['activity']
                )
                total_time = float(span[0]) + (int(span[1]) / 60) 
                if logsheet.on_duty_start_time != None:
                    current_datetime = datetime.now()
                    start_time_obj = datetime.combine(datetime.today(), logsheet.on_duty_start_time)
                    on_duty_duration = current_datetime - start_time_obj
                    print(on_duty_duration) 
                
                if validated_data['duty_status'] == 'sleeper':
                    logsheet.berth += total_time
                elif validated_data['duty_status'] == 'driving':
                    if logsheet.on_duty_start_time == None:
                        logsheet.on_duty_start_time = start_time
                    if on_duty_duration and on_duty_duration >= timedelta(hours=14): 
                        raise ValidationError('14-hr Window exceeded: You can not go on anymore Driving time.')
                    if logsheet.driving >= driving_time:
                        raise ValidationError('You have max out your driving time')
                    elif logsheet.driving + total_time > driving_time:
                        raise ValidationError(f'You have {driving_time - logsheet.driving} hours left. Choose within that range.')
                    else:
                        logsheet.driving += total_time

                elif validated_data['duty_status'] == 'on_duty':
                    if logsheet.on_duty_start_time == None:
                        logsheet.on_duty_start_time = start_time
                    logsheet.on_duty += total_time
                else:
                    logsheet.off_duty += total_time
                
                logsheet.save()
                logentry.save()
                return logentry
                    
        except Exception as e:
            raise ValidationError(str(e))