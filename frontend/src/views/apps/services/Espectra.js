import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import ReactApexChart  from "react-apexcharts"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"


class ApexLineCharts extends React.Component {
  state = {
    
    optionsVel: {
      chart: {
        id: "lineChart"
      },
      xaxis: {
        categories: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
        ]
      },
      yaxis: {
        title: {
          text: 'Velocidad mm/s PK',
          offsetY: 10
        },
      },
      legend : {
        position: "right",
        offsetY: 40
      },
      stroke: {
        curve: "straight"
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
        categories: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
        ]
      },
      yaxis: {
        title: {
          text: 'Aceleración g\'s RMS',
          offsetY: 10
        },
      },
      legend : {
        position: "right",
        offsetY: 40
      },
      stroke: {
        curve: "straight"
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
        categories: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ]
      },
      yaxis: {
        title: {
          text: 'Temperatura °C',
          offsetY: 10
        },
      },
      legend : {
        position: "right",
        offsetY: 40
      },
      stroke: {
        curve: "straight"
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
        data: [14,  5, 23, 10, 12, 39, 34, 19, 33, 27, 20, 41, 14, 46, 45, 33, 27,
          12, 48, 11,  9,  4, 19, 14, 16,  7, 11, 62, 12,  7,  7,  6,  8,  5,
          14]
      },
    ],
    seriesTwo: [
      {
        name: "line-series",
        data: [2, 1, 1, 2, 1, 3, 2, 1, 3, 1, 4, 5, 4, 4, 4, 5, 3, 4, 5, 3, 3, 3,
          3, 2, 2, 4, 1, 3, 3, 1, 2, 2, 1, 1, 1]
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
