from reportlab.platypus import PageBreak, PageTemplate, BaseDocTemplate, Paragraph, FrameBreak, NextPageTemplate
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus.frames import Frame
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import cm
from django.db import models
from reportlab.lib.pagesizes import letter
from io import BytesIO
from reportlab.lib.colors import Color

create table to generate footer and header

# constants for footer
ADDRESS = 'Calle 9A  No. 54 - 129 Guayabal'
PHONE = 'PBX: (4) 362 00 62'
CELPHONE = 'Cel. 312 296 84 50'
WHATSAPP = 'WhatsApp 301  249 92 84'
WEBSITE = 'www.vibromontajes.com'
EMAIL = 'E-mail: servicios@vibromontajes.com'
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
HEADER_BLUE = ParagraphStyle(name='header_blue', fontName='Arial-Bold', fontSize=10,
                             textColor=COMPANY_HEADER_BLUE)


class Report(BaseDocTemplate):

    def __init__(self, filename, querysets):
        super().__init__(self, filename, **kwargs, pagesize=letter)
        self.filename = filename
        self.querysets = querysets  # model objects to populate pdf
        self.toc = TableOfContents()  # table of contents object
        self.story = []

        self.frame = Frame(2.5*cm, 2.5*cm, 15*cm, 25*cm, id='F1')
        self.template = PageTemplate('normal', [self.frame])
        self.addPageTemplates(template)
        # paragraph styles

    @staticmethod
    def _footer(canvas, doc, content):
        canvas.saveState()
        P = Paragraph("This is a multi-line footer.  It goes on every page.  " * 5,
                      styleN)
        w, h = P.wrap(doc.width, doc.bottomMargin)
        P.drawOn(canvas, doc.leftMargin, h)
        canvas.restoreState()

    @staticmethod
    def _header_footer_layout(canvas, doc):
        """
        method to be passed to PageTemplate
        objects on onPage keyword argument.
        In this case, it will dynamically
        add a footer and header to each page.
        """

        canvas.saveState()
        canvas.setPageSize(self.pagesize)
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
        canvas.setPageSize(self.pagesize)
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
        canvas.setPageSize(self.pagesize)
        canvas.restoreState()

    def afterFlowable(self, flowable):
        "Registers TOC entries."

        if flowable.__class__.__name__ == 'Paragraph':
            text = flowable.getPlainText()
            style = flowable.style.name
            if style == 'Heading1':
                self.notify('TOCEntry', (0, text, self.page))
            if style == 'Heading2':
                self.notify('TOCEntry', (1, text, self.page))
