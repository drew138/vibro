from reportlab.platypus import PageBreak, PageTemplate, BaseDocTemplate, Paragraph, FrameBreak, NextPageTemplate, TableStyle, Image
from reportlab.platypus.tables import Table
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus.frames import Frame
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import cm
from django.db import models
from reportlab.lib.pagesizes import letter
from io import BytesIO
from reportlab.lib.colors import Color
# from reportlab.pdfgen import canvas


from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.pdfbase.ttfonts import TTFont
registerFont(TTFont('Arial', 'ARIAL.ttf'))
registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))

# constants for footer
ADDRESS = 'Calle 9A  No. 54 - 129 Guayabal'
PHONE = 'PBX: (4) 362 00 62'
CELPHONE = 'Cel. 312 296 84 50'
WHATSAPP = 'WhatsApp 301  249 92 84'
WEBSITE = 'www.vibromontajes.com'
EMAIL = 'servicios@vibromontajes.com'
FOOTER_CITY = 'Medellín, Colombia'
# constants for font colors
HEADER_FOOTER_GREEN = Color(red=0, green=(102/255), blue=0)
COMPANY_HEADER_BLUE = Color(red=(82/255), green=(139/255), blue=(166/255))
# constants for paragraph styles
STANDARD = ParagraphStyle(name='standard', fontName='Arial', fontSize=10)
BLACK_SMALL = ParagraphStyle(name='black_small', fontName='Arial', fontSize=7)
GREEN_SMALL = ParagraphStyle(
    name='green_small', fontName='Arial', fontSize=7, textColor=HEADER_FOOTER_GREEN)
BLACK_BOLD = ParagraphStyle(
    name='black_bold', fontName='Arial-Bold', fontSize=10)
BLUE_HF = ParagraphStyle(name='blue_hf', fontName='Arial-Bold', fontSize=10,
                         textColor=COMPANY_HEADER_BLUE)
MEASUREMENT_TITLE = ParagraphStyle(
    name='title', fontName='Arial-Bold', fontSize=10)
# footer paragraph lines
LINE_ONE = Paragraph('_' * 91, style=BLUE_HF)
LINE_TWO = Paragraph(
    f'{ADDRESS} {PHONE} {CELPHONE} {WHATSAPP}', style=BLACK_SMALL)
LINE_THREE = Paragraph(
    text=f'{WEBSITE} E-mail: <link href="mailto:{EMAIL}">{EMAIL}</link> {FOOTER_CITY}', style=GREEN_SMALL)

w, h = letter
print(w, h, cm)


class Report(BaseDocTemplate):

    """
    Create dynamic reports.
    """

    def __init__(self, filename, querysets):
        super().__init__(self, filename, **kwargs, pagesize=letter)
        self.filename = filename
        self.querysets = querysets  # model objects to populate pdf
        self.toc = TableOfContents()  # table of contents object

        self.story = []
        self.width, self.height = pagesize
        self.frame = Frame(2.5*cm, 2.5*cm, 15*cm, 25*cm, id='F1')
        self.template = PageTemplate('normal', [self.frame])
        self.addPageTemplates(template)
        self.footer = Table([(LINE_ONE,), (LINE_TWO,), (LINE_THREE,)])

    @staticmethod
    def _header_footer_layout(canvas, doc, content):
        """
        method to be passed to PageTemplate
        objects on onPage keyword argument.
        In this case, it will dynamically
        add a footer and header to each page.
        """

        canvas.saveState()
        canvas.setPageSize(letter)
        # add header/footer
        canvas.restoreState()

    @staticmethod
    def _footer_layout(canvas, doc):
        """
        method to be passed to PageTemplate
        objects on onPage keyword argument.
        In this case, it will dynamically
        add a footer to each page.
        """

        canvas.saveState()
        P = Paragraph("This is a multi-line footer.  It goes on every page.  " * 5,
                      styleN)
        w, h = P.wrap(doc.width, doc.bottomMargin)
        P.drawOn(canvas, doc.leftMargin, h)
        canvas.restoreState()

    @staticmethod
    def _empty_layout(canvas, doc):
        """
        method to be passed to PageTemplate
        objects on onPage keyword argument.
        In this case, it will not add further
        elements to the page.
        """

        canvas.saveState()

        canvas.restoreState()

    def create_table_header(self, date, comp):
        """
        create table to manage
        elements in custom header.
        """

        logo = Image('static/images/logo.jpg')
        skf = Image('static/images/skf.jpg')
        logo.drawWidth = 8.65 * cm
        logo.drawHeight = 2.51 * cm
        skf.drawWidth = 1.76 * cm
        skf.drawHeight = 0.47 * cm
        skf_text = Paragraph('Con tecnología', style=GREEN_SMALL)
        report_date = Paragraph(date.upper(), style=STANDARD)
        company = Paragraph(comp.upper(), style=BLUE_HF)
        data = [[logo, skf_text, report_date], ['', skf, company]]
        styles = [
            # align first column to the left horizontally
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            # align first column to the middle vertically
            ('VALIGN', (0, 0), (0, -1), 'MIDDLE'),
            # align 2nd column horizontally to center
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            # align first row in first column to the bottom vertically
            ('VALIGN', (1, 0), (1, 0), 'BOTTOM'),
            # align second row in first column to the top vertically
            ('VALIGN', (1, -1), (1, -1), 'TOP'),
            # align 3rd column vertically to center
            ('VALIGN', (2, 0), (2, -1), 'MIDDLE'),
            # align 3rd column horizontally to left
            ('ALIGN', (2, 0), (2, -1), 'LEFT'),
            # merge first column
            ('SPAN', (0, 0), (0, -1)),
        ]
        table = Table(data, colWidths=[
                      9 * cm, 2 * cm, 7 * cm], rowHeights=[1.26 * cm, 1.26 * cm])
        table.setStyle(TableStyle(styles))
        return table

    def create_footer_table(self):
        """
        create table to manage
        elements in footer.
        """

        data = [[LINE_ONE], [LINE_TWO], [LINE_THREE]]
        styles = [
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER')
        ]
        table = Table(data, colWidths=self.width)
        table.setStyle(TableStyle(styles))
        return table

    def afterFlowable(self, flowable):
        "Registers TOC entries."

        if flowable.__class__.__name__ == 'Paragraph':
            text = flowable.getPlainText()
            style = flowable.style.name
            if style == 'Heading1':
                self.notify('TOCEntry', (0, text, self.page))
            if style == 'Heading2':
                self.notify('TOCEntry', (1, text, self.page))
