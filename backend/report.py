from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak
from .segment import Segment
from .flowables import STANDARD_CENTER
import os  # TODO remove this dependency


class Report(Segment):

    """
    class that calls methods to 
    combine different segments of the pdf.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def build_doc(self):
        """
        call write_pdf method to 
        build all segments of the 
        pdf to then build report.
        """

        self.write_pdf()
        self.story += [Paragraph(
            'CORRECTIVOS Y/O RECOMENDACIONES', style=STANDARD_CENTER), NextPageTemplate("measurement"), PageBreak(), Paragraph(
            'CORRECTIVOS Y/O RECOMENDACIONES', style=STANDARD_CENTER), self._create_analysis_table('aaaaaaa<br/>asdasdasdasd ' * 10, 'asdasdasdadds ' * 90),
            self.graph_table('asdasdasd', os.path.join(os.path.dirname(
                os.path.abspath(__file__)), 'static\\images\\logo.jpg')), self.create_letter_two_table()
        ]

        self.multiBuild(self.story)

    def write_pdf(self):
        """
        generate document segments.
        """

        self.create_letter_one()
        self.create_letter_two()
        # TODO
        return self

    def afterFlowable(self, flowable):
        "Registers TOC entries."

        if flowable.__class__.__name__ == 'Paragraph':
            text = flowable.getPlainText()
            style = flowable.style.name
            if style == 'Heading1':
                self.notify('TOCEntry', (0, text, self.page))
            if style == 'Heading2':
                self.notify('TOCEntry', (1, text, self.page))

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
