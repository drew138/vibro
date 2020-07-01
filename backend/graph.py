from reportlab.lib.colors import black, Color
from .flowables import Flowables, TABLE_BLUE
from reportlab.platypus.tables import Table
from reportlab.platypus import TableStyle
from .import models as custom_models
import matplotlib.dates as mpl_dates
from reportlab.lib.units import cm
import matplotlib.pyplot as plt
from io import BytesIO
import datetime


class Graphs(Flowables):

    """
    create graphs to be used in the document.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.buffers = []
        self.custom_colors = [
            # colors used in graphs
            '#0000FF',
            '#FF0000',
            '#006600',
            '#ff66cc',
            '#00ff00',
            '#ffff00',
            '#660066',
            '#00ffff',
            '#F39C12',
            '#148F77',
            '#C0392B',
            '#0E6251'
        ]

    def retrieve_measurements(self, query_instance):
        """
        retrieve queryset of all 'pred'
        measurements for a given machiine
        ordered by date.
        """

        return custom_models.Measurement.objects.filter(
            machine=query_instance.machine,
            measurement_type='pred').order_by('date__date')

    def format_table_data(self, measurements, title):
        """
        abstract data from measurements models
        generators and format it to be consumed
        by create_table_graph method.

        Returns two list. A 2d lists containing
        all the rows used in the table and a row
        containing the headers of the rows.
        """

        # TODO check if its only V and A
        points = ((measurement.points.filter(point_type__in=['A', 'V']),
                   measurement.date.date.strftime('%d/%m/%Y')) for measurement in measurements[:2])
        data = {'dates': []}
        keys = set()
        for point_generator, date in points:
            data['dates'].append(date)
            for point in point_generator:
                key = f'{point.number}{point.position}{point.point_type}'
                if key in keys:
                    data[key][date] = point.tendency.value
                else:
                    data[key] = {date: point.tendency.value}
                    keys.add(key)

        try:
            previous_date = data['dates'][1]
        except IndexError:
            previous_date = 'N/A'
        current_date = data['dates'][0]
        rows = [[title, '', '', '', ''],
                [
            self.create_graph_table_title('Nombre de<br/>PUNTO'),
            self.create_graph_table_title('Unidades'),
            self.create_graph_table_title(
                f'Valor Anterior<br/>{previous_date}'),
            self.create_graph_table_title(f'Últ. Valor<br/>{current_date}'),
            self.create_graph_table_title('% de Cambio')
        ]]
        # format data dictionary to 2d list rows
        for key in data.keys():
            if key != 'dates':
                if key.endswith('V'):
                    units = 'mm/s'
                else:
                    units = 'g'
                try:
                    previous_value = data[key][previous_date]
                except KeyError:
                    previous_value = '--'
                try:
                    current_value = data[key][current_date]
                except KeyError:
                    current_value = '--'
                if (previous_value == '--') or (current_value == '--'):
                    change = 'N/A'
                else:
                    percentage = (current_value - previous_value) * \
                        100 / previous_value
                    change = round(percentage, 2)
                row = [
                    key,
                    units,
                    previous_value,
                    current_value,
                    change
                ]
                rows.append(row)
        return rows

    def create_row_colors(self, rows):
        """
        create 2d list containing
        colors for each row in table.
        """

        colors = []
        for index, _ in enumerate(rows):
            if index < 2:
                continue
            elif index % 2:
                colors.append(
                    ('BACKGROUND',
                     (0, index),
                     (4, index),
                     Color(
                         red=220/255,
                         green=230/255,
                         blue=241)
                     )
                )
        return colors

    def create_table_graph(self, query_instance):
        """
        create table graph for used
        in add_graphs method.

        Returns an image in bytes format.
        """

        measurements = self.retrieve_measurements(query_instance)
        # TODO confirm title
        title = f'{query_instance.machine.machine_type} {query_instance.machine.name}'.upper()
        rows = self.format_table_data(measurements, title)

        styles = [
            ('SPAN', (0, 0), (-1, 0)),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BACKGROUND', (0, 0), (4, 1), TABLE_BLUE),
            ('GRID', (0, 0), (-1, -1), 0.25, black),
            ('FONTNAME', (0, 0), (0, -1), 'Arial-Bold'),
            ('FONTNAME', (0, 0), (4, 1), 'Arial-Bold'),
            ('FONTNAME', (1, 0), (-1, -1), 'Arial'),
        ]
        colors = self.create_row_colors(rows)
        styles += colors
        table = Table(rows, colWidths=[3 * cm])
        table.setStyle(TableStyle(styles))
        return table

    def format_tendency_data(self, measurements, position):
        """
        abstract data from measurements models
        generators and format it to be consumed
        by create_tendency_graph method.

        Returns a dictionary populated with data
        in the format:

        {key: {values: [v1..vn], dates: [d1..dn]}}
        """

        points = ((measurement.points.filter(position=position),
                   measurement.date.date) for measurement in measurements[:10])
        data = {}
        keys = set()
        for point_generator, date in points:
            for point in point_generator:
                key = f'{point.number}{point.position}{point.point_type}'
                if key in keys:
                    data[key]['values'].append(point.tendency.value)
                    data[key]['dates'].append(date)
                else:
                    data[key] = {
                        'values': [point.tendency.value],
                        'dates': [date]
                    }
                    keys.add(key)
        return data

    def create_tendency_graph(self, query_instance, position):
        """
        create chart graph of tendency
        values for vel or acc.

        Returns an image in bytes format.
        """

        measurements = self.retrieve_measurements(query_instance)
        data = self.format_tendency_data(measurements, position)

        _, ax = plt.subplots(figsize=(10, 3.5))
        for index, key in enumerate(data.keys()):
            ax.plot_date(
                data[key]['dates'],
                data[key]['values'],
                linestyle='solid',
                label=key,
                color=self.custom_colors[index],
                marker='.')

        if position == 'V':
            units = 'mm/s - Pico'
        else:
            units = 'g - RMS'

        date_format = mpl_dates.DateFormatter('%d/%m/%Y')
        # TODO title needs review
        ax.set_title(
            f"""Tendencia\n{query_instance.machine.machine_type}
            {query_instance.machine.name}, Canal X""")
        ax.xaxis.set_major_formatter(date_format)  # set format to x  axis
        ax.xaxis_date()
        ax.set_xlabel('Fecha', labelpad=5)
        ax.set_ylabel(units)
        ax.legend(
            loc='center left',
            bbox_to_anchor=(1, 0.5),
            fancybox=True,
            shadow=True, ncol=1)
        ax.set_ylim(bottom=0)
        plt.style.use('seaborn-ticks')
        plt.grid(True)
        plt.tight_layout()
        buff = BytesIO()
        plt.savefig(
            buff,
            bbox_inches="tight",
            transparent=True,
            dpi=300,
            format='jpg'
        )
        buff.seek(0)
        self.buffers.append(buff)
        return buff

    def create_time_signal_graph(self, query_instance, position):
        """
        create graph containing time signal
        of a point for an specific measurement
        and point.

        Returns an image in bytes format.
        """

        label = None
        time = None
        values = None

        if position == 'V':
            units = 'mm/s - Pico'
        else:
            units = 'g - RMS'

        _, ax = plt.subplots(figsize=(10, 3.5))
        ax.plot_date(
            time,
            values,
            linestyle='solid',
            label=label,
            color=self.custom_colors[0],
            linewidth=0.6
        )

        date_format = mpl_dates.DateFormatter('%d/%m/%Y')
        # TODO review title
        ax.set_title(
            f"""Señal en el Tiempo\n{query_instance.machine.machine_type}
            {query_instance.machine.name}, Canal X""")
        ax.xaxis.set_major_formatter(date_format)  # set format to x  axis
        ax.set_xlabel('Fecha', labelpad=5)
        ax.set_ylabel(units)
        ax.legend(
            loc='center left',
            bbox_to_anchor=(1, 0.5),
            fancybox=True,
            shadow=True, ncol=1)

        plt.style.use('seaborn-ticks')
        plt.grid(True)
        plt.tight_layout()
        buff = BytesIO()
        plt.savefig(
            buff,
            bbox_inches="tight",
            transparent=True,
            dpi=300)
        buff.seek(0)
        self.buffers.append(buff)
        return buff

    # TODO
    def create_casc_graph(self, query_instance):
        """
        plot 3d figure of all spectra specified.

        Returns an image in bytes format.
        """

        from mpl_toolkits.mplot3d import Axes3D
        import numpy as np
        from matplotlib import rcParams

        df_spec = pd.read_csv('Export_Spectra.csv', delimiter=';',
                              encoding='ISO-8859-1')  # open csv to create a dataframe
        fig = plt.figure(figsize=(10, 5))
        ax = fig.add_subplot(111, projection='3d')
        z_ticks = []
        if point.upper().startswith(('AC', 'VE', 'EN')):
            _rows = []
            if point.upper().startswith('A'):
                df_spec = df_spec.loc[df_spec['Ruta de punto'].str.contains(
                    f'({title}).\d\d?[AVH][A]', regex=True)]
            elif point.upper().startswith('V'):
                df_spec = df_spec.loc[df_spec['Ruta de punto'].str.contains(
                    f'({title}).\d\d?[AVH][V]', regex=True)]
            elif point.upper().startswith('E'):
                df_spec = df_spec.loc[df_spec['Ruta de punto'].str.contains(
                    f'({title}).\d\d?[AVH][E]', regex=True)]
            for index, df_row in df_spec.iterrows():
                _date = datetime.datetime.strptime(
                    df_row['DTS'], '%d/%m/%Y %I:%M')
                if abs((_date - meas_date).days) < 7:
                    _rows.append(df_row)

        #         if len(_rows) > 10:
        #             _rows = _rows[:11]
            index = 2.0
            for _row in _rows:
                label = _row['Ruta de punto'].split('\\')[-1]
                # obtain data of the y axis for the figure
                y = (_row[f'Unnamed: {12 + x}']
                     for x in range(1, int(_row['Líneas'])))
                # replace commas for dots in the string
                y = (x.replace(',', '.') for x in y)
                y = [float(x) for x in y]  # convert strings to floats
                y = [float(_row['Datos	'])] + y  # concactenate lists

                x = np.arange(0, _row['Líneas'])

                z_ticks.append(index)

                ax.plot(x, y, zs=float(index), zdir='y',
                        label=label, linewidth=0.6)
                index += 2
                if index == 18:
                    break

            units = df_spec['Unidad'].values[0] + ' - ' + \
                df_spec['Detección'].values[0].rstrip('\t')

        else:
            df_spec = df_spec.loc[df_spec['Ruta de punto'].str.contains(
                f'({title}).({point})', regex=True)]

        # separate ticks labels from axis
        ax.tick_params(width=8, labelsize=8, pad=13)
        ax.set_xlabel('Frecuencia - Hz', labelpad=30,
                      rotation=90)  # set x axis label
        ax.set_ylabel('Fecha/Hora', labelpad=30,
                      rotation=90)  # set y axis label
        ax.set_zlabel(units, labelpad=30, rotation=90)  # set z axis label
        ax.set_title(f'Cascada\n{title}, Canal X')  # set title
        date_format = mpl_dates.DateFormatter(
            '%d/%m/%Y')  # stablish date format
        # set y axis tick labels format to be dates
        ax.yaxis.set_major_formatter(date_format)
        rcParams['axes.labelpad'] = 25  # distance of labels from ticks
        ax.legend(loc="upper left", bbox_to_anchor=(0.08, 1),
                  fancybox=True, shadow=True, ncol=1)  # specify params for legend
        plt.tight_layout()
        ax.set_yticks(z_ticks)
        ax.margins(0, 0, 0)
        ax.view_init(elev=70, azim=-90)

        plt.savefig('cascada', bbox_inches="tight", transparent=True, dpi=300)
