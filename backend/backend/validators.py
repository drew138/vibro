from django.core.validators import RegexValidator

PHONE_REGEX = r"^((\(\+?\d{2,3}\))|(\+?\d{2,3})[\s\-])?\d{3}[\s\-]\d{4}([\s\-]ext[\s\-]\d{1,3})?$"

CELPHONE_REGEX = r"^(((\(\+?\d{2,3}\))|(\+?\d{2,3}))[\s\-])?\d{3}[\-\s]\d{3}[\-\s]\d{4}$"

PHONE_MESSAGE = \
    "El número de teléfono debe " \
    "ser entrado en el formato: " \
    "(+xxx) xxx xxxx ext xxx " \
    "siendo el código de área y " \
    "la extensión opcionales."

CELPHONE_MESSAGE = \
    "El número de celular debe " \
    "ser entrado en el formato: " \
    "(+xxx) xxx xxxx xxxx siendo " \
    "el código de país opcional"

PHONE_REGEX_VALIDATOR = RegexValidator(
    regex=PHONE_REGEX,
    message=PHONE_MESSAGE)

CELPHONE_REGEX_VALIDATOR = RegexValidator(
    regex=CELPHONE_REGEX,
    message=CELPHONE_MESSAGE)
