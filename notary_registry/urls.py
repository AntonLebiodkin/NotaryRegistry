from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin_panel$', views.admin_panel, name='admin_panel'),
    url(r'^admin$', views.admin, name='admin'),
    url(r'^login$', views.login, name='login'),
    url(r'^add_notarius$', views.add_notarius, name='add_notarius'),
    url(r'^add_notary_office$', views.add_notary_office, name='add_notary_office'),
    url(r'^load_certificates$', views.load_certificates, name='load_certificates'),
    url(r'^load_offices$', views.load_offices, name='load_offices'),
    url(r'^load_cities$', views.load_cities, name='load_cities'),
    url(r'^load_regions$', views.load_regions, name='load_regions'),
    url(r'^notarius_search$', views.notarius_search, name='notarius_search'),
    url(r'^office_search$', views.office_search, name='office_search'),
    url(r'^adress_search$', views.adress_search, name='adress_search'),
    url(r'^delete_notarius$', views.delete_notarius, name='delete_notarius'),
    url(r'^delete_office$', views.delete_office, name='delete_office'),
    url(r'^get_notarius$', views.get_notarius, name='get_notarius'),
    url(r'^get_office$', views.get_office, name='get_office'),
    url(r'^update_notarius$', views.update_notarius, name='update_notarius'),
    url(r'^update_office$', views.update_office, name='update_office'),
    url(r'^quit$', views.quit, name='quit')


]