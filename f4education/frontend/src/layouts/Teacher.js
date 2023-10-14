import { useEffect, React, useRef, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components

// core components
import Sidebar from "components/Sidebar/Sidebar.js";

// import "../assets/css/custom-admin-css/Index.css";

import { routesTeacher } from "routes.js";
import TeacherNavbar from "components/Navbars/TeacherNavbar";

const Admin = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routesTeacher) => {
    return routesTeacher.map((prop, key) => {
      if (prop.layout === "/teacher") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getAdminInfo = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("🚀 ~ file: Admin.js:66 ~ getAdminInfo ~ user:", user);
    if (user) {
      setAdminName(user.fullName);
    }
  };
  useEffect(() => {
    getAdminInfo();
    console.log(
      "🚀 ~ file: Admin.js:74 ~ useEffect ~ JSON.parse(localStorage.getItem('user') | '');:",
      JSON.parse(localStorage.getItem("user"))
    );
  });

  return (
    <>
      <Sidebar
        {...props}
        routes={routesTeacher}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div
        className="main-content"
        style={{ minHeight: "100vh" }}
        ref={mainContent}
      >
        <TeacherNavbar />

        <div
          className="m-2 p-5"
          style={{ minHeight: "100vh", paddingTop: "100px" }}
        >
          <Routes>
            {getRoutes(routesTeacher)}
            <Route
              path="/teacher/*/*"
              element={<Navigate to="/teacher/information" replace />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Admin;
