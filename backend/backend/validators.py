from django.core.validators import RegexValidator

PHONE_REGEX = r"^((\(\+?\d{2,3}\))|(\+?\d{2,3})[\s-])?\d{3}[\s-]\d{4}([\s-]ext[\s-]\d{1,3})?$"

CELPHONE_REGEX = r"^(((\(\+?\d{2,3}\))|(\+?\d{2,3}))[\s-])?\d{3}[\s-]\d{3}[\s-]\d{4}$"
# https://www.regextester.com/108138
NIT_REGEX = r"^[0-9]+-{1}[0-9]{1}$"
# https://www.regextester.com/111017
ADDRESS_REGEX = \
    r"^(Autopista|Avenida|Avenida Calle|" \
    r"Avenida Carrera|Avenida|Carrera|" \
    r"Calle|Carrera|Circunvalar|Diagonal|" \
    r"Kilometro|Transversal|AUTOP|AV|AC|" \
    r"AK|CL|KR|CCV|DG|KM|TV)(\s)?([a-zA-Z]" \
    r"{0,15}|[0-9]{1,3})(\s)?[a-zA-Z]?(\s)?" \
    r"(bis)?(\s)?(Este|Norte|Occidente|Oeste" \
    r"|Sur)?(\s)?(#(\s)?[0-9]{1,2}(\s)?" \
    r"[a-zA-Z]?(\s)?(bis)?(\s)?(Este|Norte|" \
    r"Occidente|Oeste|Sur)?(\s)?(-)?(\s)?[0-9]" \
    r"{1,3}(\s)?(Este|Norte|Occidente|Oeste|" \
    r"Sur)?)?((\s)?(Agrupación|Altillo|Apar" \
    r"tamento|Apartamento Sótano|Barrio|" \
    r"Bloque|Bodega|Cabecera Municipal|" \
    r"Callejón|Camino|Carretera|Casa|Caserio|" \
    r"Célula|Centro|Centro Comercial|Centro " \
    r"Urbano|Circular|Condominio|Conjunto|" \
    r"Consultorio|Corregimiento|Deposito|Deposito |" \
    r"Sótano|Edificio|Entrada|Esquina|Etapa|" \
    r"Finca|Garaje|Garaje Sótano|Grada|Inferior|" \
    r"Inspección de Policia|Interior|Kilometro|" \
    r"Local|Local Mezzanine|Local Sótano|Lote|" \
    r"Manzana|Manzanita|Mejora|Mezzanine|Módulo|" \
    r"Municipio|Núcleo|Oficina|Oficina Sótano|" \
    r"Parcela|Parcelación|Pasaje|Penthouse|" \
    r"Piso|Porteria|Predio|Principal|Puente|" \
    r"Quebrada|Salon|Sector|Semisótano|Suite|" \
    r"Supermanzana|Terraza|Torre|Troncal|" \
    r"Unidad|Urbanización|Vereda|Via|Zona|" \
    r"AGN|AL|APTO|AS|BR|BL|BG|CM|CLJ|CN|CT|" \
    r"CA|CAS|CEL|CE|CECO|CEUR|CIR|CDM|CONJ|CS|" \
    r"CO|DP|DS|ED|EN|ESQ|ET|FCA|GJ|GS|GR|INF|" \
    r"IP|IN|KM|LC|LM|LS|LT|MZ|MZTA|MJ|MN|MD|" \
    r"MUN|NCO|OF|OS|PA|PCN|PSJ|PH|PI|PT|PD|" \
    r"PPAL|PN|QDA|SA|SEC|SS|SU|SMZ|TZ|TO|TRL|" \
    r"UN|URB|VDA|VIA|ZN)?(\s)?[1-9][0-9]{0,3})*$"

PHONE_MESSAGE = \
    "El número de teléfono debe " \
    "ser ingresado en el formato: " \
    "(+xxx) xxx xxxx ext xxx " \
    "siendo el código de área y " \
    "la extensión opcionales."

CELPHONE_MESSAGE = \
    "El número de celular debe " \
    "ser ingresado en el formato: " \
    "(+xxx) xxx xxxx xxxx siendo " \
    "el código de país opcional"

NIT_MESSAGE = \
    "El número NIT debe ser " \
    "ingresado en el formato: " \
    "xxxxxxxxx-x"

ADDRESS_MESSAGE = \
    "La dirección ingresada " \
    "debe ser valida para Colombia" \

PHONE_REGEX_VALIDATOR = RegexValidator(
    regex=PHONE_REGEX,
    message=PHONE_MESSAGE)

CELPHONE_REGEX_VALIDATOR = RegexValidator(
    regex=CELPHONE_REGEX,
    message=CELPHONE_MESSAGE)

NIT_REGEX_VALIDATOR = RegexValidator(
    regex=NIT_REGEX,
    message=NIT_MESSAGE
)

ADDRESS_REGEX_VALIDATOR = RegexValidator(
    regex=ADDRESS_REGEX,
    message=ADDRESS_MESSAGE)
