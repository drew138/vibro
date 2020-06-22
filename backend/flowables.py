from reportlab.platypus import PageBreak, PageTemplate, BaseDocTemplate, Paragraph, NextPageTemplate, TableStyle, Image, Spacer
from reportlab.platypus.tables import Table
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus.frames import Frame
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import cm
from django.db import models
from reportlab.lib.pagesizes import letter
from io import BytesIO
from reportlab.lib.colors import Color, black

import os
import datetime
from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.pdfbase.ttfonts import TTFont

registerFont(TTFont('Arial', 'ARIAL.ttf'))  # register arial fonts
registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))


# file location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO = os.path.join(BASE_DIR, 'static\\images\\logo.jpg')
SKF = os.path.join(BASE_DIR, 'static\\images\\skf.jpg')
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
NOW = datetime.datetime.now()
CURRENT_YEAR = NOW.year
CURRENT_MONTH = NOW.month
CURRENT_DAY = NOW.day
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
# constants for paragraph styles
STANDARD = ParagraphStyle(
    name='standard', fontName='Arial', fontSize=10)
STANDARD_CENTER = ParagraphStyle(
    name='standard_center', fontName='Arial', fontSize=10, alignment=1)
STANDARD_HEADER = ParagraphStyle(
    name='standard_header', fontName='Arial', fontSize=10, alignment=2)
STANDARD_JUSTIFIED = ParagraphStyle(
    name='standard_justified', fontName='Arial', fontSize=10, alignment=4)
BLACK_BOLD = ParagraphStyle(
    name='black_bold', fontName='Arial-Bold', fontSize=10)
BLACK_BOLD_CENTER = ParagraphStyle(
    name='black_bold_center', fontName='Arial-Bold', fontSize=10, alignment=1)
BLUE_HEADER = ParagraphStyle(name='blue_hf', fontName='Arial-Bold', fontSize=10,
                             textColor=COMPANY_HEADER_BLUE, alignment=2)
BLUE_FOOTER = ParagraphStyle(name='blue_hf', fontName='Arial-Bold', fontSize=10,
                             textColor=FOOTER_BLUE, alignment=1)
BLACK_SMALL = ParagraphStyle(
    name='black_small', fontName='Arial', fontSize=7, alignment=1)
GREEN_SMALL = ParagraphStyle(
    name='green_small', fontName='Arial', fontSize=7, textColor=HEADER_FOOTER_GREEN, alignment=1)
# footer paragraph lines
LINE_ONE = Paragraph('_' * 80, style=BLUE_FOOTER)
LINE_TWO = Paragraph(
    f'{ADDRESS} {PHONE} {CELPHONE} {WHATSAPP}', style=BLACK_SMALL)
LINE_THREE = Paragraph(
    text=f'{WEBSITE} E-mail: <a href="mailto:{EMAIL}"><font color="blue">{EMAIL}</font></a> {FOOTER_CITY}', style=GREEN_SMALL)
# Frames used for templates
STANDARD_FRAME = Frame(1.6*cm, 2*cm, 18*cm, 26*cm,
                       id='standard')
MACHINE_FRAME = Frame(1.6*cm, 2*cm, 18*cm, 23*cm,
                      id='big_header')


class Flowables(BaseDocTemplate):

    """
    class containing all minor flowables 
    used in the creation of documents.
    """

    def __init__(self, filename, querysets, company, date, user, **kwargs):
        super().__init__(filename, **kwargs)
        self.filename = filename
        self.querysets = querysets  # model objects to populate pdf
        self.user = user
        self.company = company
        self.date = date
        # self.company = self.user.company # TODO uncomment and remove self.company
        # self.date = self.querysets.first().date TODO uncomment and remove self.date
        self.toc = TableOfContents()  # table of contents object
        self.story = []
        self.width = 18 * cm
        self.leftMargin = 1.6 * cm
        self.bottomMargin = 2 * cm
        self.templates = [
            PageTemplate(id='measurement',
                         frames=[MACHINE_FRAME],
                         onPage=self._header_one,
                         onPageEnd=self._footer),
            PageTemplate(id='measurement_two',
                         frames=[STANDARD_FRAME],
                         onPage=self._header_two,
                         onPageEnd=self._footer),
            PageTemplate(id='normal', frames=[
                         STANDARD_FRAME], onPage=self._header_two),
        ]
        self.addPageTemplates(self.templates)

    # finished

    def _create_header_table(self):
        """
        create table to manage
        elements in custom header.
        """

        logo = Image(LOGO, width=8.65 * cm, height=2.51 * cm)
        skf = Image(SKF, width=1.76 * cm, height=0.47 * cm)
        skf_text = Paragraph('Con tecnología', style=GREEN_SMALL)
        report_date = Paragraph(self.date.upper(), style=STANDARD_HEADER)
        company = Paragraph(self.company.upper(), style=BLUE_HEADER)
        data = [[logo, skf_text, report_date], ['', skf, company]]
        styles = [
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('VALIGN', (0, 0), (0, -1), 'MIDDLE'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('VALIGN', (1, 0), (1, 0), 'BOTTOM'),
            ('VALIGN', (1, -1), (1, -1), 'TOP'),
            ('VALIGN', (2, 0), (2, -1), 'MIDDLE'),
            ('ALIGN', (2, 0), (2, -1), 'LEFT'),
            ('SPAN', (0, 0), (0, -1)),
        ]
        table = Table(data, colWidths=[
                      9 * cm, 2.5 * cm, 6.5 * cm], rowHeights=[1.26 * cm, 1.26 * cm])
        table.setStyle(TableStyle(styles))
        return table

    @staticmethod
    def _create_footer_table():
        """
        create table to manage
        elements in footer.
        """

        data = [[LINE_ONE], [LINE_TWO], [LINE_THREE]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER')
        ]
        table = Table(data, colWidths=[18 * cm],
                      rowHeights=[0.5 * cm, 0.4 * cm, 0.4 * cm])
        table.setStyle(TableStyle(styles))
        return table

    @staticmethod
    def _create_analysis_table(analysis, recomendation):
        """
        create table of analysis.
        """

        header_one = Paragraph(
            'ANÁLISIS DE VIBRACIÓN', style=STANDARD_CENTER)
        header_two = Paragraph(
            'CORRECTIVOS Y/O RECOMENDACIONES', style=STANDARD_CENTER)
        analysis = Paragraph(analysis, style=STANDARD)
        recomendation = Paragraph(recomendation, style=STANDARD)

        data = [[header_one], [analysis],
                [header_two], [recomendation]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER')
        ]
        table = Table(data, colWidths=[18 * cm])
        table.setStyle(TableStyle(styles))
        return table

    @ staticmethod
    def graph_table(title, graph):
        """
        create a table containing
        an especified graphic.
        """

        title = Paragraph(title, style=STANDARD_CENTER)
        graph = Image(graph, width=17 * cm, height=6 * cm)
        data = [[title], [graph]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BACKGROUND', (0, 0), (0, 0), TABLE_BLUE),
            ('GRID', (0, 0), (-1, -1), 0.25, black)
        ]
        table = Table(data, colWidths=[18 * cm], rowHeights=[0.5 * cm, 7 * cm])
        table.setStyle(TableStyle(styles))
        return table

    def _header_one(self, canvas, doc):
        """
        method to be passed to PageTemplate
        objects on onPage keyword argument 
        to generate headers of measurements.
        """

        canvas.saveState()
        page = Paragraph(str(doc.page), style=BLACK_SMALL)
        w, h = page.wrap(self.width, 1 * cm)
        page.drawOn(canvas, self.leftMargin +
                    ((self.width - w) / 2), (29 * cm) - h)
        table = self._create_header_table()
        _, ht = table.wrap(self.width, 3 * cm)
        table.drawOn(canvas, self.leftMargin, 28 * cm - ht)
        canvas.restoreState()

    def _header_two(self, canvas, doc):
        """
        method to be passed to PageTemplate
        objects on onPage keyword argument 
        to generate basic headers.
        """

        canvas.saveState()
        page = Paragraph(str(doc.page), style=BLACK_SMALL)
        w, h = page.wrap(self.width, 1 * cm)
        page.drawOn(canvas, self.leftMargin +
                    ((self.width - w) / 2), (29 * cm) - h)
        canvas.restoreState()

    def _footer(self, canvas, doc):
        """
        method to be passed to PageTemplate
        objects on onPageEnd keyword argument
        to generate footers.
        """

        canvas.saveState()
        table = self._create_footer_table()
        _, h = table.wrap(self.width, self.bottomMargin)
        table.drawOn(canvas, self.leftMargin, (2 * cm - h) / 2)
        canvas.restoreState()

    def create_letter_header(self):
        """"
        create header containing engineer
        name and introduction line of date.
        """

        name = f'{self.user.first_name} {self.user.last_name}'
        date = Paragraph(
            f'Medellín, {CURRENT_DAY} de {MONTHS[CURRENT_MONTH - 1]} de {CURRENT_YEAR},', style=STANDARD)

        engineer_client = Paragraph(
            f"""Ingeniero:<br/><font name="Arial-Bold">{name.upper()}
            </font><br/>Dpto. de Mantenimiento <br/>Email: 
            <font color='blue'><a href={f'mailto:{self.user.email}'}>{self.user.email}</a></font>""",
            style=STANDARD)
        flowables = [
            date,
            Spacer(self.width, 1 * cm),
            engineer_client
        ]
        return flowables

    @staticmethod
    def create_table_title():
        """
        create a paragraph flowable to
        be used as a title for the tables.
        """

        title = Paragraph(
            'LECTURAS REGISTRADAS (@ptitude - SKF)', style=STANDARD_CENTER)
        return title

    @staticmethod
    def create_tendendy_title():
        """
        create a paragraph flowable to
        be used as a title for the 
        tendency graphs. 
        """

        title = Paragraph('GRAFICAS TENDENCIAS (En el tiempo)',
                          style=STANDARD_CENTER)
        return title

    @staticmethod
    def create_espectra_title():
        """
        create a paragraph flowable to
        be used as a title for the 
        tendency graphs. 
        """

        title = Paragraph('GRAFICAS ESPECTROS',
                          style=STANDARD_CENTER)
        return title

    @staticmethod
    def create_time_signal_title():
        """
        create a paragraph flowable to
        be used as a title for the 
        tendency graphs. 
        """

        title = Paragraph('GRAFICAS SEÑAL EN EL TIEMPO',
                          style=STANDARD_CENTER)
        return title

    # TODO

    @staticmethod
    def pictures_table(diagram_img, machine_img):
        """
        create a table containing the 
        diagram image and the machine image.
        """

        diagram_img = Image(diagram_img)
        machine_img = Image(machine_img)
        diagram = Paragraph('DIAGRAMA ESQUEMATICO', style=STANDARD)
        machine = Paragraph('IMAGEN MAQUINA', style=STANDARD)
        data = [[diagram, machine], [diagram_img, machine_img]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.25, black),
            ('BACKGROUND', (0, 0), (1, 0), TABLE_BLUE)
        ]
        table = Table(data, colWidths=[
                      9 * cm, 9 * cm], rowHeights=[0.5 * cm, 6 * cm])
        table.setStyle(TableStyle(styles))
        return table

    def machine_specifications_table(self):
        """
        create table detailing especifications 
        of each machine and their current severity.
        """

        data = None
        styles = None
        table = Table(data, colWidths=[18 * cm], rowHeights=[0.5 * cm, 7 * cm])
        table.setStyle(TableStyle(styles))
        return table
