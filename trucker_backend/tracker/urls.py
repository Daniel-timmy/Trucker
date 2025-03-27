from django.urls import path
from .views import (RegisterView, TripView, TripModifyView,
                     LogSheetListCreateView, LogSheetModifyView,
                     LogEntryListCreateView, LogEntryModifyView, TripRetrieveByStatus)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('trips/', TripView.as_view(), name='create_trips'),
    path('trips/status/<str:status>/', TripRetrieveByStatus.as_view(), name="retrieve_by_status"),
    path('trips/<str:id>/', TripModifyView.as_view(), name='modify_trip'),
    path('logsheets/<str:id>/trips/', LogSheetListCreateView.as_view(), name='list_and_create_logsheets'),
    path('logsheets/<str:id>/', LogSheetModifyView.as_view(), name='RUD_Logsheet'),
    path('logentries/<str:id>/logsheet/', LogEntryListCreateView.as_view(), name='logentry_creation'),
    path('logentries/<str:id>/', LogEntryModifyView.as_view(), name='log_entry_modify'), 
]