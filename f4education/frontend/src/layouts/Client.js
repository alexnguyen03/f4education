import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// reactstrap components
// import {Container} from 'reactstrap';
import { useEffect, useRef } from "react";
// core components
import ClientFooter from "components/Footers/ClientFooter.js";
import ClientNavbar from "components/Navbars/ClientNavbar.js";

import { routesClient } from "routes.js";
import { Container } from "@mantine/core";

// import "../assets/css/custom-client-css/Index.css";

const Client = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();

  useEffect(() => {}, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routesClient) => {
    return routesClient.map((prop, key) => {
      // console.log(
      //   "🚀 ~ file: Client.js:28 ~ returnroutesClient.map ~ prop.layout:",
      //   prop.component
      // );
      if (prop.layout === "/client") {
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
      <div
        className="main-content mt--5"
        style={{ backgroundColor: "#fff", minHeight: "100vh" }}
        ref={mainContent}
      >
        {/* Client header */}
        {/* <Container size="xl" px="xs"> */}
          <ClientNavbar />
        {/* </Container> */}

        {/* Page content */}
        <Container size="xl" px="xs" className="pb-5 pt-8">
          <Routes>
            {getRoutes(routesClient)}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </div>

      {/* Footer */}
      <ClientFooter />
    </>
  );
};

export default Client;
