/*!

=========================================================
* Black Dashboard React v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Main from "views/Main.jsx";
import AboutUs from "views/AboutUs.jsx";
import UserProfile from "views/UserProfile.jsx";
import Statistics from "views/Statistics.jsx";

var routes = [
  {
    path: "/main",
    name: "בית",
    icon: "icon-calendar-60",
    component: Main,
    layout: "/home"
  }
  {
    path: "/aboutus",
    name: "קצת עלינו",
    icon: "icon-satisfied",
    component: AboutUs,
    layout: "/home"
  } 
  {
    path: "/userprofile",
    name: "האזור האישי",
    icon: "icon-single-02",
    component: UserProfile,
    layout: "/home"
  }
  {
    path: "/statistics",
    name: "האזור האישי",
    icon: "icon-chart-bar-32",
    component: Statistics,
    layout: "/home"
  }

];
export default routes;
