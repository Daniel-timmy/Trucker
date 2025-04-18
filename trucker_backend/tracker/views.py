from django.shortcuts import render
from .models import Driver, Trip, LogSheet, LogEntry
from rest_framework.generics import ListAPIView, UpdateAPIView, CreateAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import DriverSerializer, TripSerializer, LogSheetSerializer, LogEntrySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from rest_framework.serializers import ValidationError



class RegisterView(CreateAPIView):
    """
    Register view
    """
    permission_classes = (AllowAny,)
    serializer_class = DriverSerializer
    queryset = Driver.objects.all()
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            driver = serializer.save()
            response_data = self.get_serializer(driver).data 
        
            return Response({'success': 'true', 'data': response_data})
        except Exception as e:
            print('Error in RegisterView post method')
            print(e)
            return Response({'success': 'false', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DriverModifyView(RetrieveUpdateDestroyAPIView):
    """
    Driver
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = DriverSerializer
    lookup_field = 'id'

   
    def get_queryset(self):
        id = self.request.parser_context['kwargs'].get('id') 

        return Driver.objects.filter(id=id)

class TripView(ListCreateAPIView):
    """
    Trip veiw class
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer

    def get_queryset(self):
        # Filter trips by the authenticated driver
        return Trip.objects.filter(driver=self.request.user)

    def post(self, request, *args, **kwargs):
        try:

            serializer = self.get_serializer(data=request.data)

            serializer.is_valid(raise_exception=True)
            trip = serializer.save()
            response_data = self.get_serializer(trip).data 
            return Response({'success': 'true', 'data': response_data})
        except Exception as e:
            print('Error in TripView post method')
            return Response({'success': 'false', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TripRetrieveByStatus(ListAPIView):
    """
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer
    lookup_field = 'status'


    def get_queryset(self):
        status = self.request.parser_context['kwargs'].get('status') 
        return Trip.objects.filter(driver=self.request.user, status=status)

        
class TripModifyView(RetrieveUpdateDestroyAPIView):
    """
    A view class that performs retrieve, update on a trip class
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer
    lookup_field = 'id' 
    def get_queryset(self):
        return Trip.objects.filter(driver=self.request.user)
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        print(request.data)

        id = self.request.parser_context['kwargs'].get('id')
        return super().update(request, *args, **kwargs)

class TripPatchView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer
    lookup_field = 'id' 

    def get_queryset(self):
        return Trip.objects.filter(driver=self.request.user)
    
    def patch(self, request, *args, **kwargs):
      id = self.request.parser_context['kwargs'].get('id') 
      todays_date = datetime.now().date()
      trip = Trip.objects.filter(id=id, driver=self.request.user).first()
      if not trip:
          return ValidationError('Trip not found')
      try :
          trip.last_refuel_mileage = request.data.get('last_refuel_mileage')
          trip.last_refuel = todays_date
          trip.save()
      except Exception as e:
          return Response({'success': 'false', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
      return Response({'success': 'true', 'data': self.get_serializer(trip).data})
  
    
class LogSheetListCreateView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogSheetSerializer
    
    def get_queryset(self):
        trip_id = self.request.parser_context['kwargs'].get('id') 
        return LogSheet.objects.filter(driver=self.request.user, trip_id=trip_id)
    
class LogSheetModifyView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogSheetSerializer
    lookup_field = 'id' 

    
    def get_queryset(self):
        todays_date = datetime.now().strftime('%Y-%m-%d')
        return LogSheet.objects.filter(driver=self.request.user, date=todays_date)
    
    def patch(self, request, *args, **kwargs):
        id = self.request.parser_context['kwargs'].get('id') 
        todays_date = datetime.now().date()
        logsheet = LogSheet.objects.filter(driver=self.request.user, id=id).first()
        if logsheet and logsheet.date == todays_date:
            return super().patch(request, *args, **kwargs)
        return Response({'error': 'You can not update the previous day LogSheet', 'success': 'false'})
    
    def delete(self, request, *args, **kwargs):
        id = self.request.parser_context['kwargs'].get('id') 
        todays_date = datetime.now().date()
        logsheet = LogSheet.objects.filter(driver=self.request.user, id=id).first()
        if logsheet and logsheet.date == todays_date:
            return super().delete(request, *args, **kwargs)
        return Response({'error': 'You can not delete the previous day LogSheet', 'success': 'false'})

class LogEntryListCreateView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogEntrySerializer
    
    def get_queryset(self):
        sheet_id = self.request.parser_context['kwargs'].get('id') 
        return LogEntry.objects.filter(logsheet_id=sheet_id).order_by('-start_time')
    
    def post(self, request, *args, **kwargs):
        sheet_id = self.request.parser_context['kwargs'].get('id') 
        if LogEntry.objects.filter(logsheet_id=sheet_id, end_time=None).exists():
            return Response({'error': 'Close the previous LogEntry by adding an end_time before creating a new entry', 'success': 'false'})
        try:

            return super().post(request, *args, **kwargs)
        except Exception as e:
            if hasattr(e, 'detail') and isinstance(e.detail, dict):
                error_message = next(iter(e.detail.values()))[1] if isinstance(next(iter(e.detail.values())), list) else next(iter(e.detail.values()))
                error_message = error_message.split('=')[1]
            else:
                error_message = str(e)
            return Response({'success': 'false', 'details': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogEntryModifyView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogEntrySerializer
    lookup_field = 'id' 

    def get_queryset(self):
        return LogEntry.objects.filter()
    
    def patch(self, request, *args, **kwargs):
        id = self.request.parser_context['kwargs'].get('id') 
        todays_date = datetime.now().date()
        logentry = LogEntry.objects.filter(id=id).first()
        if logentry and logentry.date == todays_date:
            return super().patch(request, *args, **kwargs)
        return Response({'error': 'You can not update the previous day LogEntry', 'success': 'false'})
    
    def delete(self, request, *args, **kwargs):
        id = self.request.parser_context['kwargs'].get('id') 
        todays_date = datetime.now().date()
        logentry = LogEntry.objects.filter(id=id).first()
        if logentry and logentry.date == todays_date:
            return super().delete(request, *args, **kwargs)
        return Response({'error': 'You can not delete the previous day LogEntry', 'success': 'false'})

class TripLogEntriesView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogEntrySerializer

    def get_queryset(self):
        trip_id = self.request.parser_context['kwargs'].get('id')
        if not trip_id:
            return LogEntry.objects.none()  
        
        trip = Trip.objects.filter(id=trip_id)
        if not trip:
            return LogEntry.objects.none()  
        return LogEntry.objects.filter(trip=trip_id)
    
class SheetsLogEntryListView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogEntrySerializer

    def get_queryset(self):
        sheet_id = self.request.parser_context['kwargs'].get('id') 
        if not sheet_id:
            return LogEntry.objects.none()
        return LogEntry.objects.filter(logsheet_id=sheet_id).order_by('-start_time').reverse()
