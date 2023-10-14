import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// reactstrap components
import { useEffect, useRef } from "react";

// core components

import { routesTeacher } from "routes.js";
import { Container } from "@mantine/core";
import Sidebar from "components/Sidebar/Sidebar";

const Teacher = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();

  useEffect(() => {}, []);

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

  return (
    <>
      {/* Sidebar */}
      <Sidebar
				{...props}
				routes={routesTeacher}
				logo={{
					innerLink: '/teacher/*',
					imgSrc: require('../assets/img/brand/argon-react.png'),
					imgAlt: '...',
				}}
			/>
      <div
        className="main-content mt--5"
        style={{ backgroundColor: "#fff", minHeight: "100vh" }}
        ref={mainContent}
      >
        {/* Page content */}
        <Container size="xl" px="xs" className="pb-5 pt-8">
          <Routes>
            {getRoutes(routesTeacher)}
          </Routes>
        </Container>
      </div>
    </>
  );
};

export default Teacher;
