import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { routesPDF } from 'routes.js'
import { Container } from '@mantine/core'

const PDFLayout = (props) => {
    const mainContent = useRef(null)
    const location = useLocation()

    useEffect(() => {
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
        mainContent.current.scrollTop = 0
    }, [location])

    const getRoutes = (routesClient) => {
        return routesClient.map((prop, key) => {
            if (prop.layout === '/pdf') {
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
            <div
                className="main-content"
                style={{ backgroundColor: '#fff' }}
                ref={mainContent}
            >
                {/* Page content */}
                <div style={{ minHeight: '100vh' }}>
                    <Routes>
                        {getRoutes(routesPDF)}
                        <Route
                            path="/pdf"
                            element={<Navigate to="/" replace />}
                        />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default PDFLayout
