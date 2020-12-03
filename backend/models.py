from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
from django.db import models


class City(models.Model):

    class Meta:
        unique_together = ["name", "state"]

    name = models.CharField(max_length=30)
    state = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.name


class Company(models.Model):

    name = models.CharField(max_length=50, unique=True)
    nit = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=50, blank=True, null=True)
    rut_address = models.CharField(max_length=50, blank=True, null=True)
    pbx = models.IntegerField(blank=True, null=True)
    city = models.ForeignKey(
        City,
        related_name='company',
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    rut_city = models.ForeignKey(
        City,
        related_name='ruts',
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    hierarchy = ArrayField(models.CharField(max_length=50), default=list)


class VibroUser(AbstractUser):

    ADMIN = 'admin'
    ENGINEER = 'engineer'
    CLIENT = 'client'
    SUPPORT = 'support'

    USER_CHOICES = [
        (ADMIN, 'Admin'),
        (ENGINEER, 'Engineer'),
        (CLIENT, 'Client'),
        (SUPPORT, 'Support')
    ]

    email = models.EmailField(unique=True)
    phone = models.IntegerField(blank=True, null=True)
    ext = models.IntegerField(blank=True, null=True)
    celphone_one = models.IntegerField(blank=True, null=True)
    celphone_two = models.IntegerField(blank=True, null=True)
    company = models.ForeignKey(
        Company,
        related_name="user",
        on_delete=models.SET_NULL,
        null=True,
        blank=True)
    user_type = models.CharField(
        max_length=8,
        choices=USER_CHOICES,
        default=CLIENT)
    certifications = ArrayField(
        models.CharField(
            max_length=50),
        default=list,
        max_length=5)
    picture = models.ImageField(upload_to="profile", default='default.jpg')

    def blur_email(self):
        import math
        indexat = math.floor(self.email.index("@") * 0.4)
        new_email = self.email[:indexat] + ("*" * (len(self.email) - indexat))
        return new_email

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Machine(models.Model):

    class Meta:
        unique_together = ["name", "company"]

    # codes
    SAP = 'sap'
    INTERNO = 'int'
    CODE_CHOICES = (
        (SAP, 'Sap'),
        (INTERNO, 'Interno'),
    )

    # electric feed
    DIRECTA = 'dir'
    VARIADOR = 'var'
    ELECTRIC_FEED_CHOICES = (
        (DIRECTA, 'Directa'),
        (VARIADOR, 'Variador'),
    )

    # power units
    KW = 'kW'
    HP = 'HP'
    POWER_UNIT_CHOICES = (
        (KW, 'KiloWatts'),
        (HP, 'HorsePower'),
    )

    identifier = models.IntegerField(blank=True, null=True)  # ! ES NUMERO?
    company = models.ForeignKey(
        Company,
        related_name="machines",
        on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    code = models.CharField(
        max_length=3, choices=CODE_CHOICES, blank=True, null=True)
    electric_feed = models.CharField(
        max_length=3, choices=CODE_CHOICES, blank=True, null=True)
    brand = models.TextField(blank=True, null=True)
    power = models.IntegerField(default=0)
    power_units = models.CharField(
        max_length=2, choices=POWER_UNIT_CHOICES, default=KW)
    norm = models.TextField(null=True, blank=True)
    hierarchy = models.IntegerField(default=0)
    # machine_type = models.CharField(max_length=50)  # TODO preguntar si puedo remover
    # transmission = models.TextField(blank=True, null=True) # TODO preguntar si puedo remover
    rpm = models.IntegerField(blank=True, null=True)


class Sensor(models.Model):

    # sensor
    VIBRACION = 'Vibración'
    DUAL = 'Dual'
    SENSOR_CHOICES = (
        (VIBRACION, 'Vibración'),
        (DUAL, 'Dual'),
    )

    sensor_type = models.CharField(
        max_length=9, choices=SENSOR_CHOICES, default=VIBRACION)
    sensitivity = models.IntegerField()
    channel = models.IntegerField()
    arduino = models.CharField(max_length=50, unique=True)
    machine = models.ForeignKey(
        Machine, related_name="sensor", on_delete=models.SET_NULL, null=True, blank=True)


class Gear(models.Model):  # equipo
    # gear type
    MOTOR_ELECTRICO = 'Motor Eléctrico'
    MOTOR_DIESEL = 'Motor Diesel'
    VENTILADOR = 'Ventilador'
    BOMBA = 'Bombda'
    COMPRESOR = 'Compresor'
    GENERADOR = 'Generador'
    SOPLADOR = 'Soplador'
    MOLINO = 'Molino'
    PELET = 'Pelet'
    ZARANDA = 'Zaranda'
    ESTRUCTURA = 'Estructura'
    EXTRUSORA = 'Extrusora'
    REDUCTORA = 'Reductora'

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
    RIGIDO = 'Rigido'
    FLEXIBLE = 'Flexible'
    SUPPORT_CHOICES = (
        (RIGIDO, 'Rigido'),
        (FLEXIBLE, 'Flexible'),
    )

    # transmission types
    FLEXIBLES = 'Flexibles'
    ENGRANAJE = 'Engranaje'
    CADENA = 'Cadena'
    REJILLA = 'Rejilla'
    MORFLEX = 'Morflex'
    PARAFLEX = 'Paraflex'
    ARAÑA = 'Araña'
    PASADOR = 'Pasador'
    LAMINILLA = 'Laminilla'
    RIGIDO = 'Rigido'
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
        (RIGIDO, 'Rigido'),
    )
    machine = models.ForeignKey(
        Machine, related_name='gears', on_delete=models.CASCADE)
    gear_type = models.CharField(
        max_length=20, choices=GEAR_TYPE_CHOICES, default="N/A")
    support = models.CharField(
        max_length=10, choices=SUPPORT_CHOICES, default='N/A')  # TODO contar num ejes
    transmission = models.CharField(
        max_length=12, choices=TRANSMISSION_CHOICES, default="N/A")  # TODO preguntar transmision entre equipos


class Axis(models.Model):  # eje

    DESLIZAMIENTO = 'Dezlizamiento'
    RODAMIENTO = 'Rodamiento'
    TYPE_CHOICES = (
        (DESLIZAMIENTO, 'Dezlizamiento'),
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
        max_length=13, choices=TYPE_CHOICES, default='Undefined')  # TODO contar num cojinetes
    velocity = models.IntegerField()
    # ! TODO preguntar si puedo hacer conversion en frontend
    units = models.CharField(max_length=3, choices=UNITS_CHOICES, default=RPM)


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
        max_length=4, choices=FREQUENCY_CHOICES, default='N/A')
    axis = models.ForeignKey(
        Axis, related_name='bearings', on_delete=models.CASCADE)


class Coupling(models.Model):
    RIG = "Rígido"
    FLEX = 'Flexible'


class Image(models.Model):

    image = models.ImageField(upload_to="machines/images")
    diagram = models.ImageField(upload_to="machines/diagrams")
    machine = models.OneToOneField(
        Machine,
        related_name="images",
        on_delete=models.CASCADE)


class Date(models.Model):

    class Meta:
        unique_together = ['company', 'date']

    date = models.DateField()
    company = models.ForeignKey(
        Company,
        related_name="date",
        on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.company.name} {self.date}'


class Measurement(models.Model):

    class Meta:
        unique_together = ['measurement_type', 'date', 'machine']

    # severity
    RED = "red"
    GREEN = 'green'
    YELLOW = 'yellow'
    BLACK = 'black'
    UNDEFINED = 'undefined'

    # service type
    PRED = 'pred'
    CORR = 'corr'
    ENG = 'eng'
    MON = 'mon'

    # measurement type
    VIB = 'vib'
    ULT = 'ult'
    TER = 'ter'
    POL = 'pol'
    ACP = 'acp'
    CRD = 'crd'
    EGR = 'egr'
    BAL = 'bal'
    AYC = 'ayc'
    ADC = 'adc'
    TDB = 'tdb'
    CMP = 'cmp'
    ADR = 'adr'
    CME = 'cme'
    MES = 'mes'
    SUM = 'sum'

    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black'),
        (UNDEFINED, 'Undefined')
    ]
    SERVICE_CHOICES = [
        (PRED, 'Predictivo'),
        (CORR, 'Correctivo'),
        (ENG, 'Ingenieria'),
        (MON, 'Monitoreo en Linea'),
    ]
    MEASUREMENT_CHOICES = [
        (ULT, 'Ultrasonido'),
        (TER, 'Termografia'),
        (VIB, 'Vibracion'),
        (ADC, 'Analisis de Aceite'),
        (POL, 'Alineacion Laser Polea'),
        (TDB, 'Tencion de Bandas'),
        (CMP, 'Correccion Montajes Poleas'),
        (ACP, 'Alineacion Laser Acople'),
        (CRD, 'Alineacion Laser Cardan'),
        (EGR, 'Alineacion Engranes'),
        (ADR, 'Alineacion Rodamientos'),
        (BAL, 'Balanceo'),
        (CME, 'Chequeo Mecanico'),
        (MES, 'Medicion Especial'),
        (AYC, 'Aire y Caudal'),
        (SUM, 'Suministro')
    ]

    service = models.CharField(
        max_length=4,
        choices=SERVICE_CHOICES,
        default=PRED)
    measurement_type = models.CharField(
        max_length=3,
        choices=MEASUREMENT_CHOICES,
        default=VIB)
    machine = models.ForeignKey(
        Machine,
        related_name="measurements",
        on_delete=models.CASCADE)
    date = models.ForeignKey(
        Date,
        related_name="measurements",
        on_delete=models.CASCADE)
    analysis = models.TextField()
    diagnostic = models.TextField()
    severity = models.CharField(
        max_length=9, choices=SEVERITY_CHOICES, default=UNDEFINED)
    engineer_one = models.ForeignKey(
        VibroUser,
        related_name="measurements",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    engineer_two = models.ForeignKey(
        VibroUser,
        related_name="measurements_two",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    analyst = models.ForeignKey(
        VibroUser,
        related_name="measurements_three",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    certifier = models.ForeignKey(
        VibroUser,
        related_name="measurements_four",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    revised = models.BooleanField(default=False)
    resolved = models.BooleanField(default=False)
    prev_changes = models.TextField(null=True, blank=True)
    prev_changs_date = models.DateField(null=True, blank=True)


class Flaw(models.Model):  # falla
    # severity
    RED = "red"
    GREEN = 'green'
    YELLOW = 'yellow'
    BLACK = 'black'

    # severity
    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black'),
    ]

    # flaw types
    BN = 'bn'
    BAL = 'bal'
    ALI = 'ali'
    TEN = 'ten'
    LUB = 'lub'
    ROD = 'rod'
    HOL = 'hol'
    EXC = 'exc'
    SOL = 'sol'
    FRA = 'fra'
    VAC = 'vac'
    ELE = 'ele'
    INS = 'ins'
    OTR = 'otr'
    EST = 'est'
    RES = 'res'
    NOM = 'nom'

    FLAW_CHOICES = [
        (BN, 'Bien'),
        (BAL, 'Balanceo'),
        (ALI, 'Alineacion'),
        (TEN, 'Tension'),
        (LUB, 'Lubricacion'),
        (ROD, 'Rodamientos'),
        (HOL, 'Holgura'),
        (EXC, 'Excentricidad'),
        (SOL, 'Soltura'),
        (FRA, 'Fractura'),
        (VAC, 'Vacio'),
        (ELE, 'Electrico'),
        (INS, 'Inspeccion'),
        (EST, 'Estructural'),
        (RES, 'Resonancia'),
        (NOM, 'No medido'),
        (OTR, 'Otro'),
    ]

    measurement = models.ForeignKey(
        Measurement, related_name="flaws", on_delete=models.CASCADE)
    flaw_type = models.CharField(
        max_length=3, choices=FLAW_CHOICES, default=OTR)
    severity = models.CharField(
        max_length=9, choices=SEVERITY_CHOICES, default=BLACK)


class TermoImage(models.Model):

    NORMAL = 'normal'
    TERMAL = 'termal'
    IMAGE_CHOICES = [
        (NORMAL, 'Normal'),
        (TERMAL, 'Termal')
    ]
    measurement = models.ForeignKey(
        Measurement, related_name='termal_image', on_delete=models.CASCADE)
    image_type = models.CharField(
        max_length=15, choices=IMAGE_CHOICES, default='undefined')
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="termals")


class Point(models.Model):  # ! medicion se hace sobre maqui o sobre equipo?

    # direction
    VER = 'V'
    HOR = 'H'
    AX = 'A'
    ORT = "O"
    # type
    ACC = 'A'
    VEL = 'V'
    DEZ = 'D'  # Desplazamiento
    TEMP = 'T'  # temperatura
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
        (VEL, 'Velocity'),
        (ACC, 'Acceleration'),
        (DEZ, 'Displacement'),
        (TEMP, 'Temperature'),
        (ENV, 'Envol'),
        (HFD, 'HFD'),
        (MAN, "Manual"),
        (CAL, "Calculado")
    ]
    #!TODO preguntar orden de columnas y orbita en diagrama de clases
    position = models.IntegerField()
    direction = models.CharField(
        max_length=1, choices=DIRECTION_CHOICES, default='undefined')
    point_type = models.CharField(
        max_length=1, choices=TYPE_CHOICES, default='undefined')
    measurement = models.ForeignKey(
        Measurement,
        related_name="points",
        on_delete=models.CASCADE)
    tendency = models.DecimalField(decimal_places=2, max_digits=4, default=0)
    espectra = ArrayField(models.DecimalField(
        decimal_places=2, max_digits=4), default=list)
    time_signal = ArrayField(models.DecimalField(
        decimal_places=2, max_digits=4), default=list)

    def __str__(self):
        return f'{self.position}{self.direction}{self.point_type}'
