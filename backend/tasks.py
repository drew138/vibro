from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from .report.report import Report
from django.conf import settings
from celery import shared_task
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
