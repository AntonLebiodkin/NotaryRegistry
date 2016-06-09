# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-06 11:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notary_registry', '0007_auto_20160603_1718'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notarius',
            name='certificate_num',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='notarius',
            name='name',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='notarius',
            name='patronym',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='notarius',
            name='surname',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='place',
            name='city',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='place',
            name='street',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='region',
            name='name',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]