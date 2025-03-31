from rest_framework import serializers
from .models import Driver, Trip, LogEntry, LogSheet
from rest_framework.serializers import ValidationError
from django.db import transaction
from datetime import datetime



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
            raise ValidationError({'error': 'An error occurred during registration.'})

class TripSerializer(serializers.ModelSerializer):
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
                   'driver', 'start_date', 'end_date' ]
        read_only_fields = ['driver']
    
    def create(self, validated_data):
        request = self.context.get('request')
        print(request)
        user = request.user

        try:
            if Trip.objects.filter(driver=user, status='in_progress').exists():
                    raise ValidationError({'error': 'Driver already have a trip In progress', 'success': 'false'})
            print(validated_data)
            with transaction.atomic():
                
                trip = Trip.objects.create(
                    driver=user,
                    home_operating_center=validated_data['home_operating_center'], 
                    current_location=validated_data['current_location'], 
                    pickup_location=validated_data['pickup_location'],
                    dropoff_location=validated_data['dropoff_location'],
                    status=validated_data['status'],
                    vehicle_no=validated_data['vehicle_no'],
                    trailer_no=validated_data['trailer_no'])
                
                trip.save()
                return trip
        except Exception as e:
            raise ValidationError({'error': 'An error occurred during trip creation.','msg': e, 'context': self.context})


class LogSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogSheet
        fields = ['id', 'driver', 'trip', 'shipper', 'commodity', 'total_mileage', 'date']
        read_only_fields = ['id', 'driver', 'date', 'trip']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        trip_id = request.parser_context['kwargs'].get('id') 
        todays_date = datetime.now().strftime('%Y-%m-%d')
        try:
            with transaction.atomic():
                if not Trip.objects.filter(driver=user, status='in_progress', id=trip_id).exists():
                    raise ValidationError({'error': 'Incorrect trip id','success': 'False'})
                if LogSheet.objects.filter(trip_id=trip_id, date=todays_date).exists():
                    raise ValidationError({'error': f'A LogSheet for today {todays_date} already exist','success': 'False'})
                trip = Trip.objects.get(id=trip_id)
                logsheet = LogSheet.objects.create(
                    driver=user,
                    trip=trip,
                    shipper=validated_data['shipper'],
                    commodity=validated_data['commodity'],
                )
                logsheet.save()
                return logsheet
                    
        except Exception as e:
            raise ValidationError({'error': 'Error creating Logsheet','success': 'False', 'msg': str(e)})

from datetime import datetime, timedelta      
class LogEntrySerializer(serializers.ModelSerializer):
    log_id = serializers.CharField(write_only=True, required=False)
    trip_id = serializers.CharField(write_only=True, required=False)
    span = serializers.CharField(write_only=True, required=True)
    start_time = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = LogEntry
        fields = ['id', 'trip', 'logsheet',
                   'start_time', 'end_time', 'lat',
                     'long', 'location', 'duration',
                       'duty_status', 'activity', 'log_id', 'trip_id', 'span']
        read_only_fields = ['id', 'trip', 'logsheet', 'duration']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        sheet_id = validated_data.pop('log_id', None)
        trip_id = validated_data.pop('trip_id', None)
        todays_date = datetime.now().strftime('%Y-%m-%d')
        print('here in create')
        print(validated_data)

        try:
            with transaction.atomic():
                if not Trip.objects.filter(driver=user, status='in_progress', id=trip_id).exists():
                    raise ValidationError({'error': 'Incorrect trip id', 'success': 'False'})
                trip = Trip.objects.filter(id=trip_id).first()
                if not LogSheet.objects.filter(id=sheet_id, trip_id=trip.id, date=todays_date).exists():
                    raise ValidationError({'error': f'A LogSheet with id {sheet_id} does not exist', 'success': 'False'})

                span =  validated_data['span'].split(':')
                start_time = datetime.strptime(validated_data['start_time'], "%H:%M").time()
                start_time_datetime_obj = datetime.combine(datetime.today(), start_time)
                end_time_datetime_obj = start_time_datetime_obj + timedelta(hours=int(span[0]), minutes=int(span[1]))
                end_time = end_time_datetime_obj.time()
               
                logsheet = LogSheet.objects.filter(id=sheet_id, trip_id=trip.id, date=todays_date).first()
                prev_logentry = LogEntry.objects.filter(logsheet=logsheet).order_by('-start_time').first()

                if prev_logentry and prev_logentry.end_time != start_time:
                    raise ValidationError({'error': f'Your start time must be the same as the end time of the previous log entry {prev_logentry.end_time}'})

                if start_time > end_time:
                    raise ValidationError({'error': 'Your duration must be within 24hours'})

                duration = float(span[0]) + (float(span[1]) / 60)
                logentry = LogEntry.objects.create(
                    trip=trip,
                    logsheet=logsheet,
                    lat=validated_data['lat'],
                    long=validated_data['long'],
                    location=validated_data['location'],
                    duration=duration,
                    duty_status=validated_data['duty_status'],
                    start_time=start_time,
                    end_time=end_time,
                    activity=validated_data['activity']
                )
                total_time = float(span[0]) + (int(span[1]) / 60) 

                if validated_data['duty_status'] == 'sleeper':
                    logsheet.berth = total_time
                elif validated_data['duty_status'] == 'driving':
                    logsheet.driving = total_time
                elif validated_data['duty_status'] == 'on_duty':
                    logsheet.on_duty = total_time
                else:
                    logsheet.off_duty = total_time
                
                logsheet.save()
                logentry.save()
                return logentry
                    
        except Exception as e:
            raise ValidationError({'error': str(e)})
