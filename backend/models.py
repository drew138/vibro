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
        related_name='company',
        to_field="name",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    rut_city = models.ForeignKey(
        City,
        related_name='ruts',
        to_field="name",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)


class Contact(models.Model):
    company_name = models.ForeignKey(Company, related_name="contacts", to_field="name", on_delete=models.CASCADE)
    email = models.EmailField(max_length=25, blank=True)
    phone = models.IntegerField(blank=True)
    ext = models.IntegerField(blank=True)
    celphone_one = models.IntegerField(blank=True)
    celphone_two = models.IntegerField(blank=True)


class Machine(models.Model):
    class Meta:
        unique_together = ["name", "machine_type", "company"]

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
        related_name="machines",
        to_field="name",
        on_delete=models.CASCADE)


class Image(models.Model):
    image = models.ImageField()
    machine = models.ForeignKey(
        Machine,
        related_name="images",
        on_delete=models.CASCADE)


class Measurement(models.Model):
    class Meta:
        unique_together = ['measurement_type', 'date', 'machine']

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
    machine = models.ForeignKey(
        Machine,
        related_name="measurements",
        on_delete=models.CASCADE) 


class Global(models.Model):
    ACC = 'A'
    VEL = 'V'
    DEZ = 'D' # TODO assert with documentation
    VER = 'V'
    HOR = 'H'
    AX = 'A'
    TYPE_CHOICES = [(VEL, 'Velocity'), (ACC, 'Acceleration'), (DEZ, 'Axial')]
    POSITION_CHOICES = [(VER, 'Vertical'), (HOR, 'Horizontal'), (AX, 'Axial')]

    identifier = models.IntegerField()
    position = models.CharField(max_length=1, choices=POSITION_CHOICES, default='undefined')
    number = models.IntegerField()
    global_type = models.CharField(max_length=1, choices=TYPE_CHOICES, default='undefined')
    value = models.DecimalField(decimal_places=2, max_digits=4)
    measurement = models.ForeignKey(
        Measurement,
        related_name="globals",
        on_delete=models.CASCADE)
