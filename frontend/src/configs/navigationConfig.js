import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  // {
  //   id: "dashboard",
  //   title: "Dashboard",
  //   type: "collapse",
  //   icon: <Icon.Home size={20} />,
  //   badge: "warning",
  //   badgeText: "2",
  //   children: [
  //     {
  //       id: "analyticsDash",
  //       title: "Analytics",
  //       type: "item",
  //       icon: <Icon.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/"
  //     },
  //     {
  //       id: "eCommerceDash",
  //       title: "eCommerce",
  //       type: "item",
  //       icon: <Icon.Circle size={12} />,
  //       permissions: ["admin"],
  //       navLink: "/ecommerce-dashboard"
  //     }
  //   ]
  // },
  {
    type: "groupHeader",
    groupTitle: "APPS"
  },
  {
    id: "email",
    title: "Email",
    type: "item",
    icon: <Icon.Mail size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/email/:filter",
    filterBase: "/email/inbox"
  },
  {
    id: "chat",
    title: "Chat",
    type: "item",
    icon: <Icon.MessageSquare size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/chat"
  },
  {
    id: "todo",
    title: "Todo",
    type: "item",
    icon: <Icon.CheckSquare size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/todo/:filter",
    filterBase: "/todo/all"
  },
  {
    id: "calendar",
    title: "Calendar",
    type: "item",
    icon: <Icon.Calendar size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/calendar"
  },
  {
    id: "eCommerce",
    title: "Ecommerce",
    type: "collapse",
    icon: <Icon.ShoppingCart size={20} />,
    children: [
      {
        id: "shop",
        title: "Shop",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/ecommerce/shop"
      },
      {
        id: "detail",
        title: "Product Detail",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/ecommerce/product-detail"
      },
      {
        id: "wishList",
        title: "Wish List",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/ecommerce/wishlist"
      },
      {
        id: "checkout",
        title: "Checkout",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/ecommerce/checkout"
      }
    ]
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
        title: "View",
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