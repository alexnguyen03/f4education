import { useEffect, React, useRef, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Col, Container, Row } from "reactstrap";
// core components
import routes from "UserRoutes";
import UserFooter from "components/Footers/UserFooter";
import UserNavbar from "components/Navbars/UserNavbar";

const User = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
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
      {/* Header */}
      <UserNavbar />

      {/* Layout display here */}
      <div ref={mainContent}>
        {/* Page content */}
        <Container className="mt-4 pb-5">
          <Row className="justify-content-center">
            <Routes>
              {getRoutes(routes)}
              <Route path="/client/*" element={<Navigate to="/index" replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
      {/* Footer */}
      <UserFooter />
    </>
  );
};

export default User;
