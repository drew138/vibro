import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    type: "groupHeader",
    groupTitle: "Servicios"
  },
  {
    id: "Predictivo ",
    title: "Predictivo ",
    type: "collapse",
    icon: <Icon.Activity size={20}/>,
    permissions: ["admin", "editor"],
    children: []
    // navLink: "/services/engineering",
    
  },
  {
    id: "Correctivo",
    title: "Correctivo",
    type: "collapse",
    icon: <Icon.Tool size={20}/>,
    permissions: ["admin", "editor"],
    children: []
    // navLink: "/services/corrective",
    
  },
  {
    id: "Ingeniería ",
    title: "Ingeniería ",
    type: "collapse",
    icon: <Icon.Compass size={20}/>,
    permissions: ["admin", "editor"],
    children: []
    // navLink: "/services/engineering",
    
  },
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
    ]
    // navLink: "/services/monitoring",
    
  },
  {
    type: "groupHeader",
    groupTitle: "Configuracion"
  },
  {
    id: "users",
    title: "User",
    type: "collapse",
    icon: <Icon.User size={20} />,
    children: [
      {
        id: "list",
        title: "List",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/user/list"
      },
      {
        id: "view",
        title: "Perfil",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/user/view"
      },
      {
        id: "edit",
        title: "Edit",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/app/user/edit"
      }
    ]
  },
  
]
// https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/development/menu/vertical-menu
export default navigationConfig
