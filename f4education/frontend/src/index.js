import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import 'assets/plugins/nucleo/css/nucleo.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'assets/scss/argon-dashboard-react.scss'

import AdminLayout from '././layouts/Admin'
import AuthLayout from '././layouts/Auth'
import ClientLayout from '././layouts/Client'
import Teacher from './layouts/Teacher'
import Student from './layouts/Student'
import PDFLayout from './layouts/PDF'
import Evaluation from './layouts/Evaluation'
import Quiz from 'layouts/Quiz'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <BrowserRouter>
        <Routes>
            {/* Admin Route */}
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="/admin/*/:questionId" element={<AdminLayout />} />
            <Route
                path="/admin/*/:courseName/:folderId"
                element={<AdminLayout />}
            />
            <Route
                path="/admin/*/:courseName/:folderId"
                element={<AdminLayout />}
            />
            <Route
                path="/admin"
                element={<Navigate to="/admin/index" replace />}
            />
            <Route
                path="/classs/class-detail/:classIdParam"
                element={<AdminLayout />}
            />
            <Route path="/admin/*/:courseId" element={<AdminLayout />} />

            {/* Client Route */}
            <Route path="/*" element={<ClientLayout />} />
            <Route path="/course/*/:courseId" element={<ClientLayout />} />
            <Route
                path="/*/course-register-detail/:courseId"
                element={<ClientLayout />}
            />
            <Route path="/admin/*/:courseName" element={<AdminLayout />} />
            <Route
                path="/admin/*/:courseName/:folderId"
                element={<AdminLayout />}
            />

            {/* Student Route */}
            <Route path="/student/*" element={<Student />} />
            <Route path="/*/:classId" element={<Student />} />

            {/* Teacher Route */}
            <Route path="/teacher/*" element={<Teacher />} />
            <Route path="/class-info/point/:classId" element={<Teacher />} />
            <Route path="/*/class-info/:classId" element={<Teacher />} />

            {/* PDF Route */}
            <Route path="/pdf/*" element={<PDFLayout />} />
            {/* Evaluation Route */}
            <Route path="/evaluation/*" element={<Evaluation />} />
            <Route path="/*/student/:classId/*" element={<Evaluation />} />

            <Route path="/quiz/*" element={<Quiz />} />
        </Routes>
    </BrowserRouter>
)
