import { Container } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'
// import logo from '../../assets/img/brand/f4-white.png'
import logo from '../../assets/img/new-logo-white.png'

const ClientFooter = () => {
    return (
        <>
            <Container size="xl">
                <footer className="p-5">
                    <div className="d-flex justify-content-between flex-wrap text-start">
                        {/* Item */}
                        <div
                            className="d-flex flex-column"
                            style={{ maxWidth: '350px' }}
                        >
                            <div className="flex flex-column font-weight-600 mb-3">
                                <span
                                    className="text-white font-weight-400"
                                    style={{ fontSize: '25px' }}
                                >
                                    Thông tin
                                </span>{' '}
                                <br />
                                <span
                                    className="text-white font-weight-400 text-line-end"
                                    style={{ fontSize: '25px' }}
                                >
                                    liên lạc
                                </span>
                            </div>
                            <p
                                className="font-weight-500"
                                style={{ color: '#ADB5BD' }}
                            >
                                Hãy liên hệ với chúng tôi bất cứ lúc nào. Chúng
                                tôi thích nói chuyện qua email hơn. Tôi có thể
                                trả lời email của bạn trong vài giờ.
                            </p>
                            <div className="d-flex flex-column">
                                <p className="mb-0">
                                    <span
                                        style={{ color: 'rgb(158, 158, 158)' }}
                                        className="font-weight-400"
                                    >
                                        Email:
                                    </span>
                                    <a
                                        href="mailTo:tronghientran18@gmail.com"
                                        className="text-white font-weight-300 ml-2"
                                    >
                                        f4education@gmail.com
                                    </a>
                                </p>
                                <p className="mt-0">
                                    <span
                                        style={{ color: 'rgb(158, 158, 158)' }}
                                        className="font-weight-400"
                                    >
                                        Phone:
                                    </span>
                                    <span className="text-white font-weight-300 ml-2">
                                        +84 706802119
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Item */}
                        <div className="d-flex flex-column">
                            <div className="flex flex-column font-weight-600 mb-3">
                                <span
                                    className="text-white font-weight-400"
                                    style={{ fontSize: '25px' }}
                                >
                                    Mạng xã hội và
                                </span>
                                <br />
                                <span
                                    className="text-white font-weight-400 text-line-end"
                                    style={{ fontSize: '25px' }}
                                >
                                    công việc
                                </span>
                            </div>
                            <ul className="list-unstyled">
                                <li>
                                    <Link
                                        to="https://www.facebook.com/tran.trong.hien.vl/"
                                        className="text-decoration-none font-weight-500"
                                        style={{ color: '#ADB5BD' }}
                                    >
                                        Facebook
                                    </Link>
                                </li>
                                <li className="my-2">
                                    <Link
                                        to="https://github.com/hientt1803"
                                        className="text-decoration-none font-weight-500"
                                        style={{ color: '#ADB5BD' }}
                                    >
                                        Github
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="https://www.linkedin.com/in/hi%E1%BA%BFn-tr%E1%BA%A7n-49b774256/"
                                        className="text-decoration-none font-weight-500"
                                        style={{ color: '#ADB5BD' }}
                                    >
                                        linkedIn
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* item */}
                        <div className="d-flex flex-column">
                            <div className="flex flex-column font-weight-600 mb-3">
                                <span
                                    className="text-white font-weight-400"
                                    style={{ fontSize: '25px' }}
                                >
                                    Tổng quan
                                </span>
                                <br />
                                <span
                                    className="text-white font-weight-400 text-line-end"
                                    style={{ fontSize: '25px' }}
                                >
                                    trang web
                                </span>
                            </div>
                            <ul className="list-unstyled">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-decoration-none font-weight-500"
                                        style={{ color: '#ADB5BD' }}
                                    >
                                        Trang chủ
                                    </Link>
                                </li>
                                <li className="my-2">
                                    <Link
                                        to="/course"
                                        className="text-decoration-none font-weight-500 my-2"
                                        style={{ color: '#ADB5BD' }}
                                    >
                                        Khóa học
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/#"
                                        className="text-decoration-none font-weight-500"
                                        style={{ color: '#ADB5BD' }}
                                    >
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Item */}
                        <div className="d-flex flex-column">
                            <span className="text-dark">.</span>
                        </div>
                    </div>

                    {/* Bottom Item */}
                    <div className="d-flex justify-content-between mt-4">
                        <span className="font-weight-700">
                            <img src={logo} alt="" width={40} heihg={40} />
                        </span>
                        <span className="font-weight-700 text-white">
                            @2023, Inc
                        </span>
                    </div>
                </footer>
            </Container>
        </>
    )
}

export default ClientFooter
