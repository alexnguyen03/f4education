/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from 'reactstrap'

const Footer = () => {
    return (
        <footer className="footer">
            <Row className="align-items-center justify-content-center">
                <Col xl="">
                    <div className="copyright text-center  text-muted">
                        © {new Date().getFullYear()}{' '}
                        <a
                            className="font-weight-bold ml-1"
                            href="https://www.creative-tim.com?ref=adr-admin-footer"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Bộ Tứ Siêu Đẳng
                        </a>
                    </div>
                </Col>
            </Row>
        </footer>
    )
}

export default Footer
