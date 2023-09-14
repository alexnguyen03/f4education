/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Subjects from "views/admin/Subjects";
import Sessions from 'views/admin/Sessions';
import Courses from "views/admin/Courses.js";
import Teachers from "views/admin/Teachers.js";
import Classs from "views/admin/Classs.js';
import ClasssRoom from 'views/admin/ClasssRoom.js";
import Resources from 'views/admin/Resources.js'
import Questions from "views/admin/Questions";
import QuestionDetail from "views/admin/QuestionDetail";


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
	{
		path: "/teachers",
		name: "Giảng viên",
		icon: "ni ni-single-02 text-yellow",
		component: <Teachers />,
		layout: "/admin",
	},
  {
    path: "/subjects",
    name: "Môn học",
    icon: "ni ni-books text-blue",
    component: <Subjects />,
    layout: "/admin",
  },
	{
		path: '/sessions',
		name: 'Ca học',
		icon: 'ni ni-bullet-list-67 text-pink',
		component: <Sessions />,
		layout: '/admin',
	},
  {
    path: "/courses",
    name: "Khóa học",
    icon: "ni ni-single-02 text-yellow",
    component: <Courses />,
    layout: "/admin",
  },
  {
    path: "/classs",
    name: "Lớp học",
    icon: "ni ni-single-02 text-yellow",
    component: <Classs />,
    layout: "/admin",
  },
  {
    path: "/questions",
    name: "Câu hỏi",
    icon: "ni ni-ui-04 text-primary",
    component: <Questions />,
    layout: "/admin",
  },
  {
    path: "/questionDetail/:courseName",
    component: <QuestionDetail />,
    layout: "/admin",
  },
	{
		path: '/classsroom',
		name: 'Phòng học',
		icon: 'ni ni-key-25 text-info',
		component: <ClasssRoom />,
		layout: '/admin',
	},
	{
		path: '/resources',
		name: 'Tài nguyên',
		icon: 'ni ni-key-25 text-info',
		component: <Resources />,
		layout: '/admin',
	},
];
export default routes;
