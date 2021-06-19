from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
from django.db import models
from .validators import (
    PHONE_REGEX_VALIDATOR,
    CELPHONE_REGEX_VALIDATOR,
    NIT_REGEX_VALIDATOR,
    # ADDRESS_REGEX_VALIDATOR
)


class City(models.Model):

    class Meta:
        unique_together = ["name", "state"]

    name = models.CharField(max_length=30)
    state = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.name}, {self.state}'


class Company(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True)
    nit = models.CharField(
        validators=[NIT_REGEX_VALIDATOR],
        max_length=15,
        unique=True)
    address = models.CharField(
        # validators=[ADDRESS_REGEX_VALIDATOR],
        max_length=50)
    phone = models.CharField(
        validators=[PHONE_REGEX_VALIDATOR],
        max_length=17,
        default="")
    city = models.ForeignKey(
        City,
        related_name='company',
        on_delete=models.CASCADE, null=True)
    picture = models.ImageField(
        upload_to="company",
        default='company/default.png')

    def __str__(self):
        return f'{self.name} {self.nit}'


class Hierarchy(models.Model):

    name = models.CharField(max_length=30)
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)


class VibroUser(AbstractUser):

    ADMIN = 'admin'
    ENGINEER = 'engineer'
    CLIENT = 'client'
    SUPPORT = 'support'
    ARDUINO = 'arduino'

    USER_CHOICES = [
        (ADMIN, 'Admin'),
        (ENGINEER, 'Engineer'),
        (CLIENT, 'Client'),
        (SUPPORT, 'Support'),
        (ARDUINO, 'Arduino')
    ]

    email = models.EmailField(unique=True)
    # phone = models.CharField(  # TODO ! remove this field
    #     validators=[PHONE_REGEX_VALIDATOR],
    #     max_length=17,
    #     default="")
    celphone = models.CharField(
        validators=[CELPHONE_REGEX_VALIDATOR],
        max_length=20,
        default="")
    company = models.ForeignKey(
        Company,
        related_name="user",
        on_delete=models.SET_NULL,
        null=True)
    user_type = models.CharField(
        max_length=8,
        choices=USER_CHOICES,
        default=CLIENT)
    certifications = ArrayField(
        models.CharField(
            max_length=50),
        default=list,
        max_length=5)
    picture = models.ImageField(
        upload_to="user/profile",
        default='user/profile/default.png')

    def blur_email(self):

        index = int(self.email.index("@") * 0.4)
        new_email = self.email[:index] + ("*" * (len(self.email) - index))
        return new_email

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Machine(models.Model):

    class Meta:
        unique_together = ["name", "company"]

    # severity
    RED = "red"
    GREEN = 'green'
    YELLOW = 'yellow'
    BLACK = 'black'
    PURPLE = 'purple'
    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black'),
        (PURPLE, 'Purple')
    ]
    # codes
    SAP = 'sap'
    INTERNO = 'interno'
    CODE_CHOICES = (
        (SAP, 'Sap'),
        (INTERNO, 'Interno'),
    )

    # electric feed
    DIRECTA = 'directa'
    VARIADOR = 'variador'
    ELECTRIC_FEED_CHOICES = (
        (DIRECTA, 'Directa'),
        (VARIADOR, 'Variador'),
    )

    # power units
    KW = 'KW'
    HP = 'HP'
    POWER_UNIT_CHOICES = (
        (KW, 'KiloWatts'),
        (HP, 'HorsePower'),
    )

    # ! TODO remove default, make unique field
    identifier = models.IntegerField()
    company = models.ForeignKey(
        Company,
        related_name="machines",
        on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=50)
    code = models.CharField(
        max_length=7,
        choices=CODE_CHOICES,
        null=True)
    electric_feed = models.CharField(
        max_length=8,
        choices=ELECTRIC_FEED_CHOICES,
        null=True)
    brand = models.CharField(max_length=50)
    power = models.IntegerField()
    power_units = models.CharField(
        max_length=2,
        choices=POWER_UNIT_CHOICES,
        default=KW)
    norm = models.TextField(
        null=True,
    )
    hierarchy = models.ForeignKey(
        Hierarchy,
        null=True,
        on_delete=models.SET_NULL)
    rpm = models.IntegerField()
    severity = models.CharField(
        max_length=9,
        choices=SEVERITY_CHOICES,
        default=PURPLE)
    image = models.ImageField(
        upload_to="machine/images",
        default="machine/images/deafult.png")
    diagram = models.ImageField(
        upload_to="machine/diagrams",
        default="machine/diagrams/deafult.png")


class Sensor(models.Model):

    # sensor
    VIBRACION = 'vibración'
    DUAL = 'dual'
    SENSOR_CHOICES = (
        (VIBRACION, 'Vibración'),
        (DUAL, 'Dual'),
    )

    sensor_type = models.CharField(
        max_length=9,
        choices=SENSOR_CHOICES,
        default=VIBRACION)
    sensitivity = models.IntegerField()
    channel = models.IntegerField()
    arduino = models.ForeignKey(
        VibroUser,
        related_name='sensor',
        on_delete=models.SET_NULL,
        null=True)
    machine = models.ForeignKey(
        Machine, related_name="sensor",
        on_delete=models.SET_NULL,
        null=True)


class Gear(models.Model):  # equipo
    # gear type
    MOTOR_ELECTRICO = 'motor eléctrico'
    MOTOR_DIESEL = 'motor diesel'
    VENTILADOR = 'ventilador'
    BOMBA = 'bomba'
    COMPRESOR = 'compresor'
    GENERADOR = 'generador'
    SOPLADOR = 'soplador'
    MOLINO = 'molino'
    PELET = 'pelet'
    ZARANDA = 'zaranda'
    ESTRUCTURA = 'estructura'
    EXTRUSORA = 'extrusora'
    REDUCTORA = 'reductora'

    GEAR_TYPE_CHOICES = (
        (MOTOR_ELECTRICO, 'Motor Eléctrico'),
        (MOTOR_DIESEL, 'Motor Diesel'),
        (VENTILADOR,  'Ventilador'),
        (BOMBA, 'Bombda'),
        (COMPRESOR, 'Compresor'),
        (GENERADOR, 'Generador'),
        (SOPLADOR, 'Soplador'),
        (MOLINO, 'Molino'),
        (PELET, 'Pelet'),
        (ZARANDA, 'Zaranda'),
        (ESTRUCTURA, 'Estructura'),
        (EXTRUSORA, 'Extrusora'),
        (REDUCTORA, 'Reductora'),
    )

    # support types
    RIGIDO = 'rígido'
    FLEXIBLE = 'Flexible'
    SUPPORT_CHOICES = (
        (RIGIDO, 'Rígido'),
        (FLEXIBLE, 'Flexible'),
    )

    # transmission types
    FLEXIBLES = 'flexibles'
    ENGRANAJE = 'engranaje'
    CADENA = 'cadena'
    REJILLA = 'rejilla'
    MORFLEX = 'morflex'
    PARAFLEX = 'paraflex'
    ARAÑA = 'araña'
    PASADOR = 'pasador'
    LAMINILLA = 'laminilla'
    RIGIDO = 'rígido'
    TRANSMISSION_CHOICES = (
        (FLEXIBLES, 'Flexibles'),
        (ENGRANAJE, 'Engranaje'),
        (CADENA, 'Cadena'),
        (REJILLA, 'Rejilla'),
        (MORFLEX, 'Morflex'),
        (PARAFLEX, 'Paraflex'),
        (ARAÑA, 'Araña'),
        (PASADOR, 'Pasador'),
        (LAMINILLA, 'Laminilla'),
        (RIGIDO, 'Rígido'),
    )
    machine = models.ForeignKey(
        Machine,
        related_name='gears',
        on_delete=models.CASCADE)
    gear_type = models.CharField(
        max_length=20,
        choices=GEAR_TYPE_CHOICES,
        default="N/A")
    support = models.CharField(
        max_length=10,
        choices=SUPPORT_CHOICES,
        default='N/A')  # TODO contar num ejes
    transmission = models.CharField(
        max_length=12,
        choices=TRANSMISSION_CHOICES,
        default="N/A")  # TODO preguntar transmision entre equipos


class Axis(models.Model):  # eje

    DESLIZAMIENTO = 'deslizamiento'
    RODAMIENTO = 'rodamiento'
    TYPE_CHOICES = (
        (DESLIZAMIENTO, 'Deslizamiento'),
        (RODAMIENTO, 'Rodamiento'),
    )

    RPM = 'rpm'
    HZ = 'Hz'
    UNITS_CHOICES = (
        (RPM, 'rpm'),
        (HZ, 'Hz'),
    )
    gear = models.ForeignKey(
        Gear,
        related_name='axis',
        on_delete=models.CASCADE)
    type_axis = models.CharField(
        max_length=13,
        choices=TYPE_CHOICES,
        default='undefined')  # TODO contar num cojinetes
    velocity = models.IntegerField()
    units = models.CharField(
        max_length=3,
        choices=UNITS_CHOICES,
        default=RPM)


class Bearing(models.Model):  # cojinetes

    NA = 'N/A'
    BPFI = 'BPFI'
    BPFO = 'BPFO'
    BSF = 'BSF'
    FTF = 'FTF'
    FREQUENCY_CHOICES = (
        (NA, 'N/A'),
        (BPFI, 'BPFI'),
        (BPFO, 'BPFO'),
        (BSF, 'BSF'),
        (FTF, 'FTF'),
    )

    reference = models.CharField(max_length=30, default='N/A')
    frequency = models.CharField(
        max_length=4,
        choices=FREQUENCY_CHOICES,
        default='N/A')
    axis = models.ForeignKey(
        Axis,
        related_name='bearings',
        on_delete=models.CASCADE)


class Coupling(models.Model):
    RIG = "Rígido"
    FLEX = 'Flexible'


class Point(models.Model):

    POSITION_CHOICES = [
        (num, num) for num in range(1, 13)
    ]

    # direction
    VER = 'V'  # Vertical
    HOR = 'H'  # Horizontal
    AX = 'A'  # Axial
    ORT = "O"  # Ortogonal
    # type
    ACC = 'A'  # Acceleracion
    VEL = 'V'  # Velocidad
    DES = 'D'  # Desplazamiento
    TEMP = 'T'  # Temperatura
    ENV = 'E'  # Envolvente
    HFD = 'H'  # HFD
    MAN = "M"  # Manual
    CAL = "C"  # Calculado

    DIRECTION_CHOICES = [
        (VER, 'Vertical'),
        (HOR, 'Horizontal'),
        (AX, 'Axial'),
        (ORT, 'Ortogonal')
    ]

    TYPE_CHOICES = [
        (VEL, 'Velocidad'),
        (ACC, 'Aceleración'),
        (DES, 'Desplazamiento'),
        (TEMP, 'Temperatura'),
        (ENV, 'Envolvente'),
        (HFD, 'HFD'),
        (MAN, "Manual"),
        (CAL, "Calculado")
    ]

    position = models.IntegerField(choices=POSITION_CHOICES)
    direction = models.CharField(
        max_length=1,
        choices=DIRECTION_CHOICES,
        default='undefined')
    point_type = models.CharField(
        max_length=1,
        choices=TYPE_CHOICES,
        default='undefined')
    machine = models.ForeignKey(
        Machine,
        related_name="points",
        on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.position}{self.direction}{self.point_type}'


class Measurement(models.Model):

    class Meta:
        unique_together = ['measurement_type', 'date', 'machine']

    # severity
    RED = "red"
    GREEN = 'green'
    YELLOW = 'yellow'
    BLACK = 'black'
    PURPLE = 'purple'

    # service type
    PRED = 'predictivo'
    CORR = 'correctivo'
    ENG = 'ingeniería'
    MON = 'monitoreo'

    # measurement type
    ULT = 'ultrasonido'
    TER = 'termografía'
    VIB = 'vibración'
    ADC = 'análisis de aceite'
    POL = 'alineacion laser polea'
    TDB = 'tensión de bandas'
    CMP = 'correción montajes poleas'
    ACP = 'alineación laser acople'
    CRD = 'alineación laser cardan'
    EGR = 'alineación engranes'
    ADR = 'alineación rodamientos'
    BAL = 'balanceo'
    CME = 'chequeo mecánico'
    MES = 'medición especial'
    AYC = 'aire y caudal'
    SUM = 'suministro'

    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black'),
        (PURPLE, 'Purple')
    ]
    SERVICE_CHOICES = [
        (PRED, 'Predictivo'),
        (CORR, 'Correctivo'),
        (ENG, 'Ingeniería'),
        (MON, 'Monitoreo en Línea'),
    ]
    MEASUREMENT_CHOICES = [
        (ULT, 'Ultrasonido'),
        (TER, 'Termografía'),
        (VIB, 'Vibración'),
        (ADC, 'Análisis de Aceite'),
        (POL, 'Alineacion Laser Polea'),
        (TDB, 'Tensión de Bandas'),
        (CMP, 'Correción Montajes Poleas'),
        (ACP, 'Alineación Laser Acople'),
        (CRD, 'Alineación Laser Cardan'),
        (EGR, 'Alineación Engranes'),
        (ADR, 'Alineación Rodamientos'),
        (BAL, 'Balanceo'),
        (CME, 'Chequeo Mecánico'),
        (MES, 'Medición Especial'),
        (AYC, 'Aire y Caudal'),
        (SUM, 'Suministro')
    ]

    service = models.CharField(
        max_length=18,
        choices=SERVICE_CHOICES,
        default=PRED)
    measurement_type = models.CharField(
        max_length=25,
        choices=MEASUREMENT_CHOICES,
        default=VIB)
    date = models.DateField()
    analysis = models.TextField(default="", blank=True)
    diagnostic = models.TextField(default="", blank=True)
    severity = models.CharField(
        max_length=9,
        choices=SEVERITY_CHOICES,
        default=PURPLE)
    engineer_one = models.ForeignKey(
        VibroUser,
        related_name="measurements",
        on_delete=models.SET_NULL,
        null=True)
    engineer_two = models.ForeignKey(
        VibroUser,
        related_name="measurements_two",
        on_delete=models.SET_NULL,
        null=True)
    analyst = models.ForeignKey(
        VibroUser,
        related_name="measurements_three",
        on_delete=models.SET_NULL,
        null=True)
    certifier = models.ForeignKey(
        VibroUser,
        related_name="measurements_four",
        on_delete=models.SET_NULL,
        null=True)
    machine = models.ForeignKey(
        Machine,
        related_name="measurements",
        on_delete=models.CASCADE)
    revised = models.BooleanField(default=False)
    resolved = models.BooleanField(default=False)  # remove
    prev_changes = models.TextField(default="", blank=True)
    prev_changes_date = models.DateField(null=True)


class Values(models.Model):

    point = models.ForeignKey(
        Point,
        related_name="values",
        on_delete=models.CASCADE
    )
    measurement = models.ForeignKey(
        Measurement,
        related_name="values",
        on_delete=models.CASCADE)
    tendency = models.DecimalField(
        decimal_places=2,
        max_digits=4,
        default=0)
    espectra = ArrayField(
        models.DecimalField(
            decimal_places=2,
            max_digits=4),
        default=list)
    time_signal = ArrayField(models.DecimalField(
        decimal_places=2,
        max_digits=4),
        default=list)


class Flaw(models.Model):  # falla
    # severity
    RED = "red"
    GREEN = 'green'
    YELLOW = 'yellow'
    BLACK = 'black'
    PURPLE = 'purple'

    # severity
    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black'),
        (PURPLE, 'Purple')
    ]

    # flaw types
    BN = 'bien'
    BAL = 'balanceo'
    ALI = 'alineación'
    TEN = 'tensión'
    LUB = 'lubricación'
    ROD = 'rodamientos'
    HOL = 'holgura'
    EXC = 'excentricidad'
    SOL = 'soltura'
    FRA = 'fractura'
    VAC = 'vacío'
    ELE = 'eléctrico'
    INS = 'inspección'
    EST = 'estructural'
    RES = 'resonancia'
    NOM = 'no medido'
    OTR = 'otro'

    FLAW_CHOICES = [
        (BN, 'Bien'),
        (BAL, 'Balanceo'),
        (ALI, 'Alineación'),
        (TEN, 'Tensión'),
        (LUB, 'Lubricación'),
        (ROD, 'Rodamientos'),
        (HOL, 'Holgura'),
        (EXC, 'Excentricidad'),
        (SOL, 'Soltura'),
        (FRA, 'Fractura'),
        (VAC, 'Vacío'),
        (ELE, 'Eléctrico'),
        (INS, 'Inspección'),
        (EST, 'Estructural'),
        (RES, 'Resonancia'),
        (NOM, 'No medido'),
        (OTR, 'Otro'),
    ]

    measurement = models.ForeignKey(
        Measurement,
        related_name="flaws",
        on_delete=models.CASCADE)
    flaw_type = models.CharField(
        max_length=13,
        choices=FLAW_CHOICES,
        default=OTR)
    severity = models.CharField(
        max_length=6,
        choices=SEVERITY_CHOICES,
        default=PURPLE)


class TermoImage(models.Model):

    NORMAL = 'normal'
    TERMAL = 'termal'
    IMAGE_CHOICES = [
        (NORMAL, 'Normal'),
        (TERMAL, 'Termal')
    ]
    measurement = models.ForeignKey(
        Measurement,
        related_name='termal_image',
        on_delete=models.CASCADE)
    image_type = models.CharField(
        max_length=15,
        choices=IMAGE_CHOICES,
        default='undefined')
    description = models.TextField(null=True)
    image = models.ImageField(upload_to="termals")
