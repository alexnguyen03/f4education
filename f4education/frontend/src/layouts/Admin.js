import { useEffect, React, useRef, useState } from 'react'
import { useLocation, Route, Routes, Navigate } from 'react-router-dom'
// reactstrap components
import { Container } from 'reactstrap'
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import AdminFooter from 'components/Footers/AdminFooter.js'
import Sidebar from 'components/Sidebar/Sidebar.js'

// import "../assets/css/custom-admin-css/Index.css";

import { routes } from 'routes.js'
import { ToastContainer } from 'react-toastify'

const Admin = (props) => {
    const mainContent = useRef(null)
    const location = useLocation()
    const [adminName, setAdminName] = useState('')
    const [adminImg, setAdminImg] = useState('')
    useEffect(() => {
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
        mainContent.current.scrollTop = 0
    }, [location])

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === '/admin') {
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

    const getBrandText = (path) => {
        for (let i = 0; i < routes.length; i++) {
            if (
                props?.location?.pathname.indexOf(
                    routes[i].layout + routes[i].path
                ) !== -1
            ) {
                return routes[i].name
            }
        }
        return 'Brand'
    }
    const getAdminInfo = () => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            setAdminName(user.fullName)
            setAdminImg(user.imageName)
        }
    }
    useEffect(() => {
        getAdminInfo()
    })

    return (
        <>
            <Sidebar {...props} routes={routes} />
            <div className="main-content" ref={mainContent}>
                <AdminNavbar
                    {...props}
                    brandText={'F4EDUCATION '}
                    // brandText={getBrandText(props?.location?.pathname)}
                    adminName={adminName}
                    adminImg={adminImg}
                />
                <Routes>
                    {getRoutes(routes)}
                    <Route
                        path="*"
                        element={<Navigate to="/admin/index" replace />}
                    />
                </Routes>
                <Container fluid>
                    <AdminFooter />
                </Container>
            </div>
        </>
    )
}

export default Admin
