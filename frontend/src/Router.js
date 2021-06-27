import React, { Suspense, lazy } from "react"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"
import localStorageService from "./axios/localStorageService"
import { requestInterceptor, responseInterceptor } from "./axios/axiosInstance"

console.log(requestInterceptor, responseInterceptor)

console.log("breadcrumbs have breacrumbparent2 and breadcrumbparent3 props")

const typography = lazy(() =>
  import("./views/ui-elements/typography/Typography")
)
const textutilities = lazy(() =>
  import("./views/ui-elements/text-utilities/TextUtilities")
)

const basicCards = lazy(() => import("./views/ui-elements/cards/basic/Cards"))
const statisticsCards = lazy(() =>
  import("./views/ui-elements/cards/statistics/StatisticsCards")
)
const analyticsCards = lazy(() =>
  import("./views/ui-elements/cards/analytics/Analytics")
)
const actionCards = lazy(() =>
  import("./views/ui-elements/cards/actions/CardActions")
)
const Alerts = lazy(() => import("./components/reactstrap/alerts/Alerts"))

const Collapse = lazy(() => import("./components/reactstrap/collapse/Collapse"))

const Modals = lazy(() => import("./components/reactstrap/modal/Modal"))
const Pagination = lazy(() =>
  import("./components/reactstrap/pagination/Pagination")
)

const Navbar = lazy(() => import("./components/reactstrap/navbar/Navbar"))

const BadgePill = lazy(() =>
  import("./components/reactstrap/badgePills/BadgePill")
)

const AutoComplete = lazy(() =>
  import("./components/@vuexy/autoComplete/AutoComplete")
)

const select = lazy(() => import("./views/forms/form-elements/select/Select"))
const switchComponent = lazy(() =>
  import("./views/forms/form-elements/switch/Switch")
)

const input = lazy(() => import("./views/forms/form-elements/input/Input"))

const textarea = lazy(() =>
  import("./views/forms/form-elements/textarea/Textarea")
)
const pickers = lazy(() =>
  import("./views/forms/form-elements/datepicker/Pickers")
)
const inputMask = lazy(() =>
  import("./views/forms/form-elements/input-mask/InputMask")
)

const tables = lazy(() => import("./views/tables/reactstrap/Tables"))
const ReactTables = lazy(() =>
  import("./views/tables/react-tables/ReactTables")
)
const Aggrid = lazy(() => import("./views/tables/aggrid/Aggrid"))
const DataTable = lazy(() => import("./views/tables/data-tables/DataTables"))


const accountSettings = lazy(() =>
  import("./views/apps/auth/AccountSettings")
)
const error404 = lazy(() => import("./views/pages/misc/error/404"))
const error500 = lazy(() => import("./views/pages/misc/error/500"))
const authorized = lazy(() => import("./views/pages/misc/NotAuthorized"))
const maintenance = lazy(() => import("./views/pages/misc/Maintenance"))
const apex = lazy(() => import("./views/charts/apex/ApexCharts"))
const chartjs = lazy(() => import("./views/charts/chart-js/ChartJS"))
const extreme = lazy(() => import("./views/charts/recharts/Recharts"))
const toastr = lazy(() => import("./extensions/toastify/Toastify"))
const sweetAlert = lazy(() => import("./extensions/sweet-alert/SweetAlert"))

const reactPaginate = lazy(() => import("./extensions/pagination/Pagination"))




const userList = lazy(() => import("./views/apps/user/List"))
const Login = lazy(() => import("./views/pages/authentication/login/Login"))
const forgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
)
const lockScreen = lazy(() => import("./views/pages/authentication/LockScreen"))
const resetPassword = lazy(() =>
  import("./views/pages/authentication/ResetPassword")
)
const register = lazy(() =>
  import("./views/pages/authentication/register/Register")
)
const home = lazy(() => import("./views/apps/home/Home"))
const espectra = lazy(() => import("./views/apps/services/Espectra"))
const upload = lazy(() => import("./views/apps/services/Upload"))
// const wform = lazy(() => import("./views/apps/services/WizardForm"))
const llist = lazy(() => import("./views/apps/services/monitoring/List"))
const companies = lazy(() => import("./views/apps/company/list/CompaniesList"))
const hierarchies = lazy(() => import("./views/apps/company/list/HierarchiesList"))
const userEdit = lazy(() => import("./views/apps/user/Edit"))
const companyEdit = lazy(() => import("./views/apps/company/edit/CompanyEdit"))
const companyAdd = lazy(() => import("./views/apps/company/add/Add"))
const machineEdit = lazy(() => import("./views/apps/machines/edit"))
const hierarchyEdit = lazy(() => import("./views/apps/company/edit/HierarchyEdit"))
const measurementList = lazy(() => import("./views/apps/measurements/MeasurementsList"))
const measurementsAdd = lazy(() => import("./views/apps/measurements/MeasurementsAdd"))
const measurementEdit = lazy(() => import("./views/apps/measurements/MeasurementEdit"))
const measurementAdd = lazy(() => import("./views/apps/measurements/MeasurementAdd"))
const measurementView = lazy(() => import("./views/apps/measurements/MeasurementView"))
const measurementFlawList = lazy(() => import("./views/apps/measurements/MeasurementsFlawList"))

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                  ? context.horizontalLayout
                  : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={props.permissions}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)
const mapStateToProps = state => {
  return {
    permissions: state.auth.user_type,
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

const PrivateRouteConfig = ({ component: Component, fullLayout, ...rest }) => {

  const accessToken = localStorageService.getAccessToken();

  if (!accessToken) {
    return <Redirect to="/pages/login" />
  }
  return (<Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                  ? context.horizontalLayout
                  : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={props.permissions}>
                <Suspense fallback={<Spinner />}>
                  {<Component {...props} />}
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
  )
}

const PrivateAppRoute = connect(mapStateToProps)(PrivateRouteConfig)




class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <PrivateAppRoute exact path="/" component={home} />


          <AppRoute exact path="/services/monitoring/machine" component={espectra} />
          <AppRoute exact path="/measurements/upload" component={upload} />
          <AppRoute exact path="/services/monitoring/list" component={llist} />

          <AppRoute exact path="/app/companies/hierarchies" component={hierarchies} />
          <AppRoute exact path="/app/companies/list" component={companies} />
          <AppRoute exact path="/app/companies/list/edit" component={companyEdit} />
          <AppRoute exact path="/app/companies/add" component={companyAdd} />




          <AppRoute exact path="/app/user/list" component={userList} />
          <AppRoute exact path="/app/user/list/edit" component={userEdit} />
          <PrivateAppRoute
            exact
            path="/app/user/settings"
            component={accountSettings}
          />
          <AppRoute
            exact
            path="/app/machine/edit"
            component={machineEdit}
          />
          <AppRoute
            exact
            path="/app/companies/hierarchy/edit"
            component={hierarchyEdit}
          />
          <AppRoute
            exact
            path="/app/measurement/list"
            component={measurementList}
          />
          <AppRoute
            exact
            path="/app/measurements/add"
            component={measurementsAdd}
          />
          <AppRoute
            exact
            path="/app/measurement/add"
            component={measurementAdd}
          />
          <AppRoute
            exact
            path="/app/measurement/edit"
            component={measurementEdit}
          />
          <AppRoute
            exact
            path="/app/measurement/view"
            component={measurementView}
          />
          <AppRoute
            exact
            path="/app/measurement/flaws"
            component={measurementFlawList}
          />



          <AppRoute path="/charts/chartjs" component={chartjs} />
          <AppRoute path="/ui-element/typography" component={typography} />


          <AppRoute
            path="/ui-element/textutilities"
            component={textutilities}
          />
          <AppRoute path="/cards/basic" component={basicCards} />
          <AppRoute path="/cards/statistics" component={statisticsCards} />
          <AppRoute path="/cards/analytics" component={analyticsCards} />
          <AppRoute path="/cards/action" component={actionCards} />
          <AppRoute path="/components/alerts" component={Alerts} />
          <AppRoute path="/components/collapse" component={Collapse} />
          <AppRoute path="/components/modals" component={Modals} />
          <AppRoute path="/components/pagination" component={Pagination} />
          <AppRoute path="/components/navbar" component={Navbar} />
          <AppRoute path="/components/pill-badges" component={BadgePill} />
          <AppRoute path="/forms/elements/select" component={select} /> {/* TODO check these to implement in various selects */}
          <AppRoute path="/forms/elements/switch" component={switchComponent} /> {/* TODO use toogle for revised state in measurements*/}

          <AppRoute path="/forms/elements/input" component={input} /> {/* TODO check these selects to implement input files */}
          <AppRoute path="/forms/elements/textarea" component={textarea} /> {/* TODO check these selects to implement analysis and rec */}
          <AppRoute path="/forms/elements/pickers" component={pickers} /> {/* TODO check these selects to implement dates pickers */}
          <AppRoute path="/forms/elements/input-mask" component={inputMask} /> {/* TODO check these selects to implement input phone numbers */}
          <AppRoute path="/tables/reactstrap" component={tables} />
          <AppRoute path="/tables/react-tables" component={ReactTables} /> {/* TODO check these selects to implement search lists */}
          <AppRoute path="/tables/agGrid" component={Aggrid} />
          <AppRoute path="/tables/data-tables" component={DataTable} />
          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute path="/pages/login" component={Login} fullLayout />
          <AppRoute path="/pages/register" component={register} fullLayout />
          <AppRoute
            path="/pages/forgot-password"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/lock-screen"
            component={lockScreen}
            fullLayout
          />{/* maybe remove?*/}
          <AppRoute
            path="/pages/reset-password"
            component={resetPassword}
            fullLayout
          />
          <AppRoute path="/misc/error/500" component={error500} fullLayout />
          <AppRoute
            path="/misc/not-authorized"
            component={authorized}
            fullLayout
          />
          <AppRoute
            path="/misc/maintenance"
            component={maintenance}
            fullLayout
          />
          <AppRoute path="/charts/apex" component={apex} />
          <AppRoute path="/charts/recharts" component={extreme} />
          <AppRoute path="/extensions/sweet-alert" component={sweetAlert} />
          <AppRoute path="/extensions/toastr" component={toastr} />
          <AppRoute path="/extensions/pagination" component={reactPaginate} />

          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
