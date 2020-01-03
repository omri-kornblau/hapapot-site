import Main from "views/Main.jsx";
import AboutUs from "views/AboutUs.jsx";
import UserProfile from "views/UserProfile.jsx";
import Day from "views/Day";
import Event from "views/Event";
//import Statistics from "views/Statistics.jsx";

var routes = [
  {
    path: "/main",
    name: "בית",
    icon: "tim-icons icon-calendar-60",
    component: Main,
    layout: "/home",
    showOnMenu: true
  },
  {
    path: "/userprofile",
    name: "האזור האישי",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/home",
    showOnMenu: true
  },
  {
    path: "/aboutus",
    name: "קצת עלינו",
    icon: "tim-icons icon-satisfied",
    component: AboutUs,
    layout: "/home",
    showOnMenu: true
  },
  {
    path: "/day",
    name: "יום",
    icon: "ani ohev othh",
    component: Day,
    layout: "/home",
    showOnMenu: false
  },
  {
    path: "/event",
    name: "אירוע",
    icon: "ani ohev othh",
    component: Event,
    layout: "/home",
    showOnMenu: false
  }
  /*
  {
    path: "/statistics",
    name: "האזור האישי",
    icon: "tim-icons icon-chart-bar-32",
    component: Statistics,
    layout: "/home",
    showOnMenu: true
  }*/
];
export default routes;
