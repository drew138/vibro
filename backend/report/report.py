from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak
from .flowables import STANDARD_CENTER
from .segment import Segment
from backend.models import VibroUser, Measurement


class Report(Segment):

    """
    class that calls methods to 
    combine different segments 
    of the pdf.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.machine_types = set()

    def closer_buffers(self):
        for buffer in self.buffers:
            buffer.close()

    def write_preds(self):
        """
        calls create_pred for all 
        measurements in query instance.
        """

        for query_instance in self.queryset:
            self.create_pred(query_instance)

    def write_pdf(self):
        """
        generate document segments.
        """

        self.create_first_letter()
        self.create_toc()
        self.create_second_letter()
        self.create_ISO()
        # self.create_summary() TODO uncomment
        self.write_preds()

    def build_doc(self):
        """
        call write_pdf method to 
        build all segments of the 
        pdf to then build report.
        """

        self.write_pdf()
        self.multiBuild(self.story)
        self.closer_buffers()

    def afterFlowable(self, flowable):
        """
        Registers TOC entries.
        """

        # TODO add entries for preds
        if flowable.__class__.__name__ == 'Paragraph':
            text = flowable.getPlainText()
            style = flowable.style.name
            page = str(self.page)
            if style == 'Table of contents':
                self.notify('TOCEntry', (0, text.upper(),
                                         self.page, page))
            elif style == 'INFORME ADMINISTRATIVO':
                self.notify(
                    'TOCEntry', (0, style, self.page, page))
                self.notify(
                    'TOCEntry', (1, 'CARTA CONFIGURACION PREDICTIVO', self.page, page))
            elif text == 'CALIDAD DE LA VIBRACIÓN' and style == 'black_bold_center':
                self.notify(
                    'TOCEntry', (1, 'NORMA ISO 10816-1', self.page, page))
            elif style == 'summary':
                self.notify(
                    'TOCEntry', (1, 'INFORME RESUMEN', self.page, page))
            elif style == 'machine_entry':
                self.notify(
                    'TOCEntry', (1, text, self.page, page))


# moack data used for debugging
# class Profile:
#     def __init__(self):
#         self.certifications = 'Ing. de Servicios de Mantenimiento'


# class Date:
#     def __init__(self):
#         self.date = 'date'


# class User:
#     def __init__(self):
#         self.company = 'some company'
#         self.email = 'person@email.com'
#         self.first_name = 'andres'
#         self.last_name = "asdasdasd"
#         self.profile = Profile()


# class QuerySet:
#     def __init__(self):
#         self.date = Date()
#         self.engineer_one = User()
#         self.engineer_two = User()

#     def first(self):
#         return self


# user = VibroUser.objects.filter(username='juliana').first()

# queryset = Measurement.objects.filter(severity='green')

# Report('test.pdf', queryset, user).build_doc()
