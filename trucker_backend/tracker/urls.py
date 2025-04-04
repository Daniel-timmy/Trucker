from django.urls import path
from .views import (RegisterView, TripView, TripModifyView, DriverModifyView,
                     LogSheetListCreateView, LogSheetModifyView, TripLogEntriesView,
                     LogEntryListCreateView, LogEntryModifyView, TripRetrieveByStatus, SheetsLogEntryListView)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('<str:id>/', DriverModifyView.as_view(), name="modify_driver" ),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('trips/new', TripView.as_view(), name='create_trips'), # Create trip change the url in createtrippage and here
    path('trips/status/<str:status>/', TripRetrieveByStatus.as_view(), name="retrieve_by_status"),
    path('trips/<str:id>/', TripModifyView.as_view(), name='modify_trip'),
    path('logsheets/<str:id>/trips/', LogSheetListCreateView.as_view(), name='list_and_create_logsheets'),

    path('logsheets/<str:id>/', LogSheetModifyView.as_view(), name='RUD_Logsheet'),
    
    path('logentries/<str:id>/logsheet/', LogEntryListCreateView.as_view(), name='logentry_creation'),
    path('logentries/<str:id>/', LogEntryModifyView.as_view(), name='log_entry_modify'),
    path('logentries/<str:id>/trip/', TripLogEntriesView.as_view(), name="trip_logentries"),
    path('logentries/<str:id>/logsheets/', SheetsLogEntryListView.as_view(), name='logentry_creation'),
]