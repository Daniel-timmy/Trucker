from .models import LogSheet
from datetime import datetime, timedelta
from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from django.core.cache import cache
import requests
from trucker_backend.settings import ARCGIS_API_KEY

def seventy_hour_window_checker(driver):
    
    days = (datetime.now().date() - driver.start_date).days
    if not driver.start_date:
        return
    
    if driver.start_date and driver.start_date > datetime.now().date():
        remaining_days = driver.start_date - datetime.now().date()
        raise ValidationError(f'You have exhausted your 70 hours per eight days window wait for another {remaining_days.days} to resume duty')

    if days <= 8:
        total = LogSheet.objects.filter(date__gte=
                                        driver.start_date).aggregate(total_driving_time=
                                                            Sum('driving'), total_on_duty_time=Sum('on_duty'))

    else:
        start_date = datetime.now() - timedelta(days=days)
        total = LogSheet.objects.filter(date__gte=
                                        start_date).aggregate(total_driving_time=
                                                            Sum('driving'), total_on_duty_time=Sum('on_duty'))
    if total['total_driving_time'] == None or total['total_on_duty_time'] == None:
        return
    
    if total['total_driving_time'] + total['total_on_duty_time'] >= 70.0:
        next_start_date = datetime.now() + timedelta(hours=48)
        driver.start_date = next_start_date.date()
        raise ValidationError('You have exhausted your 70 hours per eight days window wait for another 34 hours to resume duty')
    else:
        driver.current_cycle_used = total['total_driving_time'] + total['total_on_duty_time']


def geocode_address(address):
    cache_key = f"geocode_{address}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return cached_result
    geocode_url = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
    

    params = {
        'f': "json",
        "singleLine": address,
        "api_key": ARCGIS_API_KEY,
    }
    response = requests.get(geocode_url, params=params)
    response.raise_for_status()
    print(f'Result from geocode_address {response}')

    data = response.json()
    if not data.get("candidates"):
        raise ValidationError(f"MO candidates found for address: {address}")
    
    coords = data['candidates'][0]['location']
    result = {'longitude': coords["x"], "latitude": coords['y']}

    cache.set(cache_key, result, timeout=86400)
    return result
