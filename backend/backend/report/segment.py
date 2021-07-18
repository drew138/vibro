from .constants import STANDARD, BLACK_BOLD_CENTER, LEVEL_ONE, LEVEL_TWO, ADMIN_REPORT
from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak, Image, KeepTogether
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
        para_two = Paragraph('Ejemplo:', style=ADMIN_REPORT)
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
            '<u>Tabla N. 1.</u> Rangos de severidad \
            vibratoria para máquinas ISO 10816-1. '
        )
        diagram_three = self.create_iso_letter_table()
        title_two = self.create_iso_letter_title(
            '<u>TIPO DE MÁQUINAS (entre 10 y 200 rev/s)</u>'
        )
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

        table_title = self.create_table_title()
        table_title.keepWithNext = True
        table = self.create_table_graph(query_instance)
        overalls_title = self.create_overalls_title()
        overalls_title.keepWithNext = True
        # TODO check if queryset contains V
        graph_one = self.create_overalls_graph(query_instance, 'V')
        table_one = self.graph_table('MOTOR (Velocidad)', graph_one)
        graph_two = self.create_overalls_graph(query_instance, 'A')
        table_two = self.graph_table('MOTOR (Aceleración)', graph_two)

        ########## TODO NEEDS DEBUGGING ##############
        flowables = [
            KeepTogether(
                [table_title,
                 table]),
            self.spacer_two,
            KeepTogether(
                [overalls_title,
                 table_one]),
            self.spacer_one,
            KeepTogether(
                [table_two]),
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
        # TODO check title
        title = self.create_measurement_title_entry(
            query_instance.machine.name.upper())
        diagram = self.pictures_table(
            query_instance.machine.diagram,
            query_instance.machine.image)
        graphs = self.add_graphs(query_instance)
        analysis = self.create_analysis_table(
            query_instance.analysis,
            query_instance.diagnostic)

        self.story += [
            especifications,
            NextPageTemplate('measurement_two'),
            self.spacer_two,
            title,
            diagram,
            self.spacer_two,
            *graphs,
            self.spacer_one,
            analysis,
            NextPageTemplate('measurement'),
            PageBreak()
        ]
