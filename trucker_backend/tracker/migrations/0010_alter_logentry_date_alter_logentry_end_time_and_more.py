# Generated by Django 5.1.7 on 2025-03-25 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0009_alter_logentry_id_alter_logsheet_id_alter_trip_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='logentry',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='logentry',
            name='end_time',
            field=models.TimeField(null=True),
        ),
        migrations.AlterField(
            model_name='logentry',
            name='start_time',
            field=models.TimeField(auto_now_add=True),
        ),
    ]
