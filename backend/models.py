from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
from django.db import models


class City(models.Model):

    class Meta:
        unique_together = ["name", "state"]

    name = models.CharField(max_length=30)
    state = models.CharField(max_length=30, blank=True, null=True)


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
        to_field="name",
        on_delete=models.CASCADE,
        null=True,
        blank=True)
    user_type = models.CharField(
        max_length=8,
        choices=USER_CHOICES,
        default=CLIENT)

    def blur_email(self):
        import math
        indexat = self.email.index("@")
        total_stars = math.floor(indexat * 0.4)
        character_list = list()
        for index, character in enumerate(self.email):
            if total_stars < index:
                character_list.append("*")
            else:
                character_list.append(character)
        new_email = "".join(character_list)
        return new_email

    @staticmethod
    def send_email(data):
        """
        function to be used in a view to send emails.
        """

        template = render_to_string(data['template'], data['variables'])
        sender = settings.EMAIL_HOST_USER
        email = EmailMessage(
            data['subject'],
            template,
            sender,
            data['receiver'])
        email.content_subtype = "html"
        email.fail_silently = True
        if 'file' in data:
            email.attach(
                filename=data['filename'], content=data['file'].getvalue(), mimetype='application/pdf')
        email.send()

    def __str__(self):
        return f'{self.username}/{self.first_name} {self.last_name}'


class Profile(models.Model):

    certifications = models.CharField(max_length=50, default='undefined')
    # TODO create a default.jpg
    picture = models.ImageField(upload_to="profile", default='default.jpg')
    user = models.OneToOneField(
        VibroUser,
        related_name='profile',
        on_delete=models.CASCADE)


class Hierarchy(models.Model):
    name = models.CharField(max_length=30, default='Nombre')
    parent = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True)
    company = models.ForeignKey(
        Company,
        related_name="hierarchies",
        on_delete=models.CASCADE)


class Machine(models.Model):

    class Meta:
        unique_together = ["name", "machine_type", "company"]

    SAP = 'sap'
    INTERNO = 'int'
    CODE_CHOICES = (
        (SAP, 'Sap'),
        (INTERNO, 'Interno'),
    )

    DIRECTA = 'dir'
    VARIADOR = 'var'
    ELECTRIC_FEED_CHOICES = (
        (DIRECTA, 'Directa'),
        (VARIADOR, 'Variador'),
    )

    KW = 'kW'
    HP = 'HP'
    POWER_UNIT_CHOICES = (
        (KW, 'KiloWatts'),
        (HP, 'HorsePower'),
    )

    identifier = models.IntegerField(blank=True, null=True)
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
    hierarchy = models.ForeignKey(
        Hierarchy, related_name="machines", on_delete=models.SET_NULL, blank=True, null=True)

    machine_type = models.CharField(max_length=50)  # TODO add machine types
    transmission = models.TextField(blank=True, null=True)
    rpm = models.IntegerField(blank=True, null=True)


class Sensor(models.Model):
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
    arduino = models.IntegerField()
    machine = models.ForeignKey(
        Machine, related_name="sensor", on_delete=models.SET_NULL, null=True, blank=True)


class Gear(models.Model):  # equipo
    # gear type
    MOTOR_ELECTRICO = 'Motor Eléctrico'
    MOTOR_DIESEL = 'Motor Diesel'
    VENTILADOR = 'Ventilador'
    BOMBA = 'Bombda'
    COMPRESOR = 'Compresor'
    GENERADOR_SOPLADOR = 'Generador Soplador'
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
        (GENERADOR_SOPLADOR, 'Generador Soplador'),
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

    gear_type = models.CharField(
        max_length=20, choices=GEAR_TYPE_CHOICES, default="N/A")
    num_axis = models.IntegerField()  # ! required? or can count on request?
    support = models.CharField(
        max_length=10, choices=SUPPORT_CHOICES, default='N/A')
    transmission = models.CharField(
        max_length=12, choices=TRANSMISSION_CHOICES, default="N/A")


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

    type_axis = models.CharField(
        max_length=13, choices=TYPE_CHOICES, default='Undefined')
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
        Axis, related_name='bearing', on_delete=models.CASCADE)


class Image(models.Model):

    image = models.ImageField(upload_to="machines/images")
    diagram = models.ImageField(upload_to="machines/diagrams")
    machine = models.OneToOneField(
        Machine,
        related_name="images",
        on_delete=models.CASCADE)

    def __str__(self):
        return self.machine.name


class Date(models.Model):

    class Meta:
        unique_together = ['company', 'date']

    date = models.DateField()
    company = models.ForeignKey(
        Company,
        related_name="date",
        on_delete=models.SET_NULL,
        blank=True,
        null=True)

    def __str__(self):
        return f'{self.company} {self.date}'


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
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
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
    UNDEFINED = 'undefined'

    # severity
    SEVERITY_CHOICES = [
        (RED, 'Red'),
        (GREEN, 'Green'),
        (YELLOW, 'Yellow'),
        (BLACK, 'Black'),
        (UNDEFINED, 'Undefined')
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
        (OTR, 'Otro'),
        (EST, 'Estructural'),
        (RES, 'Resonancia'),
        (NOM, 'No medido'),
    ]

    measurement = models.ForeignKey(
        Measurement, related_name="flaw", on_delete=models.CASCADE)
    flaw_type = models.CharField(
        max_length=3, choices=FLAW_CHOICES, default=OTR)
    severity = models.CharField(
        max_length=9, choices=SEVERITY_CHOICES, default=UNDEFINED)


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


class Point(models.Model):

    # position
    VER = 'V'
    HOR = 'H'
    AX = 'A'
    # type
    ACC = 'A'
    VEL = 'V'
    DEZ = 'D'  # Desplazamiento
    ENV = 'E'  # Envolvente
    HFD = 'H'  # HFD
    TEMP = 'T'

    POSITION_CHOICES = [(VER, 'Vertical'), (HOR, 'Horizontal'), (AX, 'Axial')]
    TYPE_CHOICES = [
        (VEL, 'Velocity'),
        (ACC, 'Acceleration'),
        (DEZ, 'Displacement'),
        (ENV, 'Envol'),
        (HFD, 'HFD'),
        (TEMP, 'Temperature')
    ]

    number = models.IntegerField()
    position = models.CharField(
        max_length=1, choices=POSITION_CHOICES, default='undefined')
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
        return f'{self.number}{self.position}{self.point_type}'
