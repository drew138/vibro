from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak
from .flowables import STANDARD, BLACK_BOLD_CENTER
from reportlab.lib.units import cm
from .graph import Graphs


class Segment(Graphs):

    """
    class containing methods that perform
    complex operations to define the 
    structure of a segment of the document
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def create_first_letter(self):
        """
        create first letter of the document.
        """

        letter_header = self.create_letter_header()
        msg = self.create_first_letter_paragraph()
        engineer = self.create_signatures_table()
        self.story += [
            *letter_header,  # conatins a list of flowables thus needs to be spread
            NextPageTemplate('measurement'),
            Spacer(self.width, 1 * cm),
            msg,
            Spacer(self.width, 1.5 * cm),
            engineer,
            PageBreak()
        ]

    def create_second_letter(self):
        """
        create second letter of the pdf.
        Note: goes after table of contents (TOC)
        """

        spacer_one = Spacer(self.width, 1 * cm)
        spacer_two = Spacer(self.width, 0.5 * cm)
        # add following to story in this exact order
        letter_header = self.create_letter_header()
        para_one = self.create_second_letter_paragraph_one()
        bullets_one = self.create_second_letter_bullet_one()
        bullets_two = self.create_second_letter_bullet_two()
        para_two = Paragraph('Ejemplo:', style=STANDARD)
        diagram_one = self.create_letter_two_diagram_one()
        bullets_three = self.create_second_letter_bullet_three()
        # diagram_two = self.create_letter_two_diagram_two()
        bullets_four = self.create_second_letter_bullet_four()
        bullets_five = self.create_second_letter_bullet_five()
        indent_one = self.create_indented_paragraph('H = Horizontal')
        indent_two = self.create_indented_paragraph('V = Vertical')
        indent_three = self.create_indented_paragraph('A = Axial')
        bullets_six = self.create_second_letter_bullet_six()
        indent_four = self.create_indented_paragraph('V = Velocidad')
        indent_five = self.create_indented_paragraph('A = Aceleración')
        indent_six = self.create_indented_paragraph('D = Desplazamiento')
        para_three = self.create_second_letter_paragraph_three()
        title_one = self.create_second_letter_title(
            '<u>Tabla N. 1.</u> Rangos de severidad vibratoria para máquinas ISO 10816-1. ')
        diagram_three = self.create_letter_two_diagram_three()
        title_two = self.create_second_letter_title(
            '<u>TIPO DE MÁQUINAS (entre 10 y 200 rev/s)</u>')
        especifications_one = self.create_second_letter_especifications_one()
        title_three = self.create_second_letter_title(
            '<u>CALIDAD DE LA VIBRACIÓN</u>')
        especifications_two = self.create_second_letter_especifications_two()

        self.story += [
            *letter_header,
            NextPageTemplate('measurement_two'),
            spacer_one,
            para_one,
            spacer_two,
            bullets_one,
            spacer_two,
            bullets_two,
            spacer_two,
            para_two,
            spacer_one,
            diagram_one,
            PageBreak(),
            bullets_three,
            spacer_one,
            # diagram_two,
            spacer_one,
            bullets_four,
            spacer_one,
            bullets_five,
            spacer_two,
            indent_one,
            indent_two,
            indent_three,
            spacer_one,
            bullets_six,
            spacer_one,
            indent_four,
            indent_five,
            indent_six,
            para_three,
            NextPageTemplate('measurement'),
            PageBreak(),
            title_one,
            spacer_one,
            diagram_three,
            spacer_one,
            title_two,
            spacer_one,
            especifications_one,
            spacer_one,
            title_three,
            spacer_one,
            especifications_two
            # TODO add nextpagetemplate
        ]

    def create_pred(self, query_instance):
        """
        creates a measurement segment 
        for measurement instance.
        """

        especifications = self.machine_specifications_table()
        diagram = self.pictures_table(
            query_instance.machine.images.all().first().diagram,
            query_instance.machine.images.all().first().image)
        title = self.create_table_title()

        # TODO add logic to create measurements tables and graphs
        ###############

        ##############

        analysis = self.create_analysis_table(
            query_instance.analysis,
            query_instance.recomendation)

        self.story += [
            especifications, Spacer(self.width, 1 * cm),
            NextPageTemplate('measurement_two'),
            diagram,
            Spacer(self.width, 0.5 * cm),
            title,
            # TODO add remaining flawables
            analysis,
            NextPageTemplate('measurement'),
            PageBreak()
        ]
