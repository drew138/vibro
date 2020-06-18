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


class Report(BaseDocTemplate):

    def __init__(self, filename, querysets):
        super().__init__(self, filename, **kwargs, pagesize=letter)
        self.filename = filename
        self.querysets = querysets  # model objects to populate pdf

        self.toc = TableOfContents()  # table of contents object
        self.story = []

        self.footer_content = ''
        self.header_content = ''

        self.frame = Frame(2.5*cm, 2.5*cm, 15*cm, 25*cm, id='F1')
        self.template = PageTemplate('normal', [self.frame])
        self.addPageTemplates(template)
        # paragraph styles
        self.style_1 = ParagraphStyle(
            name='Heading1', fontName='Helvetica', fontSize=20)
        self.style_2 = ParagraphStyle(
            name='Heading2', fontName='Helvetica', fontSize=20)
        self.style_3 = ParagraphStyle(
            name='Heading3', fontName='Helvetica', fontSize=20)
        self.style_3 = ParagraphStyle(
            name='Heading3', fontName='Arial-Bold', fontSize=9)
        self.style_4 = ParagraphStyle(name='Heading4', fontName='Arial-Bold', fontSize=11,
                                      textColor=Color(red=(82/255), green=(139/255), blue=(166/255)))
        self.style_5 = ParagraphStyle(
            name='Heading5', fontName='Arial', fontSize=7, textColor=Color(red=0, green=(102/255), blue=0))
        # footer content
        self.address = 'Calle 9A  No. 54 - 129 Guayabal'
        self.phone = 'PBX: (4) 362 00 62'
        self.celphone = 'Cel. 312 296 84 50'
        self.whatsapp = 'WhatsApp 301  249 92 84'
        self.website = 'www.vibromontajes.com'
        self.email = 'E-mail: servicios@vibromontajes.com'
        self.city = 'Medellín, Colombia'

    @staticmethod
    def footer(canvas, doc, content):
        canvas.saveState()
        P = Paragraph("This is a multi-line footer.  It goes on every page.  " * 5,
                      styleN)
        w, h = P.wrap(doc.width, doc.bottomMargin)
        P.drawOn(canvas, doc.leftMargin, h)
        canvas.restoreState()

    @staticmethod
    def header_footer_layout(canvas, doc):
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
    def footer_layout(canvas, doc):
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
    def empty_layout(canvas, doc):
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
