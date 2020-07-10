from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings

def send_email(data):
    """
    function to be used in a view to send emails.
    """

    template = render_to_string(data['template'], data['variables'])
    sender = settings.EMAIL_HOST_USER
    email = EmailMessage(data['subject'], template, sender, data['receiver'])
    email.content_subtype = "html"
    email.fail_silently = False
    email.send()