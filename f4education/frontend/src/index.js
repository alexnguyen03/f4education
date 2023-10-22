import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from 'layouts/Admin.js';
import AuthLayout from 'layouts/Auth.js';
import ClientLayout from 'layouts/Client.js';
import Teacher from 'layouts/Teacher';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<BrowserRouter>
		<Routes>
			{/* Admin Route */}
			<Route
				path='/admin/*'
				element={<AdminLayout />}
			/>
			<Route
				path='/auth/*'
				element={<AuthLayout />}
			/>
			<Route
				path='/admin/*/:courseName'
				element={<AdminLayout />}
			/>
			<Route
				path='/admin/*/:courseName/:folderId'
				element={<AdminLayout />}
			/>
			<Route
				path='/admin'
				element={
					<Navigate
						to='/admin/index'
						replace
					/>
				}
			/>

			{/* Client Route */}
			<Route
				path='/*'
				element={<ClientLayout />}
			/>
			<Route
				path='/course/*/:courseId'
				element={<ClientLayout />}
			/>
			<Route
				path='/*/course-register-detail/:courseId'
				element={<ClientLayout />}
			/>

			{/* Teacher Route */}
			<Route
				path='/teacher/*'
				element={<Teacher />}
			/>
			<Route
				path='/*/classes-infor/:classId'
				element={<Teacher />}
			/>
		</Routes>
	</BrowserRouter>,
);
