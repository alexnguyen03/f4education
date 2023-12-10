import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { routesEvaluation } from 'routes.js'

const Evaluation = (props) => {
    const mainContent = useRef(null)
    const location = useLocation()

    useEffect(() => {
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
        mainContent.current.scrollTop = 0
    }, [location])

    const getRoutes = (routesEvaluation) => {
        return routesEvaluation.map((prop, key) => {
            if (prop.layout === '/evaluation') {
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
        <div
            className="main-content"
            style={{ backgroundColor: '#fff' }}
            ref={mainContent}
        >
            {/* Page content */}
            <div style={{ minHeight: '100vh' }}>
                <Routes>
                    {getRoutes(routesEvaluation)}
                    <Route
                        path="/evaluation"
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Evaluation
