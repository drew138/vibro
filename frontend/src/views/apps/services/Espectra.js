import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"


class ApexLineCharts extends React.Component {
  state = {

    optionsVel: {
      chart: {
        id: "lineChart"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        title: {
          text: 'Velocidad mm/s PK',
          offsetY: 10
        },
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      dataLabels: {
        enabled: false
      },
      colors: this.props.themeColors,
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      }
    },
    optionsAcc: {
      chart: {
        id: "lineChart"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        title: {
          text: 'Aceleración g\'s RMS',
          offsetY: 10
        },
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      dataLabels: {
        enabled: false
      },
      colors: this.props.themeColors,
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      }
    },
    optionsHeat: {
      chart: {
        id: "lineChart"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        title: {
          text: 'Temperatura °C',
          offsetY: 10
        },
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      dataLabels: {
        enabled: false
      },
      colors: this.props.themeColors,
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      }
    },
    seriesOne: [
      {
        name: "line-series",
        data: [[Date.parse('01/05/2021 10:51:50'), 14],
        [Date.parse('09/30/2020 10:07:10'), 5],
        [Date.parse('07/01/2020 9:43:55'), 23],
        [Date.parse('05/11/2020 23:26:34'), 10],
        [Date.parse('04/28/2020 11:14:06'), 12],
        [Date.parse('01/07/2020 10:10:43'), 39],
        [Date.parse('10/01/2019 11:44:30'), 34],
        [Date.parse('09/04/2019 14:50:09'), 19],
        [Date.parse('09/02/2019 17:39:56'), 33],
        [Date.parse('09/02/2019 0:18:01'), 27],
        [Date.parse('08/28/2019 15:19:27'), 20],
        [Date.parse('08/23/2019 15:16:52'), 41],
        [Date.parse('08/23/2019 15:14:23'), 14],
        [Date.parse('08/22/2019 16:52:41'), 46],
        [Date.parse('08/22/2019 16:52:07'), 45],
        [Date.parse('08/22/2019 12:49:55'), 33],
        [Date.parse('08/21/2019 23:54:47'), 27],
        [Date.parse('08/21/2019 23:47:36'), 12],
        [Date.parse('08/21/2019 22:56:03'), 48],
        [Date.parse('08/03/2019 8:44:18'), 11],
        [Date.parse('07/09/2019 8:22:05'), 9],
        [Date.parse('07/03/2019 11:46:25'), 4],
        [Date.parse('06/26/2019 9:46:24'), 19],
        [Date.parse('04/03/2019 12:02:04'), 14],
        [Date.parse('01/14/2019 11:25:40'), 16],
        [Date.parse('12/04/2018 16:39:35'), 7],
        [Date.parse('10/08/2018 10:29:54'), 11],
        [Date.parse('10/01/2018 12:17:28'), 62],
        [Date.parse('07/02/2018 19:38:49'), 12],
        [Date.parse('04/02/2018 11:14:48'), 7],
        [Date.parse('11/18/2017 13:34:47'), 7],
        [Date.parse('11/18/2017 12:44:09'), 6],
        [Date.parse('10/02/2017 12:33:15'), 8],
        [Date.parse('09/05/2017 13:50:13'), 5],
        [Date.parse('07/31/2017 21:46:33'), 14]]
      },
    ],
    seriesTwo: [
      {
        name: "line-series",
        data: [{ 'x': '01/05/2021 10:51:54', 'y': 2 },
        { 'x': '09/30/2020 10:07:13', 'y': 1 },
        { 'x': '07/01/2020 9:43:59', 'y': 1 },
        { 'x': '05/11/2020 23:26:39', 'y': 2 },
        { 'x': '04/28/2020 11:14:09', 'y': 1 },
        { 'x': '01/07/2020 10:10:46', 'y': 3 },
        { 'x': '10/01/2019 11:44:32', 'y': 2 },
        { 'x': '09/04/2019 14:50:11', 'y': 1 },
        { 'x': '09/02/2019 17:39:58', 'y': 3 },
        { 'x': '09/02/2019 0:18:05', 'y': 1 },
        { 'x': '08/28/2019 15:19:33', 'y': 4 },
        { 'x': '08/23/2019 15:16:55', 'y': 5 },
        { 'x': '08/23/2019 15:14:26', 'y': 4 },
        { 'x': '08/22/2019 16:52:45', 'y': 4 },
        { 'x': '08/22/2019 16:52:11', 'y': 4 },
        { 'x': '08/22/2019 12:49:59', 'y': 5 },
        { 'x': '08/21/2019 23:54:53', 'y': 3 },
        { 'x': '08/21/2019 23:47:45', 'y': 4 },
        { 'x': '08/21/2019 22:56:10', 'y': 5 },
        { 'x': '08/03/2019 8:44:20', 'y': 3 },
        { 'x': '07/09/2019 8:22:13', 'y': 3 },
        { 'x': '07/03/2019 11:46:27', 'y': 3 },
        { 'x': '06/26/2019 9:46:26', 'y': 3 },
        { 'x': '04/03/2019 12:02:07', 'y': 2 },
        { 'x': '01/14/2019 11:25:44', 'y': 2 },
        { 'x': '12/04/2018 16:39:40', 'y': 4 },
        { 'x': '10/08/2018 10:29:59', 'y': 1 },
        { 'x': '10/01/2018 12:17:30', 'y': 3 },
        { 'x': '07/02/2018 19:38:52', 'y': 3 },
        { 'x': '04/02/2018 11:14:54', 'y': 1 },
        { 'x': '11/18/2017 13:34:50', 'y': 2 },
        { 'x': '11/18/2017 12:44:12', 'y': 2 },
        { 'x': '10/02/2017 12:33:20', 'y': 1 },
        { 'x': '09/05/2017 13:50:16', 'y': 1 },
        { 'x': '07/31/2017 21:43:35', 'y': 1 }]
      },
    ]
  }

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Molino"
          breadCrumbParent="Empresa"
          breadCrumbActive="Producción"
        />
        <Card>
          <CardHeader>
            <CardTitle>Molino</CardTitle>
          </CardHeader>
          <CardBody>
            <div>
              <ReactApexChart
                options={this.state.optionsVel}
                series={this.state.seriesOne}
                type="line"
                height={350}
              />
            </div>
            <div>
              <ReactApexChart
                options={this.state.optionsAcc}
                series={this.state.seriesTwo}
                type="line"
                height={350}
              />
            </div>
            <div>
              <ReactApexChart
                options={this.state.optionsHeat}
                series={this.state.seriesTwo}

                type="line"
                height={350}
              />
            </div>
          </CardBody>
        </Card>
      </React.Fragment>
    )
  }
}
export default ApexLineCharts
