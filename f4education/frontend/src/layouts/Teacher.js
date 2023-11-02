import { useEffect, React, useRef, useState } from 'react'
import { useLocation, Route, Routes, Navigate } from 'react-router-dom'
// reactstrap components

// core components
import TeacherAndStudentSidebar from '../components/Sidebar/TeacherAndStudentSidebar'

// import "../assets/css/custom-Teacher-css/Index.css";

import { routesTeacher } from '../routes'
import TeacherNavbar from 'components/Navbars/TeacherNavbar'

const Teacher = (props) => {
    const mainContent = useRef(null)
    const location = useLocation()
    const [teacherName, setTeacherName] = useState('')
    useEffect(() => {
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
        mainContent.current.scrollTop = 0
    }, [location])

    const getRoutes = (routesTeacher) => {
        return routesTeacher.map((prop, key) => {
            if (prop.layout === '/teacher') {
                return (
                    <Route
                        path={prop.path}
                        element={prop.component}
                        key={key}
                        exact
                    />
                )
            } else {
                return null
            }
        })
    }

    const getTeacherInfo = () => {
        const user = JSON.parse(localStorage.getItem('user'))
        // console.log("🚀 ~ file: Teacher.js:66 ~ getTeacherInfo ~ user:", user);
        if (user) {
            setTeacherName(user.fullName)
        }
    }
    useEffect(() => {
        getTeacherInfo()
        // console.log(
        //   "🚀 ~ file: Teacher.js:74 ~ useEffect ~ JSON.parse(localStorage.getItem('user') | '');:",
        //   JSON.parse(localStorage.getItem("user"))
        // );
    })

    return (
        <>
            <TeacherAndStudentSidebar
                {...props}
                routes={routesTeacher}
                logo={{
                    innerLink: '/student',
                    imgSrc: require('../assets/img/brand/argon-react.png'),
                    imgAlt: '...'
                }}
            />
            <div
                className="main-content"
                style={{ minHeight: '100vh' }}
                ref={mainContent}
            >
                {/* <TeacherNavbar /> */}

                <div className="m-2 p-3" style={{ minHeight: '100vh' }}>
                    <div className="mt-xl-7 mt-lg-6">
                        <Routes>
                            {getRoutes(routesTeacher)}
                            <Route
                                path={`/teacher/*/*`}
                                element={
                                    <Navigate
                                        to={'/teacher/information'}
                                        replace
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Teacher
