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
        create first segment of the document.
        """

        letter_header = self.create_letter_header()
        msg = self.create_first_letter_paragraph()
        engineer = self.create_signatures_table()
        self.story += [
            *letter_header,
            NextPageTemplate('normal'),
            Spacer(self.width, 1 * cm),
            msg,
            Spacer(self.width, 1.5 * cm),
            engineer,
            PageBreak()
        ]

    def create_letter_two(self):
        """
        create second segment of the pdf.
        """

        letter_header = self.create_letter_header()
        para_one = self.create_second_letter_paragraph_one()
        bullets_one = None
        bullets_two = None

        diagram_one = self.create_letter_two_diagram_one()

        msg_two = Paragraph('something', style=STANDARD)

        diagram_two = self.create_letter_two_diagram_two()

        msg_three = Paragraph("""
        <ol><li>Corresponde a la posición de la medición y 
        puede variar tanto, como puntos de medición tenga el 
        equipo.<br/><br/>Para el ejemplo, el 1 corresponde al 
        rodamiento motor lado libre.<br/><br/></li><li>El segundo 
        dígito  siempre será una letra, y corresponde a la posición 
        del sensor en el momento de la medición. Ejemplo:<br/><br/> 
        <center>H = Horizontal</center><br/><center>V = Vertical
        </center><br/><center>A = Axial</center><br/><br/><br/></li>
        <li>El tercer dígito también será una letra y corresponde 
        a la unidad en la cual se realiza la medición.<br/><br/><br/>
        <center>V = Velocidad</center><br/><center>A = Aceleración</center>
        <br/><center>D  = Desplazamiento </center><br/></li></ol><br/> 
        """, style=STANDARD)

        msg_four = self.create_second_letter_paragraph_two()

        title_one = self.create_second_letter_title(
            '<u>Tabla N. 1.</u> Rangos de severidad vibratoria para máquinas ISO 10816-1. ')

        diagram_three = self.create_letter_two_diagram_three()

        title_two = self.create_second_letter_title(
            '<u>TIPO DE MÁQUINAS (entre 10 y 200 rev/s)</u>')

        especifications_one = None

        title_three = self.create_second_letter_title(
            '<u>CALIDAD DE LA VIBRACIÓN</u>')

        especifications_two = None

        self.story += [
            *letter_header,  # conatins a list of flowables thus needs to be spread
            NextPageTemplate('measurement_two'),
            Spacer(self.width, 1 * cm),
            para_one,
            diagram_one,
            PageBreak(),
            msg_two,
            NextPageTemplate('measurement'),
            Spacer(self.width, 1 * cm),
            # diagram_two,
            Spacer(self.width, 1 * cm),
            msg_three,
            PageBreak(),
            title_one,
            Spacer(self.width, 1 * cm),
            # table,
            Spacer(self.width, 1 * cm),
            title_two,
            Spacer(self.width, 1 * cm),
            # especifications_one,
            Spacer(self.width, 1 * cm),
            title_three,
            Spacer(self.width, 1 * cm),
            # especifications_two,
        ]

    def create_pred(self, query_instance):
        especifications = self.machine_specifications_table()
        diagram = self.pictures_table(
            query_instance.machine.images.first().diagram,
            query_instance.machine.images.first().image)
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
        ]
