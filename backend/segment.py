from .flowables import STANDARD, BLACK_BOLD_CENTER, LEVEL_ONE, LEVEL_TWO, ADMIN_REP
from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak, Image
from reportlab.platypus.tableofcontents import TableOfContents
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
        self.toc = TableOfContents()
        self.story = []
        self.spacer_one = Spacer(self.width, 1 * cm)
        self.spacer_two = Spacer(self.width, 0.5 * cm)

    def create_first_letter(self):
        """
        create first letter of the document.
        """

        letter_header = self.create_letter_header()
        msg = self.create_first_letter_paragraph()
        engineer = self.create_signatures_table()
        self.story += [
            *letter_header,  # contains a list of flowables thus needs to be spread
            NextPageTemplate('normal'),
            Spacer(self.width, 1 * cm),
            msg,
            Spacer(self.width, 1.5 * cm),
            engineer,
            PageBreak()
        ]

    def create_toc(self):
        """
        insert table of contents to pdf.
        """

        title = self.create_toc_title()
        self.toc.levelStyles = [LEVEL_ONE, LEVEL_TWO]
        self.story += [
            title,
            Spacer(self.width, 1 * cm),
            self.toc,
            NextPageTemplate('letter'),
            PageBreak()
        ]

    def create_second_letter(self):
        """
        create second letter of the pdf.
        Note: goes after table of contents (TOC)
        """

        letter_header = self.create_letter_header()
        para_one = self.create_second_letter_paragraph_one()
        bullets_one = self.create_second_letter_bullet_one()
        bullets_two = self.create_second_letter_bullet_two()
        para_two = Paragraph('Ejemplo:', style=ADMIN_REP)
        diagram_one = self.create_letter_two_diagram_one()
        bullets_three = self.create_second_letter_bullet_three()
        diagram_two = self.create_second_letter_diagram_two()
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

        self.story += [
            *letter_header,
            NextPageTemplate('measurement_two'),
            self.spacer_one,
            para_one,
            self.spacer_two,
            bullets_one,
            self.spacer_two,
            bullets_two,
            self.spacer_two,
            para_two,
            self.spacer_one,
            diagram_one,
            PageBreak(),
            bullets_three,
            self.spacer_one,
            diagram_two,
            self.spacer_one,
            bullets_four,
            self.spacer_one,
            bullets_five,
            self.spacer_two,
            indent_one,
            indent_two,
            indent_three,
            self.spacer_one,
            bullets_six,
            self.spacer_one,
            indent_four,
            indent_five,
            indent_six,
            para_three,
            NextPageTemplate('letter'),
            PageBreak()
        ]

    def create_ISO(self):
        """
        returns ISO letter.
        """

        title_one = self.create_iso_letter_title(
            '<u>Tabla N. 1.</u> Rangos de severidad vibratoria para máquinas ISO 10816-1. ')
        diagram_three = self.create_iso_letter_table()
        title_two = self.create_iso_letter_title(
            '<u>TIPO DE MÁQUINAS (entre 10 y 200 rev/s)</u>')
        especifications_one = self.create_iso_letter_especifications_one()
        title_three = self.create_iso_letter_title(
            '<u>CALIDAD DE LA VIBRACIÓN</u>')
        especifications_two = self.create_iso_letter_especifications_two()

        self.story += [
            title_one,
            self.spacer_one,
            diagram_three,
            self.spacer_one,
            title_two,
            self.spacer_one,
            especifications_one,
            self.spacer_one,
            title_three,
            self.spacer_one,
            especifications_two,
            NextPageTemplate('measurement'),
            PageBreak()
        ]

    def create_summary(self):
        """
        adds summary segment to story.
        """

        summary_title = self.create_summary_title()
        self.story.append(summary_title)
        for query_instance in self.queryset:
            table = self.create_summary_table(query_instance)
            self.story += [table, self.spacer_two]
        title_two = self.create_second_summary_title()
        self.story += [PageBreak(), title_two]
        # TODO pending to create graphs and extra tables

    def add_graphs(self, query_instance):
        """
        add graphs to preds segment.
        """

        ##########################################################
        # what create table graph returns may need to be .closed()
        table = Image(self.create_table_graph(query_instance), width=18 * cm)
        tendency_title = self.create_tendendy_title()
        graph_one = self.graph_table(
            'MOTOR (Velocidad)',
            self.create_tendency_graph(query_instance, 'V'))
        graph_two = self.graph_table(
            'MOTOR (Aceleracion)',
            self.create_tendency_graph(query_instance, 'A'))

        #########################################################
        ########## TODO NEEDS DEBUGGING ##############
        flowables = [
            table,
            self.spacer_two,
            tendency_title,
            graph_one,
            self.spacer_one,
            graph_two
        ]
        #############################################
        # TODO add logic to create measurements tables and graphs

        return flowables

    def create_pred(self, query_instance):
        """
        creates a measurement segment 
        for measurement instance.
        """

        especifications = self.machine_specifications_table(query_instance)
        diagram = self.pictures_table(
            query_instance.machine.images.all().first().diagram,
            query_instance.machine.images.all().first().image)
        table_title = self.create_table_title()
        graphs = self.add_graphs(query_instance)
        analysis = self.create_analysis_table(
            query_instance.analysis,
            query_instance.recomendation)

        self.story += [
            especifications,
            self.spacer_one,
            NextPageTemplate('measurement_two'),
            diagram,
            self.spacer_two,
            table_title,
            self.spacer_two,
            *graphs,
            self.spacer_one,
            analysis,
            NextPageTemplate('measurement'),
            PageBreak()
        ]
