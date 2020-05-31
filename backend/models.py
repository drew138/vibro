from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class City(models.Model):
    name = models.CharField(max_length=30, unique=True)


class Company(models.Model):
    name = models.CharField(max_length=50, unique=True)
    nit = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=50)
    rut_address = models.CharField(max_length=50)
    pbx = models.IntegerField(blank=True)
    city = models.ForeignKey(
        City,
        related_name='company_city',
        to_field="name",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    rut_city = models.ForeignKey(
        City,
        related_name='rut_city',
        to_field="name",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)


class Contact(models.Model):
    company_name = models.ForeignKey(Company, related_name="contact_company", to_field="name", on_delete=models.CASCADE)
    email = models.EmailField(max_length=25, blank=True)
    phone = models.IntegerField(blank=True)
    ext = models.IntegerField(blank=True)
    celphone_one = models.IntegerField(blank=True)
    celphone_two = models.IntegerField(blank=True)


class Machine(models.Model):
    # TODO add choices and change machine_type field
    CHOICE = 'something'
    TYPE_CHOICES = [(CHOICE, 'Choice')]

    name = models.CharField(max_length=50)
    machine_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default=CHOICE) 
    # TODO
    company = models.ForeignKey(
        Company,
        related_name="machine_company",
        to_field="name",
        on_delete=models.CASCADE)


class Image(models.Model):
    image = models.ImageField()
    machine = models.ForeignObject(
        Machine,
        to_fields=["name", "machine_type", "company"],
        related_name="images",
        on_delete=models.CASCADE)


class Measurement(models.Model):
    RED = "red"
    GREEN = 'green'
    YELLOW = 'yellow'
    BLACK = 'black'
    PRED = 'pred'
    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black')
        ]
    # TODO add mode measurement choices
    MEASUREMENT_CHOICES = [(PRED, 'Predictivo')]
    severity = models.CharField(max_length=6, choices=SEVERITY_CHOICES, default=BLACK)
    date = models.DateTimeField()
    analysis = models.TextField()
    recomendation = models.TextField()
    measurement_type = models.CharField(
        max_length=10,
        choices=MEASUREMENT_CHOICES,
        default=PRED)
    machine = models.ForeignObject(
        Machine,
        related_name="machine",
        to_fields=["name", "machine_type", "company"],
        on_delete=models.CASCADE)


class GlobalMeasurement(models.Model):
    identifier = models.IntegerField()
    value = models.DecimalField(decimal_places=2, max_digits=4)
    measurement = models.ForeignObject(
        Measurement,
        related_name="measurement",
        to_fields=["measurement_type",
        "date", "machine"],
        on_delete=models.CASCADE)
