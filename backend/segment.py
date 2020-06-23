from reportlab.platypus import Paragraph, NextPageTemplate, Spacer, PageBreak
from reportlab.lib.units import cm
from .flowables import STANDARD, BLACK_BOLD_CENTER
from .graph import Graphs


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

        letter_header = self.create_letter_header()
        # TODO msg string needs editting
        msg = Paragraph(f"""
            Cordial saludo;<br/><br/> 
            Adjuntamos informes de mantenimiento
            predictivo e informe administrativo,
            por correo electrónico, de los equipos 
            de planta, medidos en {self.date} del año
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
        engineer = self.create_signatures_table()
        self.story += [
            *letter_header,
            # NextPageTemplate('normal'),
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
        msg_one = Paragraph("""
        REF.  Explicación Configuración Predictivo.<br/><br/>
        Cordial saludo:<br/><br/><br/>A continuación les 
        entregamos una pequeña explicación de cómo funciona 
        la configuración del predictivo.<br/><br/>
        1. En cada uno de los diagramas esquemáticos 
        de los equipos se especifica claramente el lugar 
        de medición, el número que le corresponde y el tipo 
        de medición a realizar.<br/><br/>2. Orden de la medición 
        por equipo:<br/><br/>El orden de medición por equipo 
        está estandarizado y se inicia desde la potencia hacia 
        delante, es decir, el punto 1 siempre será el rodamiento 
        motor lado libre, el punto dos (2) siempre será el 
        rodamiento motor lado transmisión y así avanza hacía el 
        equipo hasta terminar los puntos de medición.</l></En>
        <br/><br/>Ejemplo:
        """, style=STANDARD)

        diagram_one = None

        msg_two = Paragraph('something', style=STANDARD)

        diagram_two = None

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
        En resumen:<br/><br/>1 H V =  Rodamiento motor lado libre, medida 
        horizontal en velocidad. <font name="Arial-Bold">Con respecto a las 
        unidades de  Vibración:</font> En la tabla de valores se expresa sus 
        niveles globales de vibración, en mms/s pico, para la variable velocidad, 
        siendo necesario multiplicar por 0.707 dicho valor, si se requiere 
        conocer su amplitud en mms/s rms, como lo expresa la Norma ISO 10816-1.<br/> 
        Medir en unidades pico (P.k) permite identificar con más claridad en el 
        espectro, condiciones de los componentes de máquina que operan 
        a baja velocidad.""", style=STANDARD)

        header = Paragraph(
            '<u>Tabla N. 1.</u> Rangos de severidad vibratoria para máquinas ISO 10816-1. ', 
            style=BLACK_BOLD_CENTER)

        table = None

        title_one = Paragraph(
            '<u>TIPO DE MÁQUINAS (entre 10 y 200 rev/s)</u>',
            style=BLACK_BOLD_CENTER)

        especifications_one = None

        title_two = Paragraph(
            '<u>CALIDAD DE LA VIBRACIÓN</u>',
            style=BLACK_BOLD_CENTER)

        especifications_two = None

        self.story += [
            *letter_header,
            NextPageTemplate('measurement_two'),
            Spacer(self.width, 1 * cm),
            msg_one,
            # diagram_one,
            PageBreak(),
            msg_two,
            NextPageTemplate('measurement'),
            Spacer(self.width, 1 * cm),
            # diagram_two,
            Spacer(self.width, 1 * cm),
            msg_three,
            PageBreak(),
            header,
            Spacer(self.width, 1 * cm),
            # table,
            Spacer(self.width, 1 * cm),
            title_one,
            Spacer(self.width, 1 * cm),
            # especifications_one,
            Spacer(self.width, 1 * cm),
            title_two,
            Spacer(self.width, 1 * cm),
            # especifications_two,

        ]

    def create_pred(self, query_instance):
        especifications = self.machine_specifications_table()
        diagram = self.pictures_table(
            query_instance.machine.images.diagram,
            query_instance.machine.images.image)
        title = self.create_table_title()

        # TODO add logic to create table and graphs
        ###############

        ##############

        analysis = self._create_analysis_table(
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
