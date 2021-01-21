import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    type: "groupHeader",
    groupTitle: "Servicios"
  },
  // {
  //   id: "Predictivo ",
  //   title: "Predictivo ",
  //   type: "collapse",
  //   icon: <Icon.Activity size={20}/>,
  //   permissions: ["admin", "editor"],
  //   children: []
  //   // navLink: "/services/engineering",
    
  // },
  // {
  //   id: "Correctivo",
  //   title: "Correctivo",
  //   type: "collapse",
  //   icon: <Icon.Tool size={20}/>,
  //   permissions: ["admin", "editor"],
  //   children: []
  //   // navLink: "/services/corrective",
    
  // },
  // {
  //   id: "Ingeniería ",
  //   title: "Ingeniería ",
  //   type: "collapse",
  //   icon: <Icon.Compass size={20}/>,
  //   permissions: ["admin", "editor"],
  //   children: []
  //   // navLink: "/services/engineering",
    
  // },
  {
    id: "Monitoreo",
    title: "Monitoreo",
    type: "collapse",
    icon: <Icon.Wifi size={20}/>,
    permissions: ["admin", "editor"],
    children: [
      {
        id: "list-monitoring",
        title: "Lista",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/services/monitoring/list"
      },
      {
        id: "list-monitoring",
        title: "Máquina",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/services/monitoring/machine"
      },
    ]
    // navLink: "/services/monitoring",
    
  },
  {
    type: "groupHeader",
    groupTitle: "Configuracion"
  },
  {
    id: "users",
    title: "Usuario",
    type: "collapse",
    icon: <Icon.User size={20} />,
    children: [
      {
        id: "list-users",
        title: "Lista",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/user/list"
      },
      {
        id: "edit-users",
        title: "Cuenta",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/user/settings"
      }
    ]
  },
  {
    id: "companies",
    title: "Empresas",
    type: "collapse",
    icon: <Icon.Briefcase size={20} />,
    permissions: ["admin", "support", "engineer"],
    children: [
      {
        id: "list-companies",
        title: "Lista",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/companies/list"
      },
      
      {
        id: "add-companies",
        title: "Agregar",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/companies/add"
      }
    ]
  }
]
// https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/development/menu/vertical-menu
export default navigationConfig
