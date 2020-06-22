from .flowables import STANDARD
from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak
from .graph import Graphs
from reportlab.lib.units import cm


class Segment(Graphs):

    """
    class containing methods that perform
    complex operations to define the 
    structure of a segment of the document
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def create_letter_one(self):
        """
        create first segment of the document.
        """

        # TODO edit these varriables
        ###########################
        dates = 'some dates'
        ###################

        letter_header = self.create_letter_header()

        msg = Paragraph(f"""
            Cordial saludo;<br/><br/> 
            Adjuntamos informes de mantenimiento
            predictivo e informe administrativo,
            por correo electrónico, de los equipos 
            de planta, medidos en {dates} del año
            en curso.<br/><br/>Cada que le realicemos
            un mantenimiento predictivo tener presente
            que el análisis corresponde a la condición
            del equipo en el momento en que fue medido,
            no a la condición posterior o hechos fortuitos
            que puedan alterar la normal operación
            del equipo.<br/><br/>Para optimizar los resultados
            del mantenimiento predictivo y disminución
            de costos de mantenimiento, es recomendable
            que estas mediciones se realicen, mínimo
            cada tres meses.<br/><br/> Verificar el listado,
            nombre de los equipos medidos y ficha técnica;
            favor informarnos datos faltantes y/o datos
            a corregir o modificar.<br/><br/> Recomendamos
            corregir oportunamente y/o inspeccionar los
            equipos que hayan sido reportados con
            funcionamiento no satisfactorio.<br/><br/> 
            NOTA: Favor mantener en cada equipo la placa
            de identificación y nombre del equipo, con el
            fin de evitar incoherencia en la toma de medición
            y la interpretación del análisis. Cualquier 
            inquietud con gusto será aclarada.<br/><br/><br/> 
            Gracias por contar con nosotros.<br/><br/><br/>  
            Atentamente, 
            """, style=STANDARD)

        self.story += [
            *letter_header,
            NextPageTemplate('normal'),
            Spacer(self.width, 1 * cm),
            msg,
            Spacer(self.width, 1.5 * cm),
            # engineer,
            PageBreak()]

    def create_letter_two(self):
        pass

    def create_pred(self):
        pass
