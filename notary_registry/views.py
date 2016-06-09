# coding=UTF-8
from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader
from . import models
from models import Region, Place, Phone, Notarius, Activity_Type, Admin, Notary_Office
from django.template.loader import render_to_string
from django.shortcuts import redirect
from django.core import serializers
import json
import itertools



def index(request):
    template = loader.get_template('notary_registry/index.html')
    regions = Region.objects.all()
    return HttpResponse(template.render(None, request))

def admin_panel(request):

    print request.session.get("admin")
    if request.session.get("admin") == None or Admin.objects.filter(username=request.session.get("admin")).count == 0:
        return redirect('/admin')


    template = loader.get_template('notary_registry/admin.html')
    regions = Region.objects.all()
    return HttpResponse(template.render({"regions": regions, "admin": request.session.get("admin"),
                                         "notarius": Notarius.objects.all().count(),
                                         "notary_office": Notary_Office.objects.all().count()}, request))


def admin(request):

    create_regions()
    create_admins()
    create_activity_types()

    template = loader.get_template('notary_registry/admin_login.html')
    return HttpResponse(template.render(None, request))

def login(request):
    username = request.POST["username".encode('ascii')]
    password = request.POST["password".encode('ascii')]
    print username, password
    if (Admin.objects.filter(username=username).count() > 0):
        print username + " OK"
        if (Admin.objects.filter(username=username, password=password).count() > 0):
            print password + " OK"
            request.session["admin"] = username
            print username, password
            return redirect('/admin_panel')
        else:
            return render(request, 'notary_registry/admin_login.html', {'password_err': "Wrong password."})
    else:
        return render(request, 'notary_registry/admin_login.html', {'login_err': "Username doesn't exist."})

def load_certificates(request):
    certificates = []

    for n in Notarius.objects.all():
        notarius_json = {}
        notarius_json['label'] = n.certificate_num
        notarius_json['value'] = n.certificate_num
        certificates.append(notarius_json)

    data = json.dumps(certificates)
    mimetype = 'application/json'

    return HttpResponse(data, mimetype)


def add_notarius(request):
    #Notarius
    name = request.POST['name']
    surname = request.POST['surname']
    patronym = request.POST['patronym']
    certificate = request.POST['certificate']
    region = Region.objects.get(name=request.POST['region'])
    city = request.POST['city']
    street = request.POST['street']
    building = request.POST['building']
    print name, surname, patronym
    place = Place.objects.create(region=region, city=city, street=street, building=building)

    type = request.POST['type']
    phone = request.POST['phone']
    Phone.objects.create(type=json.dumps(type), phone_number=phone, place=place)

    admin = Admin.objects.get(username=request.session.get("admin"))
    activity_type = Activity_Type.objects.get(description="Приватний")
    notarius = Notarius.objects.create(name=name, surname=surname, patronym=patronym, certificate_num=certificate,
                                       place=place, admin=admin, activity_type=activity_type, notary_office=None)
    return redirect('/admin_panel')

def add_notary_office(request):
    all_data = False
    name = request.POST['name']
    region = request.POST['region']
    city = request.POST['city']
    street = request.POST['street']
    building = request.POST['building']


    phone_number = request.POST['phone']

    certificates = request.POST.getlist('certificate')


    everybody_exist = True
    if (len(certificates) == 0):
        return render(request, 'notary_registry/admin.html', {"certificate_error" : "Please, add notariuses!"})

    notariuses = []
    for c in certificates:
        current_notarius = Notarius.objects.get(certificate_num=c)
        if current_notarius == None:
            everybody_exist = False
            return render(request, 'notary_registry/admin.html', {'certificate_error': 'Wrong certificate number, plase, type more carefully'})
        notariuses.append(current_notarius)


    region = Region.objects.get(name=region)
    place = Place.objects.create(region=region, city=city, street=street, building=building)
    phone = Phone.objects.create(phone_number=phone_number, type="робочий", place=place)
    office = Notary_Office.objects.create(name=name, place=place)
    activity_type = Activity_Type.objects.get(description="Державний")
    for n in notariuses:
        n.notary_office = office
        n.activity_type = activity_type
        n.save()
        print n

    return redirect('/admin_panel')


def load_offices(request):
    region = request.GET['region']
    region = Region.objects.get(name=region)
    print "FROM BACKEND ", region.name
    offices = Notary_Office.objects.filter(place__region=region)
    print len(offices) == 0
    if len(offices) == 0:
        print "ZERO"
        return HttpResponse("GOOD")
    else:
        result = serializers.serialize("json", offices)
        print offices
        return HttpResponse(result, 'application/json')


def load_cities(request):
    region = request.GET['region']
    print "FROM BACKEND ", region
    region = Region.objects.get(name=region)
    print "FROM BACKEND ", region.name
    cities = Place.objects.filter(region=region)
    print len(cities) == 0
    if len(cities) == 0:
        print "ZERO"
        return HttpResponse("GOOD")
    else:
        result = serializers.serialize("json", cities)
        print cities
        return HttpResponse(result, 'application/json')

def load_regions(request):
    region = Region.objects.all()
    return HttpResponse(serializers.serialize('json', region), 'application/json')

def notarius_search(request):
    name = request.GET['name']
    surname = request.GET['surname']
    patronym = request.GET['patronym']
    certificate_num = request.GET['certificate']
    iterator= itertools.count()
    iterator.next()


    if (certificate_num and surname and name):
        notariuses = Notarius.objects.filter(certificate_num=certificate_num, surname=surname, name=name)
    if (certificate_num and surname):
        notariuses = Notarius.objects.filter(certificate_num=certificate_num, surname=surname)
    if (certificate_num):
        notariuses = Notarius.objects.filter(certificate_num=certificate_num)

    if (len(notariuses) == 0):
        return HttpResponse("None")
    else:
        table = render_to_string('notary_registry/notarius.html', {"notariuses": notariuses, "iterator": iterator})
        return HttpResponse(table)

def office_search(request):
    name = request.GET['office']
    print name
    if (name):
        office = Notary_Office.objects.get(name=name)
        offices = []
        offices.append(office)
        notariuses = Notarius.objects.filter(notary_office=office)
        print "Notariuses ", notariuses
        print office
        iterator= itertools.count()
        iterator.next()
        #notariuses = render_to_string('notary_registry/notarius.html', {"notariuses": notariuses,  "iterator": iterator})
        print notariuses
        table = render_to_string('notary_registry/notary_office.html', {"offices": offices,  "iterator": iterator})
        print table
        res_object = {}
        #res_object["notariuses"] = notariuses
        res_object["table"] = table
        print res_object
        return HttpResponse(json.dumps(res_object))
    else:
        return HttpResponse("None")

def adress_search(request):
    region = request.GET['region']
    city = request.GET['city']
    street = request.GET['street']
    notariuses = Notarius.objects.filter(place__region=region, place__city=city, place__street=street, activity_type__description="Private")
    offices = Notary_Office.objects.filter(place__region=region, place__city=city, place__street=street)
    table = render_to_string('notary_registry/notarius.html', {"notariuses": notariuses, "offices": offices})
    return HttpResponse(json.dumps(table))

def delete_notarius(reqest):
    certificate = reqest.GET['notarius']
    Notarius.objects.get(certificate_num=certificate).delete()
    print certificate
    return redirect('/admin_panel')

def get_notarius(request):
    certificate = request.GET['certificate']



    notarius = Notarius.objects.get(certificate_num=certificate)
    notariuses = []
    notariuses.append(notarius)

    phone = Phone.objects.get(place=notarius.place)
    phones = []
    phones.append(phone)

    place = notarius.place
    places = []
    places.append(place)

    region = notarius.place.region
    regions = []
    regions.append(region)

    print "GET NOTARIUS ", notarius
    res = {}
    res["notarius"] = serializers.serialize('json', notariuses)
    res["place"] = serializers.serialize('json', places)
    res["phone"] = serializers.serialize('json', phones)
    res["region"] = serializers.serialize('json', regions)
    res = json.dumps(res)
    print notariuses
    return HttpResponse(res)

def update_notarius(request):

    old_certificate = request.GET['old_certificate']
    name = unicode(request.GET['name']),
    surname = request.GET['surname']
    patronym = request.GET['patronym']
    certificate = request.GET['certificate']

    region = request.GET['region']

    city = request.GET['city']
    street = request.GET['street']
    building = request.GET['building']

    phone = request.GET['phone']
    print unicode(name)
    print old_certificate
    n = Notarius.objects.get(certificate_num=old_certificate)
    p = Phone.objects.get(place=n.place)
    n.name = name
    n.surname = surname
    n.patronym = patronym
    n.certificate_num = certificate
    n.place.region.name = region
    n.place.city = city
    n.place.building = building
    n.save()
    print  n.certificate_num
    p.phone_number = phone
    p.save()

    print "Updates successfully"
    return redirect('/admin_panel')

def create_regions():
    Region.objects.all().delete()
    regions = ["Вінницька", "Волиньска", "Дніпропетровська", "Донецька",
               "Житомирська", "Закарпатська", "Запорізька", "Івано-Франківська",
               "Київська", "Кіровоградська", "Луганська", "Львівська", "Миколаївська",
               "Одеська", "Полтавська", "Рівненська", "Сумська", "Тернопільска",
               "Харківська", "Херсонська", "Черкаська", "Чернігівська",
               "Чернівецька", "Крим"]
    for i in range(len(regions)):
        Region.objects.create(id=i+1, name=regions[i])

def create_activity_types():
    Activity_Type.objects.all().delete()
    type = ["Приватний", "Державний"]
    for i in range(len(type)):
        Activity_Type.objects.create(id=i+1, description=type[i])

def create_admins():
    Admin.objects.all().delete()
    region = Region.objects.get(name="Київська")
    place = Place.objects.create(region=region, city="Київ", street="Ковальский", building="5")
    phone = Phone.objects.create(phone_number="0637049701", type="private", place=place)
    Admin.objects.create(id=1, name="Антон", surname="Лебьодкін", patronym="Миколайович",
                         username="root", password="1111", place=place, phone=phone)

