# Generated by Django 3.0.7 on 2020-09-03 22:48

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='VibroUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.IntegerField(blank=True, null=True)),
                ('ext', models.IntegerField(blank=True, null=True)),
                ('celphone_one', models.IntegerField(blank=True, null=True)),
                ('celphone_two', models.IntegerField(blank=True, null=True)),
                ('user_type', models.CharField(choices=[('admin', 'Admin'), ('engineer', 'Engineer'), ('client', 'Client'), ('support', 'Support')], default='client', max_length=8)),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
                ('state', models.CharField(blank=True, max_length=30, null=True)),
            ],
            options={
                'unique_together': {('name', 'state')},
            },
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('nit', models.CharField(max_length=15, unique=True)),
                ('address', models.CharField(blank=True, max_length=50, null=True)),
                ('rut_address', models.CharField(blank=True, max_length=50, null=True)),
                ('pbx', models.IntegerField(blank=True, null=True)),
                ('city', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='company', to='backend.City', to_field='name')),
                ('rut_city', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ruts', to='backend.City', to_field='name')),
            ],
        ),
        migrations.CreateModel(
            name='Date',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='date', to='backend.Company')),
            ],
            options={
                'unique_together': {('company', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Machine',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.IntegerField(blank=True, null=True)),
                ('name', models.CharField(max_length=50)),
                ('machine_type', models.CharField(max_length=50)),
                ('code', models.TextField(blank=True, null=True)),
                ('transmission', models.TextField(blank=True, null=True)),
                ('brand', models.TextField(blank=True, null=True)),
                ('power', models.TextField(blank=True, null=True)),
                ('rpm', models.IntegerField(blank=True, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='machines', to='backend.Company', to_field='name')),
            ],
            options={
                'unique_together': {('name', 'machine_type', 'company')},
            },
        ),
        migrations.CreateModel(
            name='Measurement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('severity', models.CharField(choices=[('red', 'Red'), ('green', 'Green'), ('yellow', 'Yellow'), ('black', 'Black')], default='black', max_length=6)),
                ('analysis', models.TextField()),
                ('recomendation', models.TextField()),
                ('revised', models.BooleanField(default=False)),
                ('resolved', models.BooleanField(default=False)),
                ('measurement_type', models.CharField(choices=[('pred', 'Predictivo'), ('esp', 'Especial'), ('ter', 'Termografía'), ('ult', 'Ultrasonido'), ('air', 'Aire y Cauldal')], default='pred', max_length=10)),
                ('date', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='measurements', to='backend.Date')),
                ('engineer_one', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='measurements', to=settings.AUTH_USER_MODEL)),
                ('engineer_two', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='measurements_two', to=settings.AUTH_USER_MODEL)),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='measurements', to='backend.Machine')),
            ],
            options={
                'unique_together': {('measurement_type', 'date', 'machine')},
            },
        ),
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField()),
                ('position', models.CharField(choices=[('V', 'Vertical'), ('H', 'Horizontal'), ('A', 'Axial')], default='undefined', max_length=1)),
                ('point_type', models.CharField(choices=[('V', 'Velocity'), ('A', 'Acceleration'), ('D', 'Displacement'), ('E', 'Envol'), ('H', 'HFD')], default='undefined', max_length=1)),
                ('measurement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='points', to='backend.Measurement')),
            ],
        ),
        migrations.CreateModel(
            name='Tendency',
            fields=[
                ('value', models.DecimalField(decimal_places=2, max_digits=4)),
                ('point', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='tendency', serialize=False, to='backend.Point')),
            ],
        ),
        migrations.CreateModel(
            name='TimeSignal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.IntegerField()),
                ('value', models.DecimalField(decimal_places=2, max_digits=4)),
                ('point', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Point')),
            ],
        ),
        migrations.CreateModel(
            name='TermoImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_type', models.CharField(choices=[('normal', 'Normal'), ('termal', 'Termal')], default='undefined', max_length=15)),
                ('description', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(upload_to='termals')),
                ('measurement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='termal_image', to='backend.Measurement')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certifications', models.CharField(default='undefined', max_length=50)),
                ('picture', models.ImageField(default='default.jpg', upload_to='profile')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='machines/images')),
                ('diagram', models.ImageField(upload_to='machines/diagrams')),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='backend.Machine')),
            ],
        ),
        migrations.CreateModel(
            name='Espectra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.IntegerField()),
                ('value', models.DecimalField(decimal_places=2, max_digits=4)),
                ('point', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Point')),
            ],
        ),
        migrations.AddField(
            model_name='vibrouser',
            name='company',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to='backend.Company', to_field='name'),
        ),
        migrations.AddField(
            model_name='vibrouser',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='vibrouser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]
