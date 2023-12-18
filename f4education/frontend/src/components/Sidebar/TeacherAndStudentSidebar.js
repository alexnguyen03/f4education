import { useState } from 'react'
import { Link, NavLink as NavLinkRRD } from 'react-router-dom'
// nodejs library to set properties for components
import { PropTypes } from 'prop-types'

// reactstrap components
import {
    Col,
    Collapse,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Nav,
    NavItem,
    NavLink,
    Navbar,
    Row
} from 'reactstrap'
var ps

const TeacherAndStudentSidebar = (props) => {
    const [collapseOpen, setCollapseOpen] = useState(true)
    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName) => {
        return props.location.pathname.indexOf(routeName) > -1 ? 'active' : ''
    }
    // toggles collapse between opened and closed (true/false)
    const toggleCollapse = () => {
        setCollapseOpen((data) => !data)
    }
    // closes the collapse
    const closeCollapse = () => {
        setCollapseOpen(false)
    }
    // creates the links that appear in the left menu / TeacherAndStudentSidebar
    const createLinks = (routes) => {
        return routes.map((prop, key) => {
            // console.log(prop.path, prop.name)
            if (
                prop.path !== '/class-info/:classId' &&
                prop.path !== '/class-info/point/:classId' &&
                prop.path !== '/quizz' &&
                prop.path !== '/task' &&
                prop.path !== '/classes/recources/:classId' &&
                prop.path !== '/download-task-student' &&
                prop.path !== '/resources' &&
                prop.path !== '/task/:classId' &&
                prop.path !== '/class-progress/:classId'
            ) {
                return (
                    <NavItem key={key}>
                        <NavLink
                            to={prop.layout + prop.path}
                            tag={NavLinkRRD}
                            onClick={closeCollapse}
                        >
                            <i className={prop.icon} />
                            {prop.name}
                        </NavLink>
                    </NavItem>
                )
            }
        })
    }

    const { bgColor, routes, logo } = props
    let navbarBrandProps
    if (logo && logo.innerLink) {
        navbarBrandProps = {
            to: logo.innerLink,
            tag: Link
        }
    } else if (logo && logo.outterLink) {
        navbarBrandProps = {
            href: logo.outterLink,
            target: '_blank'
        }
    }

    return (
        <Navbar
            className="navbar-vertical fixed-left navbar-light shadow "
            expand="md"
            id="sidenav-main"
        >
            <Collapse navbar isOpen={collapseOpen}>
                {/* Collapse header */}
                <div className="navbar-collapse-header d-md-none">
                    <Row>
                        {logo ? (
                            <Col className="collapse-brand" xs="6">
                                {logo.innerLink ? (
                                    <Link to={logo.innerLink}>
                                        <img
                                            alt={logo.imgAlt}
                                            src={logo.imgSrc}
                                        />
                                    </Link>
                                ) : (
                                    <a href={logo.outterLink}>
                                        <img
                                            alt={logo.imgAlt}
                                            src={logo.imgSrc}
                                        />
                                    </a>
                                )}
                            </Col>
                        ) : null}
                        <Col className="collapse-close" xs="6">
                            <button
                                className="navbar-toggler"
                                type="button"
                                onClick={toggleCollapse}
                            ></button>
                        </Col>
                    </Row>
                </div>
                {/* Form */}
                <Form className="mt-4 mb-3 d-md-none">
                    <InputGroup className="input-group-rounded input-group-merge">
                        <Input
                            aria-label="Search"
                            className="form-control-rounded form-control-prepended"
                            placeholder="Search"
                            type="search"
                        />
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <span className="fa fa-search" />
                            </InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>{' '}
                {/* Navigation */}
                <Nav navbar>{createLinks(routes)}</Nav>
            </Collapse>
        </Navbar>
    )
}

TeacherAndStudentSidebar.defaultProps = {
    routes: [{}]
}

TeacherAndStudentSidebar.propTypes = {
    // links that will be displayed inside the component
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        // innerLink is for links that will direct the user within the app
        // it will be rendered as <Link to="...">...</Link> tag
        innerLink: PropTypes.string,
        // outterLink is for links that will direct the user outside the app
        // it will be rendered as simple <a href="...">...</a> tag
        outterLink: PropTypes.string,
        // the image src of the logo
        imgSrc: PropTypes.string.isRequired,
        // the alt for the img
        imgAlt: PropTypes.string.isRequired
    })
}

export default TeacherAndStudentSidebar
