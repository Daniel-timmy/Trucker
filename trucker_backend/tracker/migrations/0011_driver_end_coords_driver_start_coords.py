# Generated by Django 5.1.7 on 2025-04-03 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0010_remove_driver_end_coords_remove_driver_start_coords'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='end_coords',
            field=models.JSONField(default={}),
        ),
        migrations.AddField(
            model_name='driver',
            name='start_coords',
            field=models.JSONField(default={}),
        ),
    ]
