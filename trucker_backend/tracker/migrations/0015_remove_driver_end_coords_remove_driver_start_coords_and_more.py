# Generated by Django 5.1.7 on 2025-04-03 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0014_driver_end_coords_driver_start_coords'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='driver',
            name='end_coords',
        ),
        migrations.RemoveField(
            model_name='driver',
            name='start_coords',
        ),
        migrations.AddField(
            model_name='trip',
            name='end_coords',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='trip',
            name='start_coords',
            field=models.JSONField(default=dict),
        ),
    ]
