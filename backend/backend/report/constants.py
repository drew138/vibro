from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import Color, black
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.frames import Frame
from reportlab.platypus import Paragraph
from reportlab.lib.units import cm
import datetime
import os


# file location
BASE_DIRECTORY = os.path.dirname(  # ! TODO needs to point to digitalocean
    os.path.join(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )
    )
)

LOGO = os.path.join(BASE_DIRECTORY, 'static', 'images', 'logo.jpg')

SKF = os.path.join(BASE_DIRECTORY, 'static', 'images', 'skf.jpg')

DIAGRAM = os.path.join(BASE_DIRECTORY, 'static', 'images', 'numeration.png')

ARROW = os.path.join(BASE_DIRECTORY, 'static', 'images', 'arrow.png')

# register fonts
registerFont(
    TTFont(
        'Arial',
        os.path.join(
            BASE_DIRECTORY,
            'static',
            'fonts',
            'arial.ttf'
        )
    )
)

registerFont(
    TTFont('Arial-Bold', os.path.join(BASE_DIRECTORY, 'static', 'fonts', 'arialbd.ttf')))


# datetime constants
MONTHS = (
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
)


def CURRENT_YEAR(): return datetime.datetime.now().year


def CURRENT_MONTH(): return datetime.datetime.now().month


def CURRENT_DAY(): return datetime.datetime.now().day


# constants for footer
ADDRESS = 'Calle 9A  No. 54 - 129 Guayabal'

PHONE = 'PBX: (4) 362 00 62'

CELPHONE = 'Cel. 312 296 84 50'

WHATSAPP = 'WhatsApp 301  249 92 84'

WEBSITE = 'www.vibromontajes.com'

EMAIL = 'servicios@vibromontajes.com'

FOOTER_CITY = 'Medellín, Colombia'

# constants for colors
HEADER_FOOTER_GREEN = Color(red=0, green=(102/255), blue=0)

COMPANY_HEADER_BLUE = Color(red=(82/255), green=(139/255), blue=(166/255))

TABLE_BLUE = Color(red=(141/255), green=(179/255), blue=(226/255))

FOOTER_BLUE = Color(red=(84/255), green=(141/255), blue=(212/255))

RED = Color(red=1, green=0, blue=0)

YELLOW = Color(red=1, green=1, blue=0)

GREEN = Color(red=0, green=1, blue=0)

WHITE = Color(red=1, green=1, blue=1)

BLACK = black

FADED_GREEN = Color(
    red=(153/255),
    green=1,
    blue=(153/255)
)

# paragraph styles for TOC entries
ADMIN_REPORT = ParagraphStyle(
    name='INFORME ADMINISTRATIVO',
    fontName='Arial',
    fontSize=10
)

TABLE_OF_CONTENTS = ParagraphStyle(
    name='Table of contents',
    fontName='Arial-Bold',
    fontSize=15,
    alignment=1
)

BLACK_BOLD_CENTER = ParagraphStyle(
    name='black_bold_center',
    fontName='Arial-Bold',
    fontSize=10,
    alignment=1
)

SUMMARY = ParagraphStyle(
    name='summary',
    fontName='Arial-Bold',
    fontSize=10,
    alignment=1
)

SUMMARY_TWO = ParagraphStyle(
    name='summary_two',
    fontName='Arial-Bold',
    fontSize=10,
    alignment=1
)

MACHINE_PARAGRAPH = ParagraphStyle(
    name='machine_entry',
    fontName='Arial',
    fontSize=10,
    alignment=1
)

# constants for paragraph styles
STANDARD = ParagraphStyle(
    name='standard',
    fontName='Arial',
    fontSize=10
)

STANDARD_CENTER = ParagraphStyle(
    name='standard_center',
    fontName='Arial',
    fontSize=10,
    alignment=1
)

STANDARD_HEADER = ParagraphStyle(
    name='standard_header',
    fontName='Arial',
    fontSize=10,
    alignment=2
)

STANDARD_JUSTIFIED = ParagraphStyle(
    name='standard_justified',
    fontName='Arial',
    fontSize=10,
    alignment=4
)

STANDARD_INDENTED = ParagraphStyle(
    name='standard_indented',
    fontName='Arial',
    fontSize=10,
    leftIndent=130
)

BLACK_BOLD = ParagraphStyle(
    name='black_bold',
    fontName='Arial-Bold',
    fontSize=10
)

BLUE_HEADER = ParagraphStyle(
    name='blue_hf',
    fontName='Arial-Bold',
    fontSize=10,
    textColor=COMPANY_HEADER_BLUE,
    alignment=2
)

BLUE_FOOTER = ParagraphStyle(
    name='blue_hf',
    fontName='Arial-Bold',
    fontSize=10,
    textColor=FOOTER_BLUE,
    alignment=1
)

BLACK_SMALL = ParagraphStyle(
    name='black_small',
    fontName='Arial',
    fontSize=7,
    alignment=1
)

GREEN_SMALL = ParagraphStyle(
    name='green_small',
    fontName='Arial',
    fontSize=7,
    textColor=HEADER_FOOTER_GREEN,
    alignment=1
)

# paragraph styles for TOC
LEVEL_ONE = ParagraphStyle(
    name='level_one',
    fontName='Arial',
    fontSize=12,
    endDots=' . '
)

LEVEL_TWO = ParagraphStyle(
    name='level_two',
    fontName='Arial',
    fontSize=10,
    leftIndent=30,
    endDots=' . '
)

# footer paragraph lines
LINE_ONE = Paragraph('_' * 80, style=BLUE_FOOTER)

LINE_TWO = Paragraph(
    f'{ADDRESS} {PHONE} {CELPHONE} {WHATSAPP}',
    style=BLACK_SMALL
)

LINE_THREE = Paragraph(
    text=f'{WEBSITE} E-mail: <a href="mailto:{EMAIL}"> \
	<font color="blue">{EMAIL}</font></a> {FOOTER_CITY}',
    style=GREEN_SMALL
)

# Frames used for templates
STANDARD_FRAME = Frame(1.6*cm, 2*cm, 18*cm, 26*cm, id='standard')

MACHINE_FRAME = Frame(1.6*cm, 2*cm, 18*cm, 23*cm, id='big_header')
