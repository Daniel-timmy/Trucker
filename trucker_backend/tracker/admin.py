from django.contrib import admin
from .models import Driver, Trip, LogEntry, LogSheet

admin.site.register(Driver)
admin.site.register(Trip)
admin.site.register(LogSheet)
admin.site.register(LogEntry)
