from backend.models import Measurement, Machine, Point, Values
import pandas as pd
import csv


class Writer:
    def __init__(self, engineer_one, engineer_two, measurement_type, service, date, hierarchy, notes, overall, spectra, time_signal):

        self.engineer_one = engineer_one
        self.engineer_two = engineer_two
        self.measurement_type = measurement_type
        self.service = service
        self.date = date
        self.hierarchy = pd.read_csv(hierarchy, sep=";", encoding="latin-1")
        self.notes = pd.read_csv(notes, sep=";", encoding="latin-1")
        self.overall = pd.read_csv(overall, sep=";", encoding="latin-1")
        self.spectra = spectra
        self.time_signal = time_signal

    def get_machines(self):

        identifiers = self.hierarchy[
            self.hierarchy["Tipo"] == "Máq.\t"
        ]["Ruta"].values
        for identifier in identifiers:
            yield identifier, Machine.objects.filter(identifier=identifier).first()

    def _parse_point_name(self, name):
        i = 0
        while name[i].isnumeric() and i < len(name):
            i += 1
        position = int(name[:i])
        direction = name[i].upper()
        point_type = name[i+1].upper()
        return position, direction, point_type

    def get_machine_points(self, identifier):

        points = self.hierarchy[
            [
                route.startswith(identifier) for route in self.hierarchy["Ruta"]
            ]
        ]
        points = points[points["Tipo"] == "PUNTO"]
        for _, row in points.iterrows():
            position, direction, point_type = self._parse_point_name(
                row["Nombre"].replace(" ", ""))
            point = Point.objects.filter(
                position=position,
                direction=direction,
                point_type=point_type,
                machine__identifier=identifier
            ).first()
            route = row["Ruta"]
            units = row["Unidad"]
            yield route, point, units

    def get_measurement_note(self, identifier):
        note = self.notes[self.notes["Ruta de datos"] == identifier]["Nota"]
        if not note:
            return ""
        return note[0]

    def get_overall(self, point_identifier):
        row = self.overall[
            self.overall["Ruta de punto"] == point_identifier].head(1)
        if len(row) < 1:
            return None, None
        row = row.iloc(0)
        date = row["DTS"]
        value = row["Valor"]
        return date, float(value)

    def get_spectra(self, point_identifier):
        with open(self.spectra, "r", encoding="latin-1") as file:
            reader = csv.reader(file)
            for line in reader:
                if line[0].startswith(point_identifier):
                    return line[1], [float(val) for val in line[12:]]

    def get_time_signal(self, point_identifier):
        with open(self.time_signal, "r", encoding="latin-1") as file:
            reader = csv.reader(file)
            for line in reader:
                if line[0].startswith(point_identifier):
                    return line[1], [float(val) for val in line[10:]]

    def write(self):
        for identifier, machine in self.get_machines():
            analysis, diagnostic, prev_changes, severity = self.get_measurement_note(
                identifier)
            measurement = Measurement.objects.create(
                service=self.service,
                measurement_type=self.measurement_type,
                date=self.date,
                engineer_one=self.engineer_one,
                engineer_two=self.engineer_two,
                machine=machine,
                analysis=analysis,
                diagnostic=diagnostic,
                prev_changes=prev_changes,
                severity=severity,
            )

            for route, point, units in self.get_machine_points(identifier):
                overall_date, overall = self.get_overall(route)
                spectra_date, spectra = self.get_spectra(route)
                time_signal_date, time_signal = self.get_time_signal(route)
                Values.objects.create(
                    point=point,
                    measurement=measurement,
                    overall=overall,
                    spectra=spectra,
                    time_signal=time_signal,
                )
