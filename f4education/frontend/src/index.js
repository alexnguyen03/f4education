import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// import MantineProvider from "@mantine/core";
// import Notifications from "@mantine/notifications";
// import "@mantine/notifications/styles.css";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "assets/css/costum-client-react.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import ClientLayout from "layouts/Client.js";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/admin" element={<Navigate to="/admin/index" replace />} />
        <Route path="/*" element={<ClientLayout />} />
        <Route path="/admin/*/:courseName" element={<AdminLayout />} />
        <Route
          path="/admin/*/:courseName/:folderId"
          element={<AdminLayout />}
        />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);
