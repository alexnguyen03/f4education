import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
// reactstrap components
// import {Container} from 'reactstrap';
import { useEffect, useRef } from 'react'
// core components

import { Button, Container } from '@mantine/core'
import TeacherAndStudentSidebar from 'components/Sidebar/TeacherAndStudentSidebar'
import { useState } from 'react'
import { routesStudent } from '../routes'

const Student = (props) => {
    const mainContent = useRef(null)
    const location = useLocation()
    const [showSideBar, setShowSideBar] = useState(false)

    useEffect(() => {}, [])

    useEffect(() => {
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
        mainContent.current.scrollTop = 0
    }, [location])

    const getRoutes = (routesStudent) => {
        return routesStudent.map((prop, key) => {
            if (prop.layout === '/student') {
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

    return (
        <>
            {/* {showSideBar && ( */}

            {/* )} */}

            {showSideBar && (
                <TeacherAndStudentSidebar {...props} routes={routesStudent} />
            )}
            <Container
                className="main-content "
                style={{ backgroundColor: '#fff', minHeight: '100vh' }}
                ref={mainContent}
                fluid
            >
                <Container fluid pos={'relative'} px={0} py={'xl'} my={'xl'}>
                    <Button
                        left={`${showSideBar ? -45 : 0}`}
                        top={0}
                        pos={'absolute'}
                        onClick={() => {
                            setShowSideBar((prev) => !prev)
                        }}
                        // className={`${showSideBar ? 'ml--6' : ''} mt-3 `}
                    >
                        {!showSideBar ? (
                            <i className="fa-solid fa-bars"></i>
                        ) : (
                            <i className="fa-solid fa-chevron-left"></i>
                        )}
                    </Button>
                </Container>
                <Container fluid px={0}>
                    <Routes>
                        {getRoutes(routesStudent)}
                        <Route
                            path="*"
                            element={<Navigate to="/student" replace />}
                        />
                    </Routes>
                </Container>
            </Container>
        </>
    )
}

export default Student
