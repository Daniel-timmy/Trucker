# Generated by Django 5.1.7 on 2025-03-24 22:06

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0006_alter_driver_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='current_cycle_used',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='driver',
            name='driver_number',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='driver',
            name='total_cycle_hours',
            field=models.FloatField(default=70.0),
        ),
        migrations.AlterField(
            model_name='driver',
            name='id',
            field=models.CharField(default=uuid.uuid4, editable=False, max_length=36, primary_key=True, serialize=False),
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('home_operating_center', models.CharField(max_length=255)),
                ('current_location', models.CharField(max_length=255)),
                ('pickup_location', models.CharField(max_length=255)),
                ('dropoff_location', models.CharField(max_length=255)),
                ('start_date', models.DateTimeField(auto_now_add=True)),
                ('end_date', models.DateTimeField()),
                ('status', models.CharField(choices=[('planned', 'Planned'), ('in_progress', 'In Progress'), ('completed', 'Completed')], max_length=20)),
                ('vehicle_no', models.IntegerField(default=0)),
                ('trailer_no', models.CharField(max_length=25)),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LogSheet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shipper', models.CharField(max_length=255)),
                ('commodity', models.CharField(max_length=255)),
                ('total_mileage', models.IntegerField(default=0)),
                ('date', models.DateField(auto_now_add=True)),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tracker.trip')),
            ],
        ),
        migrations.CreateModel(
            name='LogEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lat', models.FloatField()),
                ('long', models.FloatField()),
                ('location', models.CharField(max_length=255)),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('duration', models.FloatField()),
                ('duty_status', models.CharField(choices=[('off_duty', 'Off Duty'), ('sleeper', 'Sleeper'), ('driving', 'Driving'), ('on_duty', 'On Duty')], max_length=20)),
                ('point_type', models.CharField(choices=[('start', 'Start'), ('pickup', 'Pickup'), ('dropoff', 'Dropoff'), ('fuel', 'Fuel'), ('rest', 'Rest'), ('scale', 'Scale')], max_length=20)),
                ('logsheet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tracker.logsheet')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tracker.trip')),
            ],
        ),
    ]
