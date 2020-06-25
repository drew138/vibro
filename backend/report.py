from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak
from .flowables import STANDARD_CENTER
from .segment import Segment


class Report(Segment):

    """
    class that calls methods to 
    combine different segments 
    of the pdf.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.measurement_types = set()

    def build_doc(self):
        """
        call write_pdf method to 
        build all segments of the 
        pdf to then build report.
        """

        self.write_pdf()
        self.multiBuild(self.story)

    def write_pdf(self):
        """
        generate document segments.
        """

        self.create_first_letter()
        self.create_toc()
        self.create_second_letter()
        self.create_ISO()
        # TODO add remaining methods

    def afterFlowable(self, flowable):
        "Registers TOC entries."

        if flowable.__class__.__name__ == 'Paragraph':
            text = flowable.getPlainText()
            style = flowable.style.name
            if style == 'Table of contents':
                self.notify('TOCEntry', (0, text.upper(), self.page))
            elif style == 'INFORME ADMINISTRATIVO':
                self.notify(
                    'TOCEntry', (0, style, self.page))
                self.notify(
                    'TOCEntry', (1, 'CARTA CONFIGURACION PREDICTIVO', self.page))
            elif text == 'CALIDAD DE LA VIBRACIÓN' and style == 'black_bold_center':
                self.notify(
                    'TOCEntry', (1, 'NORMA ISO 10816-1', self.page))

 # moack data used for debugging


class Profile:
    def __init__(self):
        self.certifications = 'Ing. de Servicios de Mantenimiento'


class User:
    def __init__(self):
        self.company = 'some company'
        self.email = 'person@email.com'
        self.first_name = 'andres'
        self.last_name = "asdasdasd"
        self.profile = Profile()


class QuerySet:
    def __init__(self):
        self.date = 'date'
        self.engineer_one = User()
        self.engineer_two = User()

    def first(self):
        return self


user = User()

queryset = QuerySet()

Report('test.pdf', queryset, user).build_doc()
