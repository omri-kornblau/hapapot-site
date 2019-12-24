import Main from "views/Main.jsx";
import AboutUs from "views/AboutUs.jsx";
import UserProfile from "views/UserProfile.jsx";
//import Statistics from "views/Statistics.jsx";

var routes = [
  {
    path: "/main",
    name: "בית",
    icon: "tim-icons icon-calendar-60",
    component: Main,
    layout: "/home"
  },
  {
    path: "/aboutus",
    name: "קצת עלינו",
    icon: "tim-icons icon-satisfied",
    component: AboutUs,
    layout: "/home"
  },
  {
    path: "/userprofile",
    name: "האזור האישי",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/home"
  }
  /*
  {
    path: "/statistics",
    name: "האזור האישי",
    icon: "tim-icons icon-chart-bar-32",
    component: Statistics,
    layout: "/home"
  }*/
];
export default routes;
