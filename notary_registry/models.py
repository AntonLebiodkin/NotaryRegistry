#coding=UTF-8
from __future__ import unicode_literals
from django.db import models

class Region(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100, blank=True)



class Place(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    city = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=100, blank=True)
    building = models.CharField(max_length=100)


class Activity_Type(models.Model):
    id = models.IntegerField(primary_key=True)
    description = models.CharField(max_length=100)


class Phone(models.Model):
    phone_number = models.CharField(max_length=100)
    type = models.CharField(max_length=100, default=0)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)


class Admin(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    patronym = models.CharField(max_length=100)
    username = models.CharField(max_length=100, default='root')
    password = models.CharField(max_length=256, default='1111')
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    phone = models.ForeignKey(Phone, on_delete=models.CASCADE)


class Notary_Office(models.Model):
    name = models.CharField(max_length=200)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)


class Notarius(models.Model):
    name = models.CharField(max_length=100, blank=True)
    surname = models.CharField(max_length=100, blank=True)
    patronym = models.CharField(max_length=100, blank=True)
    certificate_num = models.CharField(max_length=100, blank=True)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    activity_type = models.ForeignKey(Activity_Type, on_delete=models.CASCADE)
    notary_office = models.ForeignKey(Notary_Office, on_delete=models.CASCADE, blank=True, null=True)


