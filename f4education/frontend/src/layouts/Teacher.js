import { useEffect, useRef, useState } from 'react'
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate
} from 'react-router-dom'
// reactstrap components

// core components
import TeacherAndStudentSidebar from '../components/Sidebar/TeacherAndStudentSidebar'

// import "../assets/css/custom-Teacher-css/Index.css";

import { Button, Container, Group, Menu } from '@mantine/core'
import {
    IconChevronDown,
    IconChevronRight,
    IconEdit,
    IconLogout,
    IconPasswordUser
} from '@tabler/icons-react'
import UserButton from 'components/UserButton/UserButton'
import { routesTeacher } from '../routes'
const IMG_URL = '/avatars/teachers/'

const Teacher = (props) => {
    const user = JSON.parse(localStorage.getItem('user'))
    let navigate = useNavigate()

    const mainContent = useRef(null)
    const location = useLocation()
    const [teacherName, setTeacherName] = useState('')
    const [showSideBar, setShowSideBar] = useState(false)
    const [userIcon, setUserIcon] = useState(<IconChevronRight size="1rem" />)
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
            {showSideBar && (
                <TeacherAndStudentSidebar {...props} routes={routesTeacher} />
            )}
            <Container
                className="main-content "
                style={{ backgroundColor: '#fff', minHeight: '100vh' }}
                ref={mainContent}
                fluid
                pt={'md'}
            >
                <Container fluid px={0} className="border-bottom">
                    <Group position="right" pos={'relative'}>
                        <Button
                            left={`${showSideBar ? -45 : 0}`}
                            top={'25%'}
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

                        <Group w={280}>
                            <Menu
                                shadow="md"
                                onOpen={() => {
                                    setUserIcon(<IconChevronDown size="1rem" />)
                                }}
                                onClose={() => {
                                    setUserIcon(
                                        <IconChevronRight size="1rem" />
                                    )
                                }}
                            >
                                <Menu.Target>
                                    <UserButton
                                        // image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                                        image={`${
                                            process.env.REACT_APP_IMAGE_URL +
                                            IMG_URL +
                                            user.imageName
                                        }`}
                                        name={`${user.fullName}`}
                                        email={`${user.email}`}
                                        icon={userIcon}
                                    />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    {/* <Menu.Label>Danger zone</Menu.Label> */}
                                    <Menu.Item
                                        icon={<IconEdit size={14} />}
                                        onClick={() => {
                                            navigate('/teacher/information')
                                        }}
                                    >
                                        Thông tin tài khoản
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        icon={<IconPasswordUser size={14} />}
                                        onClick={() => {
                                            navigate('/teacher/information')
                                        }}
                                    >
                                        Đổi mật khẩu
                                    </Menu.Item>
                                    <Menu.Item
                                        color="red"
                                        icon={<IconLogout size={14} />}
                                        onClick={() => {
                                            localStorage.removeItem('user')
                                            navigate('/auth/login')
                                        }}
                                    >
                                        Đăng xuất
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </Container>
                <div className="" style={{ minHeight: '100vh' }}>
                    <div className="">
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
            </Container>
        </>
    )
}

export default Teacher
