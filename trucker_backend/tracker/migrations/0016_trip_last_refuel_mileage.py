# Generated by Django 5.1.7 on 2025-04-05 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0015_remove_driver_end_coords_remove_driver_start_coords_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='last_refuel_mileage',
            field=models.FloatField(default=0.0),
        ),
    ]
