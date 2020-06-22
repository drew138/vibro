from .segment import Segment
from .flowables import STANDARD_CENTER
from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak


class Report(Segment):

    """
    class that calls methods to 
    combine different segments of the pdf.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def build_doc(self):
        """
        build document.
        """
        self.addPageTemplates(self.templates)
        self.create_letter_one()
        self.story += [Paragraph(
            'CORRECTIVOS Y/O RECOMENDACIONES', style=STANDARD_CENTER), NextPageTemplate("measurement"), PageBreak(), Paragraph(
            'CORRECTIVOS Y/O RECOMENDACIONES', style=STANDARD_CENTER), self._create_analysis_table('aaaaaaa<br/>asdasdasdasd ' * 10, 'asdasdasdadds ' * 90)]
        self.write_pdf()

        self.multiBuild(self.story)

    def write_pdf(self):
        """
        generate document flowables
        according to queryset.
        """
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


Report('test.pdf', 'hi', 'company', 'date').build_doc()
