from .import models as custom_models
import matplotlib.dates as mpl_dates
from .flowables import Flowables
import matplotlib.pyplot as plt
from io import BytesIO
import datetime


class Graphs(Flowables):

    """
    create graphs to be used in the document.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.custom_colors = [
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

    def create_table_graph(self, engine_name, previous_date, current_date, data):
        """
        create table graph for word.
        """

        fig, ax = plt.subplots()
        columns = [
            '$\\bfNombre$ $\\bfde$ $\\bfPUNTO$',
            '$\\bfUnidades$',
            f'$\\bfValor$ $\\bfanterior$\n$\\bf{previous_date}$',
            f'$\\bfÚlt.$ $\\bfvalor$\n$\\bf{current_date}$',
            '$\\bf\%$ $\\bfcambio$'
        ]

        colors = []  # 2d list containing all lists of colors for each row
        # list comprehension to define blue color of first rows
        col_colors = ['#8DB3E2' for _ in range(len(columns))]
        col_widths = [0.3, 0.2, 0.25, 0.2, 0.2]
        for rows in data:  # define color of rows in table
            row_colors = []  # 2d list containing all colors for all rows
            # format first element in a row to be bold
            rows[0] = f'$\\bf{rows[0]}$'
            for _ in rows:  # iterate through every cell in each row
                if data.index(rows) % 2 == 0:  # if index is even set color to white
                    row_colors.append('#FFFFFF')
                else:  # if index is odd set color to blueish
                    row_colors.append('#DCE6F1')
            colors.append(row_colors)  # append list to colors list

        ax.axis('off')
        ax.axis('tight')
        table = ax.table(
            cellText=data,
            cellColours=colors,
            colWidths=col_widths,
            colColours=col_colors,
            colLabels=columns,
            loc='center',
            cellLoc='center')
        table.set_fontsize(10)
        table.scale(0.8, 1)  # stretch table horizontally
        cellDict = table.get_celld()  # dict of all cells in table
        for i in range(len(columns)):  # go through all cells in first column
            # change height to be able to adjust text
            cellDict[(0, i)].set_height(.1)
        fig.patch.set_visible(False)  # remove graph plot from figure
        fig.tight_layout()  # set tight_layout to adjust objects in figure
        plt.title(engine_name, y=1.1)
        buff = BytesIO()
        plt.savefig(
            buff,
            bbox_inches="tight",
            transparent=True,
            dpi=300)
        buff.seek(0)
        return buff

    def create_graph(self, query_instance, position):
        """
        create chart graph of tendency
        values for vel or acc.
        """

        measurements = custom_models.Measurement.objects.filter(
            machine=query_instance.machine).order_by('date__date')
        # TODO check date format
        points = ((measurement.points.filter(position=position),
                   measurement.date.date) for measurement in measurements)[:10]
        data = {}
        for point_generator, date in points:
            for point in point_generator:
                key = f'{point.number}{point.poisition}{point.point_type}'
                if key in data.keys():
                    data[key]['values'].append(point.tendency)
                    data[key]['dates'].append(date)
                else:
                    data[key] = {'values': [], 'dates': []}

        _, ax = plt.subplots(figsize=(17, 6))
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
        # TODO title needs review
        ax.set_title(
            f"""Tendencia\n{query_instance.machine.machine_type} 
            {query_instance.machine.name}, Canal X""")

        plt.style.use('seaborn-ticks')
        plt.grid(True)
        plt.tight_layout()  # adjust plot params
        date_format = mpl_dates.DateFormatter('%d/%m/%Y')
        ax.xaxis.set_major_formatter(date_format)  # set format to axis
        ax.set_xlabel('Fecha', labelpad=5)
        ax.set_ylabel(units)
        ax.legend(
            loc='center left',
            bbox_to_anchor=(1, 0.5),
            fancybox=True,
            shadow=True, ncol=1)
        buff = BytesIO()
        plt.savefig(
            buff,
            bbox_inches="tight",
            transparent=True,
            dpi=300)
        buff.seek(0)
        return buff
