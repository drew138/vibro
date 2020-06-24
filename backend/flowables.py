from reportlab.platypus import PageBreak, PageTemplate, BaseDocTemplate, Paragraph, NextPageTemplate, TableStyle, Image, Spacer
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import Color, black
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.tables import Table
from reportlab.platypus.frames import Frame
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import cm
import datetime
import os


registerFont(TTFont('Arial', 'ARIAL.ttf'))  # register arial fonts
registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))


# file location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO = os.path.join(BASE_DIR, 'static\\images\\logo.jpg')
SKF = os.path.join(BASE_DIR, 'static\\images\\skf.jpg')
DIAGRAM = os.path.join(BASE_DIR, 'static\\images\\Numeration.png')
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
STANDARD_INDENTED = ParagraphStyle(
    name='standard_indented', fontName='Arial', fontSize=10, leftIndent=130
)
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

    def __init__(self, filename, queryset, user, **kwargs):
        super().__init__(filename, **kwargs)
        self.filename = filename
        self.queryset = queryset  # model object that populate pdf
        self.user = user
        self.company = self.user.company
        self.date = self.queryset.first().date
        self.engineer_one = self.queryset.first().engineer_one
        self.engineer_two = self.queryset.first().engineer_two
        self.toc = TableOfContents()
        self.measurement_types = set()
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
            PageTemplate(id='normal',
                         frames=[STANDARD_FRAME],
                         onPage=self._header_two),
        ]
        self.addPageTemplates(self.templates)

    # header/footers methods used in templates
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

    # flowables used in footers/headers
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
        table = Table(
            data,
            colWidths=[
                9 * cm,
                2.5 * cm,
                6.5 * cm],
            rowHeights=[
                1.26 * cm,
                1.26 * cm
            ])
        table.setStyle(TableStyle(styles))
        return table

    # flowables used in first letter

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
        table = Table(
            data,
            colWidths=[
                18 * cm],
            rowHeights=[
                0.5 * cm,
                0.4 * cm,
                0.4 * cm
            ])
        table.setStyle(TableStyle(styles))
        return table

    # flowables used in both letters
    def create_letter_header(self):
        """"
        create header containing engineer
        name and introduction line of date.
        """

        name = f'{self.user.first_name} {self.user.last_name}'
        date = Paragraph(
            f'Medellín, {CURRENT_DAY} de {MONTHS[CURRENT_MONTH - 1]} de {CURRENT_YEAR},',
            style=STANDARD)
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

    # flowables used in first letter
    def create_first_letter_paragraph(self):
        """
        returns Paragraph flowable 
        containing text for the first letter.
        """

        # TODO msg string needs editting
        return Paragraph(f""" 
            Cordial saludo;<br/><br/> 
            Adjuntamos informes de mantenimiento
            predictivo e informe administrativo,
            por correo electrónico, de los equipos 
            de planta, medidos en {self.date} del año
            en curso.<br/><br/>Cada que le realicemos
            un mantenimiento predictivo tener presente
            que el análisis corresponde a la condición
            del equipo en el momento en que fue medido,
            no a la condición posterior o hechos fortuitos
            que puedan alterar la normal operación
            del equipo.<br/><br/>Para optimizar los resultados
            del mantenimiento predictivo y disminución
            de costos de mantenimiento, es recomendable
            que estas mediciones se realicen, mínimo
            cada tres meses.<br/><br/> Verificar el listado,
            nombre de los equipos medidos y ficha técnica;
            favor informarnos datos faltantes y/o datos
            a corregir o modificar.<br/><br/> Recomendamos
            corregir oportunamente y/o inspeccionar los
            equipos que hayan sido reportados con
            funcionamiento no satisfactorio.<br/><br/> 
            NOTA: Favor mantener en cada equipo la placa
            de identificación y nombre del equipo, con el
            fin de evitar incoherencia en la toma de medición
            y la interpretación del análisis. Cualquier 
            inquietud con gusto será aclarada.<br/><br/><br/> 
            Gracias por contar con nosotros.<br/><br/><br/>  
            Atentamente, 
            """, style=STANDARD)

    @staticmethod
    def create_signature_line(string):
        return Paragraph(string, style=STANDARD)

    @staticmethod
    def create_signature_name(string):
        return Paragraph(string, style=BLACK_BOLD)

    def create_signatures_table(self):
        """
        create table to manage
        signatures in of engineers 
        in first letter.
        """

        self.create_signature_name
        line = '_'*36
        first_engineer_full_name = f"""{self.engineer_one.first_name}
         {self.engineer_one.last_name}""".upper()  # space inbetween string

        if self.engineer_two.first_name:
            second_engineer_name = f"""{self.engineer_two.first_name}
             {self.engineer_two.last_name}""".upper()
            data = [
                [
                    self.create_signature_line(line),
                    self.create_signature_line(line)
                ],
                [
                    self.create_signature_name(first_engineer_full_name),
                    self.create_signature_name(second_engineer_name)
                ],
                [  # TODO verify linebreaks \t in certifications of each engineer
                    self.create_signature_line(
                        self.engineer_one.profile.certifications),
                    self.create_signature_line(
                        self.engineer_two.profile.certifications)
                ]
            ]
        else:
            data = [
                [self.create_signature_line(line), ''],
                [self.create_signature_name(first_engineer_full_name), ''],
                [self.create_signature_line(
                    self.engineer_one.profile.certifications),
                    '']
            ]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT')
        ]
        table = Table(
            data,
            colWidths=[
                9 * cm,
                9 * cm],
            rowHeights=[
                0.4 * cm,
                0.5 * cm,
                0.5 * cm
            ])
        table.setStyle(TableStyle(styles))
        return table

    # flowables used in second letter
    @staticmethod
    def create_second_letter_paragraph_one():
        """
        returns initial praragraph of letter two.
        """

        return Paragraph("""
        REF.  Explicación Configuración Predictivo.<br/><br/>
        Cordial saludo:<br/><br/><br/>A continuación les 
        entregamos una pequeña explicación de cómo funciona 
        la configuración del predictivo.""", style=STANDARD)

    @staticmethod
    def create_second_letter_bullet_point(string, bulletText):
        """
        return a paragraph flowable 
        editted to have custom a
        bulletpoint number.
        """

        return Paragraph(string, style=STANDARD, bulletText=bulletText)

    def create_second_letter_bullet_one(self):
        """
        return paragraph containing 
        1st bullet point in second letter.
        """

        return self.create_second_letter_bullet_point(
            """En cada uno de los diagramas esquemáticos 
        de los equipos se especifica claramente el lugar 
        de medición, el número que le corresponde y el tipo 
        de medición a realizar.""", '1.')

    def create_second_letter_bullet_two(self):
        """
        return paragraph containing 
        2nd bullet point in second letter.
        """

        return self.create_second_letter_bullet_point(
            """Orden de la medición por equipo:<br/><br/>
        El orden de medición por equipo está estandarizado 
        y se inicia desde la potencia hacia delante, es 
        decir, el punto 1 siempre será el rodamiento motor 
        lado libre, el punto dos (2) siempre será el rodamiento 
        motor lado transmisión y así avanza hacía el equipo 
        hasta terminar los puntos de medición.""", '2.')

    @staticmethod
    def create_letter_two_diagram_one():
        """
        create a table containing the 
        diagram image of the letter two.
        """

        img_width = 8.5 * cm
        img_height = 6.9 * cm
        img = Image(
            DIAGRAM,
            width=img_width,
            height=img_height)
        diagram = Paragraph('DIAGRAMA ESQUEMATICO', style=STANDARD_CENTER)
        data = [[diagram], [img]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.25, black),
            ('BACKGROUND', (0, 0), (1, 0), TABLE_BLUE)
        ]
        table = Table(
            data,
            colWidths=[8.6 * cm],
            rowHeights=[
                0.5 * cm,
                7 * cm
            ])
        table.setStyle(TableStyle(styles))
        return table

    def create_second_letter_bullet_three(self):
        """
        return paragraph containing 
        3rd bullet point in second letter.
        """

        return self.create_second_letter_bullet_point(
            """Tipo de medición: La especificación del 
        tipo de medición está dada por la siguiente 
        configuración.""", '3.')

    @staticmethod
    def create_letter_two_diagram_two():
        """
        returns diagram containing 
        explanation of measured points.
        """

        # TODO finish method
        """
        1 -> 1
        H -> 2
        V -> 3
        """
        pass

    def create_second_letter_bullet_four(self):
        """
        return paragraph containing 
        4th bullet point in second letter.
        Note: number is 1.
        """

        return self.create_second_letter_bullet_point(
            """Corresponde a la posición de la medición 
            y puede variar tanto, como puntos de medición 
            tenga el equipo.<br/>Para el ejemplo, el 1 
            corresponde al rodamiento motor lado libre.
            """, '1.')

    def create_second_letter_bullet_five(self):
        """
        return paragraph containing 
        4th bullet point in second letter.
        Note: number is 2.
        """

        return self.create_second_letter_bullet_point(
            """El segundo dígito  siempre será una letra, 
            y corresponde a la posición del  sensor en 
            el momento de la medición. Ejemplo.""", '2.')

    def create_second_letter_bullet_six(self):
        """
        return paragraph containing 
        4th bullet point in second letter.
        Note: number is 2.
        """

        return self.create_second_letter_bullet_point(
            """El tercer dígito también será una letra y 
            corresponde a la unidad en la cual se 
            realiza la medición. """, '3.')

    @staticmethod
    def create_indented_paragraph(string):
        """
        returns a paragraph indented to the left.
        """

        return Paragraph(string, style=STANDARD_INDENTED)

    @staticmethod
    def create_second_letter_paragraph_three():
        """
        returns second paragraph of letter two.
        """

        return Paragraph(
            """En resumen:<br/><br/>1 H V = Rodamiento motor lado libre, medida 
        horizontal en velocidad.<br/><br/><br/><font name="Arial-Bold">Con respecto a las 
        unidades de  Vibración:</font> En la tabla de valores se expresa sus 
        niveles globales de vibración, en mms/s pico, para la variable velocidad, 
        siendo necesario multiplicar por 0.707 dicho valor, si se requiere 
        conocer su amplitud en mms/s rms, como lo expresa la Norma ISO 10816-1.<br/> 
        Medir en unidades pico (P.k) permite identificar con más claridad en el 
        espectro, condiciones de los componentes de máquina que operan 
        a baja velocidad.""", style=STANDARD)

    @staticmethod
    def create_letter_two_diagram_three():
        """
        create a table containing
        an especified graphic.
        """

        title_one = Paragraph(
            'Rango de Velocidad efectiva RMS (mm/seg.)', style=BLACK_BOLD_CENTER)
        title_two = Paragraph('Tipos de Máquinas', style=BLACK_BOLD_CENTER)
        data = [
            [title_one, '', title_two, '', '', ''],
            ['', '', 'Clase l', 'Clase ll', 'Clase lll', 'Clase lV'],
            ['', '', '', '', '', ''],
            ['28', '', 'D', 'D', 'D', 'D'],
            ['18', '', '', '', '', 'C'],
            ['11.2', '', '', '', 'C', ''],
            ['7.1', '', '', 'C', '', 'B'],
            ['4.5', '', 'C', '', 'B', ''],
            ['2.8', '', '', 'B', '', 'A'],
            ['1.8', '', 'B', '', 'A', ''],
            ['1.12', '', '', 'A', '', ''],
            ['0.71', '', 'A', '', '', ''],
            ['0.45', '', '', '', '', ''],
            ['0.28', '', '', '', '', ''],
        ]
        styles = [
            # DEFINE TABLE CELLS
            ('SPAN', (0, 0), (1, 2)),
            ('SPAN', (2, 0), (5, 0)),
            ('SPAN', (2, 1), (2, 2)),
            ('SPAN', (3, 1), (3, 2)),
            ('SPAN', (4, 1), (4, 2)),
            ('SPAN', (5, 1), (5, 2)),
            ('SPAN', (0, 3), (1, 3)),
            ('SPAN', (0, 4), (1, 4)),
            ('SPAN', (0, 5), (1, 5)),
            ('SPAN', (0, 6), (1, 6)),
            ('SPAN', (0, 7), (1, 7)),
            ('SPAN', (0, 8), (1, 8)),
            ('SPAN', (0, 9), (1, 9)),
            ('SPAN', (0, 10), (1, 10)),
            ('SPAN', (0, 11), (1, 11)),
            ('SPAN', (0, 12), (1, 12)),
            ('SPAN', (0, 13), (1, 13)),
            ('SPAN', (2, 3), (2, 6)),
            ('SPAN', (2, 7), (2, 8)),
            ('SPAN', (2, 9), (2, 10)),
            ('SPAN', (2, 11), (2, 13)),
            ('SPAN', (3, 3), (3, 5)),
            ('SPAN', (3, 6), (3, 7)),
            ('SPAN', (3, 8), (3, 9)),
            ('SPAN', (3, 10), (3, 13)),
            ('SPAN', (4, 3), (4, 4)),
            ('SPAN', (4, 5), (4, 6)),
            ('SPAN', (4, 7), (4, 8)),
            ('SPAN', (4, 9), (4, 13)),
            ('SPAN', (5, 3), (5, 3)),
            ('SPAN', (5, 4), (5, 5)),
            ('SPAN', (5, 6), (5, 7)),
            ('SPAN', (5, 8), (5, 13)),
            # RED BACKGROUND
            ('BACKGROUND', (2, 3), (2, 6), Color(red=1, green=0, blue=0)),
            ('BACKGROUND', (3, 3), (3, 5), Color(red=1, green=0, blue=0)),
            ('BACKGROUND', (4, 3), (4, 4), Color(red=1, green=0, blue=0)),
            ('BACKGROUND', (5, 3), (5, 3), Color(red=1, green=0, blue=0)),
            # YELLOW BACKGROUND
            ('BACKGROUND', (2, 7), (2, 8), Color(red=1, green=1, blue=0)),
            ('BACKGROUND', (3, 6), (3, 7), Color(red=1, green=1, blue=0)),
            ('BACKGROUND', (4, 5), (4, 6), Color(red=1, green=1, blue=0)),
            ('BACKGROUND', (5, 4), (5, 5), Color(red=1, green=1, blue=0)),
            # GREEN ONE BACKGROUND
            ('BACKGROUND', (2, 9), (2, 10), Color(red=0, green=1, blue=0)),
            ('BACKGROUND', (3, 8), (3, 9), Color(red=0, green=1, blue=0)),
            ('BACKGROUND', (4, 7), (4, 8), Color(red=0, green=1, blue=0)),
            ('BACKGROUND', (5, 6), (5, 7), Color(red=0, green=1, blue=0)),
            # GREEN TWO BACKGROUND
            ('BACKGROUND', (2, 11), (2, 13), Color(
                red=(153/255), green=1, blue=(153/255))),
            ('BACKGROUND', (3, 10), (3, 13), Color(
                red=(153/255), green=1, blue=(153/255))),
            ('BACKGROUND', (4, 9), (4, 13), Color(
                red=(153/255), green=1, blue=(153/255))),
            ('BACKGROUND', (5, 8), (5, 13), Color(
                red=(153/255), green=1, blue=(153/255))),
            # FONT GRID AND ALIGNMENT
            ('FONTNAME', (0, 3), (0, 13), 'Arial'),
            ('FONTNAME', (0, 0), (5, 2), 'Arial-Bold'),
            ('FONTNAME', (2, 3), (-1, -1), 'Arial-Bold'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.25, black),
            ('BOX', (0, 0), (-1, -1), 2.5, black),
            ('BOX', (0, 0), (-1, -1), 1.25, Color(red=1, green=1, blue=1)),
        ]
        table = Table(
            data,
            colWidths=[2 * cm for _ in range(6)],
            rowHeights=[0.5 * cm for _ in range(14)]
        )
        table.setStyle(TableStyle(styles))
        return table

    @staticmethod
    def create_second_letter_title(string):
        """
        return title paragraph 
        used in second letter. 
        """

        return Paragraph(string, style=BLACK_BOLD_CENTER)

    @staticmethod
    def _create_especifications_table(data):
        """
        return basic table populated 
        by the data it is passed.
        """

        styles = [
            ('VALIGN', (0, 0), (1, 3), 'MIDDLE'),
            ('ALIGN', (0, 0), (1, 3), 'CENTER'),
            ('ALIGN', (2, 0), (2, 3), 'LEFT'),

        ]
        table = Table(
            data,
            colWidths=[2 * cm,
                       2 * cm,
                       10 * cm],
            # rowHeights=[0.6 * cm for _ in range(4)]
        )
        table.setStyle(TableStyle(styles))
        return table

    def create_second_letter_especifications_one(self):
        """
        returns first especifications table.
        """

        para_one = Paragraph(
            'Máquinas pequeñas de 15 KW. (20 HP).', style=STANDARD)
        para_two = Paragraph(
            'Máquinas de Tamaño mediano de 15 a 75 KW., o máquinas rígidamente montadas hasta 300 KW.', style=STANDARD)
        para_three = Paragraph(
            'Máquinas grandes sobre 300 KW. Montadas en soportes rígidos.', style=STANDARD)
        para_four = Paragraph(
            'Máquinas grandes sobre 300 KW. Montadas en soportes flexibles.', style=STANDARD)

        data = [
            ['Clase I', ':', para_one],
            ['Clase II', ':', para_two],
            ['Clase III', ':', para_three],
            ['Clase IV', ':', para_four],
        ]
        return self._create_especifications_table(data)

    def create_second_letter_especifications_two(self):
        """
        returns second especificatiosn table.
        """

        data = [
            ['A ', ':', 'Buena'],
            ['B', ':', 'Satisfactoria'],
            ['C', ':', 'Insatisfactoria'],
            ['D', ':', 'Inaceptable'],
        ]
        return self._create_especifications_table(data)

    # Pred flowables

    # TODO finish machine especifications method

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

    @staticmethod
    def pictures_table(diagram_img, machine_img):
        """
        create a table containing the 
        diagram image and the machine image.
        """

        img_width = 7 * cm
        img_height = 6 * cm
        diagram_img = Image(
            diagram_img,
            width=img_width,
            height=img_height)
        machine_img = Image(
            machine_img,
            width=img_width,
            height=img_height)
        diagram = Paragraph('DIAGRAMA ESQUEMATICO', style=STANDARD)
        machine = Paragraph('IMAGEN MAQUINA', style=STANDARD)
        data = [[diagram, machine], [diagram_img, machine_img]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.25, black),
            ('BACKGROUND', (0, 0), (1, 0), TABLE_BLUE)
        ]
        table = Table(
            data,
            colWidths=[
                9 * cm,
                9 * cm],
            rowHeights=[
                0.5 * cm,
                6 * cm
            ])
        table.setStyle(TableStyle(styles))
        return table

    @staticmethod
    def create_table_title():
        """
        create a paragraph flowable to
        be used as a title for the tables.
        """

        return Paragraph(
            'LECTURAS REGISTRADAS (@ptitude - SKF)', style=STANDARD_CENTER)

    @staticmethod
    def create_analysis_table(analysis, recomendation):
        """
        create table of analysis
        of a measurement.
        """

        header_one = Paragraph(
            'ANÁLISIS DE VIBRACIÓN',
            style=STANDARD_CENTER)
        header_two = Paragraph(
            'CORRECTIVOS Y/O RECOMENDACIONES',
            style=STANDARD_CENTER)
        analysis = Paragraph(
            analysis,
            style=STANDARD)
        recomendation = Paragraph(
            recomendation,
            style=STANDARD)
        data = [
            [header_one],
            [analysis],
            [header_two],
            [recomendation]
        ]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER')
        ]
        table = Table(
            data,
            colWidths=[18 * cm])
        table.setStyle(TableStyle(styles))
        return table

    @staticmethod
    def graph_table(title, graph):
        """
        create a table containing
        an especified graphic.
        """

        title = Paragraph(title.upper(), style=STANDARD_CENTER)
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

    @staticmethod
    def create_tendendy_title():
        """
        create a paragraph flowable to
        be used as a title for the 
        tendency graphs. 
        """

        return Paragraph('GRAFICAS TENDENCIAS (En el tiempo)',
                         style=STANDARD_CENTER)

    @staticmethod
    def create_espectra_title():
        """
        create a paragraph flowable to
        be used as a title for the 
        tendency graphs. 
        """

        return Paragraph('GRAFICAS ESPECTROS',
                         style=STANDARD_CENTER)

    @staticmethod
    def create_time_signal_title():
        """
        create a paragraph flowable to
        be used as a title for the 
        tendency graphs. 
        """

        return Paragraph('GRAFICAS SEÑAL EN EL TIEMPO',
                         style=STANDARD_CENTER)
