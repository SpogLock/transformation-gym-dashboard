// import
import Dashboard from "views/Dashboard/Dashboard";
import CustomerManagement from "views/Dashboard/CustomerManagement";
import InventoryManagement from "views/Dashboard/InventoryManagement";
import ProductProfile from "views/Dashboard/ProductProfile";
import Sales from "views/Dashboard/Sales";
import Invoices from "views/Dashboard/Invoices";
import InvoiceDetail from "views/Dashboard/InvoiceDetail";
import EmailMarketing from "views/Dashboard/EmailMarketing";
import Billing from "views/Dashboard/Billing";
import RTLPage from "views/Dashboard/RTL";
import Profile from "views/Dashboard/Profile";
import InProgress from "views/Dashboard/InProgress";
import SalesAnalytics from "views/Dashboard/SalesAnalytics";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import { SettingsIcon, ViewIcon, AttachmentIcon, CopyIcon, EmailIcon } from "@chakra-ui/icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/sales-analytics",
    name: "Sales & Analytics",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color="inherit" />,
    component: SalesAnalytics,
    layout: "/admin",
  },
  {
    path: "/customer-management",
    name: "Customer Management",
    rtlName: "لوحة القيادة",
    icon: <SettingsIcon color="inherit" />,
    component: CustomerManagement,
    layout: "/admin",
  },
  {
    path: "/inventory-management",
    name: "Inventory Management",
    rtlName: "لوحة القيادة",
    icon: <ViewIcon color="inherit" />,
    component: InventoryManagement,
    layout: "/admin",
  },
  {
    path: "/sales",
    name: "Point of Sale",
    rtlName: "لوحة القيادة",
    icon: <AttachmentIcon color="inherit" />,
    component: Sales,
    layout: "/admin",
  },
  {
    path: "/invoices",
    name: "Invoices & Orders",
    rtlName: "لوحة القيادة",
    icon: <CopyIcon color="inherit" />,
    component: Invoices,
    layout: "/admin",
  },
  {
    path: "/email-marketing",
    name: "Email Marketing",
    rtlName: "لوحة القيادة",
    icon: <EmailIcon color="inherit" />,
    component: EmailMarketing,
    layout: "/admin",
  },
  {
    path: "/expenses-cashflow",
    name: "Expenses & Cashflow",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
  },

  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/product-profile",
        name: "Product Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: ProductProfile,
        layout: "/admin",
      },
      {
        path: "/invoice-detail",
        name: "Invoice Detail",
        rtlName: "لوحة القيادة",
        icon: <CopyIcon color="inherit" />,
        secondaryNavbar: true,
        component: InvoiceDetail,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <CopyIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color="inherit" />,
        secondaryNavbar: true,
        component: SignUp,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;
