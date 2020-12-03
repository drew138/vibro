from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from .report.report import Report
from django.conf import settings
from celery import shared_task
from vibro.celery import app
from .models import Company
from celery import Task
from io import BytesIO
import datetime


@shared_task
def send_email(data, user, queryset=None):
    """
    function to be used in a view to send emails.
    """

    template = render_to_string(data['template'], data['variables'])
    sender = settings.EMAIL_HOST_USER
    email = EmailMessage(
        data['subject'],
        template,
        sender,
        [user.email])
    email.content_subtype = "html"
    email.fail_silently = True
    if queryset:
        with BytesIO() as buffer:
            try:
                pdf = Report(buffer, queryset, user)
                pdf.build_doc()
                buffer.seek(0)
            except Exception:
                pass
            else:
                company_name = queryset.first().company.name.upper()
                date = datetime.date.today().__str__()
                filename = f'INFORME_PREDICTIVO_{company_name}_{date}.pdf'
                email.attach(
                    filename=filename,
                    content=buffer.getvalue(),
                    mimetype='application/pdf')
            email.send()
    else:
        email.send()


class Email(Task):

    ignore_result = True
    name = "email"

    def set_user(self, request):
        self.request = request
        self.user = request.user
        self.variables = {'name': request.user.first_name}
        self.email.to = [request.user.email]

    def register(self):
        self.email.subject = 'Bienvenido! - Vibromontajes'
        self.template = 'email/welcome.html'

    def reset(self):

        self.email.subject = 'Cambio de Contraseña - Vibromontajes'
        self.template = 'email/password_reset.html'
        self.variables['host'] = self.request.get_host()
        self.variables['token'] = str(RefreshToken.for_user(self.user))

    def change_password(self):

        self.email.subject = 'Cambio de Contraseña - Vibromontajes'
        self.template = 'email/successful_change.html'

    def attach_report(self):

        with BytesIO() as buffer:
            try:
                pdf = Report(buffer, self.queryset, self.user)
                pdf.build_doc()
                buffer.seek(0)
            except Exception:
                pass
            else:
                company_name = self.queryset.first().company.name.upper()
                date = datetime.date.today().__str__()
                filename = f'INFORME_PREDICTIVO_{company_name}_{date}.pdf'
                self.attach(
                    filename=filename,
                    content=buffer.getvalue(),
                    mimetype='application/pdf')
            finally:
                self.email.send()

    def report(self):

        self.email.subject = 'Solicitud Informe Predictivo - Vibromontajes'
        self.template = 'email/report.html'

    def set_action(self, action):

        if action == 'register':
            self.register()
        elif action == 'reset':
            self.reset()
        elif action == 'change_password':
            self.change_password()
        elif action == 'report':
            self.report()

    def run(self, action, request, queryset=None):

        self.set_action(action)
        self.queryset = queryset
        self.set_user(request)
        self.email = EmailMessage()
        self.email.body = render_to_string(self.template, self.variables)
        self.email.content_subtype = "html"
        self.email.from_email = settings.EMAIL_HOST_USER
        self.email.fail_silently = True
        if self.queryset:
            self.attach_report()
        else:
            self.email.send()


app.tasks.register(Email())
