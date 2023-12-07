import {
    Edit as EditIcon,
    Margin,
    RemoveCircleOutline as RemoveCircleOutlineIcon
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import accountApi from '../../api/accountApi'
import moment from 'moment'
import AccountHeader from 'components/Headers/AccountHeader'
import { MaterialReactTable } from 'material-react-table'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
    ButtonGroup
} from 'reactstrap'
import Notify from '../../utils/Notify'
import { LoadingOverlay } from '@mantine/core'

const IMG_URL = '/avatars/accounts/'
const Accounts = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')
    const [imgData, setImgData] = useState(null)
    const [loadingRequest, setLoadingRequest] = useState(false)
    const [loadingHistoryInfo, setLoadingHistoryInfo] = useState(true)
    const [showHistoryInfo, setShowHistoryInfo] = useState(false)
    const [showForm_1, setShowForm_1] = useState(false)
    const [showForm_2, setShowForm_2] = useState(false)
    const [showForm_3, setShowForm_3] = useState(false)
    const [loadingTeachers, setLoadingTeachers] = useState(true)
    const [loadingStudents, setLoadingStudents] = useState(true)
    const [loadingAdmins, setLoadingAdmins] = useState(true)
    const [loadingTeachersHistory, setLoadingTeachersHistory] = useState(true)
    const [teachers, setTeachers] = useState([])
    const [students, setStudents] = useState([])
    const [admins, setAdmins] = useState([])
    const [rSelected, setRSelected] = useState(null) //radio button
    const [image, setImage] = useState(null)
    const [update, setUpdate] = useState(false)
    const [teacherHistories, setTeacherHistories] = useState([])
    const [showHistoryTable, setShowHistoryTable] = useState(false)
    const [listHistoryById, setListHistoryById] = useState([])
    const [errors, setErrors] = useState({})
    const [errors_1, setErrors_1] = useState({})
    const toastId = React.useRef(null)
    const fileInputRef = useRef(null)

    // notification loading
    const notifi_loading = (mess) => {
        toastId.current = toast(mess, {
            type: toast.TYPE.LOADING,
            autoClose: false,
            isLoading: true,
            closeButton: false,
            closeOnClick: true
        })
    }

    //notifications success
    const update_success = (mess) => {
        toast.update(toastId.current, {
            type: toast.TYPE.SUCCESS,
            render: mess,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            isLoading: false
        })
    }

    //notifications fail
    const update_fail = (mess) => {
        toast.update(toastId.current, {
            type: toast.TYPE.ERROR,
            render: mess,
            position: 'top-right',
            // autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            isLoading: false
        })
    }

    //custom notification
    const notifi = (mess, type) => {
        toast(mess, {
            type: toast.TYPE[type],
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        })
    }

    //Nhận data vai trò học viên gửi lên từ server
    const [student, setStudent] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 1,
        status: true,
        student: {
            studentId: 0,
            fullname: '',
            gender: true,
            address: '',
            phone: '',
            image: ''
        }
    })

    //Nhận data vai trò giáo viên gửi lên từ server
    const [teacher, setTeacher] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 2,
        status: true,
        teacher: {
            teacherId: 0,
            fullname: '',
            gender: true,
            dateOfBirth: '',
            citizenIdentification: '',
            levels: '',
            address: '',
            phone: '',
            image: ''
        }
    })

    //Nhận data vai trò admin gửi lên từ server
    const [admin, setAdmin] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 3,
        status: true,
        admin: {
            adminId: '',
            fullname: '',
            gender: true,
            dateOfBirth: '',
            citizenIdentification: '',
            levels: '',
            address: '',
            phone: '',
            image: ''
        }
    })

    // Dùng để gửi request về sever
    const [teacherRequest, setTeacherRequest] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 0,
        teacher: {
            teacherId: 0,
            fullname: '',
            gender: true,
            dateOfBirth: '',
            citizenIdentification: '',
            levels: '',
            address: '',
            phone: '',
            image: ''
        }
        // acccountAdmin: 0,
    })

    const [studentRequest, setStudentRequest] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 1,
        status: false,
        student: {
            studentId: 0,
            fullname: '',
            gender: true,
            address: '',
            phone: '',
            image: ''
        }
    })

    const [adminRequest, setAdminRequest] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 3,
        status: false,
        admin: {
            adminId: '',
            fullname: '',
            gender: true,
            dateOfBirth: '',
            citizenIdentification: '',
            levels: '',
            address: '',
            phone: '',
            image: ''
        }
    })

    const handelOnChangeInput_1 = (e) => {
        const { name, value } = e.target
        setStudent((preStudent) => ({
            ...preStudent,
            [name]: value,
            student: {
                ...preStudent.student,
                [name]: value
            },
            numberSession: 0
        }))
    }

    // Thay đổi giá trị các thuộc tính của giáo viên
    const handelOnChangeInput_2 = (e) => {
        const { name, value } = e.target
        setTeacher((prevTeacher) => ({
            ...prevTeacher,
            [name]: value,
            teacher: {
                ...prevTeacher.teacher,
                [name]: value
            },
            numberSession: 0
        }))
    }

    const handelOnChangeInput_3 = (e) => {
        const { name, value } = e.target
        setAdmin((prevAdmin) => ({
            ...prevAdmin,
            [name]: value,
            admin: {
                ...prevAdmin.admin,
                [name]: value
            },
            numberSession: 0
        }))
    }

    const handelOnChangeInput = (e) => {
        setTeacher({
            ...teacher,
            [e.target.name]: e.target.value,
            numberSession: 0
        })
    }

    const onChangePicture_1 = (e) => {
        setImage(null)
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            setTeacher((preStudent) => ({
                ...preStudent,
                image: e.target.files[0].name
            }))
        }
    }

    // Cập nhật hình ảnh
    const onChangePicture_2 = (e) => {
        setImage(null)
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            setTeacher((preTeacher) => ({
                ...preTeacher,
                image: e.target.files[0].name
            }))
        }
    }

    const onChangePicture_3 = (e) => {
        setImage(null)
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            setTeacher((preAdmin) => ({
                ...preAdmin,
                image: e.target.files[0].name
            }))
        }
    }

    const columns_student = useMemo(
        () => [
            {
                accessorKey: 'username',
                header: 'Tên tài khoản',
                size: 50
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 85
            },
            {
                accessorKey: 'student.fullname',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    try {
                        if (
                            row.student.fullname === null ||
                            row.student.fullname == ''
                        ) {
                            return (
                                <span className="text-danger">
                                    Chưa có thông tin học viên
                                </span>
                            )
                        } else {
                            return <span>{row.student.fullname}</span>
                        }
                    } catch (error) {
                        return (
                            <span className="text-danger">
                                Chưa có thông tin học viên
                            </span>
                        )
                    }
                },
                header: 'Tên học viên',
                size: 70
            },
            {
                accessorKey: 'student.phone',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    try {
                        if (
                            row.student.phone === null ||
                            row.student.phone === ''
                        ) {
                            return (
                                <span className="text-danger">
                                    Chưa có thông tin
                                </span>
                            )
                        } else {
                            return <span>{row.student.phone}</span>
                        }
                    } catch (error) {
                        return (
                            <span className="text-danger">
                                Chưa có thông tin
                            </span>
                        )
                    }
                },
                header: 'SĐT',
                size: 50
            },
            {
                accessorKey: 'status',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.status === false) {
                        return <span className="text-danger">Đã khóa</span>
                    } else {
                        return <span className="text-success">Đã mở khóa</span>
                    }
                },
                header: 'Trạng thái',
                size: 30
            }
        ],
        []
    )

    const handleImageClick = () => {
        fileInputRef.current.click()
        console.log(
            '🚀 ~ file: Courses.js:205 ~ handleImageClick ~ fileInputRef.current:',
            fileInputRef.current
        )
    }
    const onChangePicture = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)

            const reader = new FileReader()
            reader.onload = () => {
                setImgData(reader.result)
            }
            reader.readAsDataURL(file)

            setStudent((prevStudent) => ({
                ...prevStudent,
                student: {
                    ...prevStudent.student,

                    image: file.name
                }
            }))
            setTeacher((prevTeacher) => ({
                ...prevTeacher,
                teacher: {
                    ...prevTeacher.teacher,

                    image: file.name
                }
            }))
            setAdmin((prevAdmin) => ({
                ...prevAdmin,
                admin: {
                    ...prevAdmin.admin,

                    image: file.name
                }
            }))
        } else {
            setImage(null)
            setImgData(null)
            setStudent((prevStudent) => ({
                ...prevStudent,
                student: {
                    ...prevStudent.student,

                    image: '' // Clear the image name
                }
            }))
            setTeacher((prevTeacher) => ({
                ...prevTeacher,
                teacher: {
                    ...prevTeacher.teacher,

                    image: '' // Clear the image name
                }
            }))
            setAdmin((prevAdmin) => ({
                ...prevAdmin,
                admin: {
                    ...prevAdmin.admin,

                    image: '' // Clear the image name
                }
            }))
        }
    }
    const columns_teacher = useMemo(
        () => [
            {
                accessorKey: 'username',
                header: 'Tên tài khoản',
                size: 50
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 75
            },
            {
                accessorKey: 'teacher.fullname',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    try {
                        if (
                            row.teacher.fullname === null ||
                            row.teacher.fullname == ''
                        ) {
                            return (
                                <span className="text-danger">
                                    Chưa có thông tin giáo viên
                                </span>
                            )
                        } else {
                            return <span>{row.teacher.fullname}</span>
                        }
                    } catch (error) {
                        return (
                            <span className="text-danger">
                                Chưa có thông tin giáo viên
                            </span>
                        )
                    }
                },
                header: 'Tên giáo viên',
                size: 70
            },
            {
                accessorKey: 'teacher.phone',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    try {
                        if (
                            row.teacher.phone === null ||
                            row.teacher.phone === ''
                        ) {
                            return (
                                <span className="text-danger">
                                    Chưa có thông tin
                                </span>
                            )
                        } else {
                            return <span>{row.teacher.phone}</span>
                        }
                    } catch (error) {
                        return (
                            <span className="text-danger">
                                Chưa có thông tin
                            </span>
                        )
                    }
                },
                header: 'SĐT',
                size: 50
            },
            {
                accessorKey: 'status',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.status === false) {
                        return <span className="text-danger">Đã khóa</span>
                    } else {
                        return <span className="text-success">Đã mở khóa</span>
                    }
                },
                header: 'Trạng thái',
                size: 30
            }
        ],
        []
    )

    const columns_admin = useMemo(
        () => [
            {
                accessorKey: 'username',
                header: 'Tên tài khoản',
                size: 50
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 75
            },
            {
                accessorKey: 'admin.fullname',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    try {
                        if (
                            row.admin.fullname === null ||
                            row.admin.fullname == ''
                        ) {
                            return (
                                <span className="text-danger">
                                    Chưa có thông tin quản trị viên
                                </span>
                            )
                        } else {
                            return <span>{row.admin.fullname}</span>
                        }
                    } catch (error) {
                        return (
                            <span className="text-danger">
                                Chưa có thông tin quản trị viên
                            </span>
                        )
                    }
                },
                header: 'Tên quản trị viên',
                size: 70
            },
            {
                accessorKey: 'admin.phone',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    try {
                        if (
                            row.admin.phone === null ||
                            row.admin.phone === ''
                        ) {
                            return (
                                <span className="text-danger">
                                    Chưa có thông tin
                                </span>
                            )
                        } else {
                            return <span>{row.admin.phone}</span>
                        }
                    } catch (error) {
                        return (
                            <span className="text-danger">
                                Chưa có thông tin
                            </span>
                        )
                    }
                },
                header: 'SĐT',
                size: 50
            },
            {
                accessorKey: 'status',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.status === false) {
                        return <span className="text-danger">Đã khóa</span>
                    } else {
                        return <span className="text-success">Đã mở khóa</span>
                    }
                },
                header: 'Trạng thái',
                size: 30
            }
        ],
        []
    )

    const columnsTeacherHistory = useMemo(
        () => [
            {
                accessorKey: 'fullname',
                header: 'Tên giáo viên',
                size: 100
            },
            {
                accessorKey: 'gender',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.gender) {
                        return <span>Nam</span>
                    } else {
                        return <span>Nữ</span>
                    }
                },
                header: 'Giới tính',
                size: 30
            },
            {
                accessorFn: (row) =>
                    moment(row.dateOfBirth).format('DD/MM/yyyy'),
                header: 'Ngày sinh',
                size: 60
            },
            {
                accessorFn: (row) =>
                    moment(row.modifyDate).format('DD/MM/yyyy, h:mm:ss a'),
                header: 'Ngày thao tác',
                size: 60
            },
            {
                accessorKey: 'adminName',
                header: 'Người thao tác',
                size: 80
            },
            {
                accessorKey: 'action',
                header: 'Hành động',
                size: 80
            }
        ],
        []
    )

    // Mở model edit của học viên
    const handleEditFrom_1 = (row) => {
        setShowForm_1(true)
        setUpdate(true)
        const selectedSutdent = students.find(
            (student) => student.id === row.original.id
        )
        setImage(
            process.env.REACT_APP_IMAGE_URL +
                IMG_URL +
                selectedSutdent.student.image
        )

        console.log(
            '🚀 ~ file: Accounts.js:496 ~ Accounts ~ selectedSutdent.student.image:',
            selectedSutdent.student.image
        )
        setStudent({ ...selectedSutdent })
        setRSelected(selectedSutdent.student.gender)
    }

    // Mở model edit của giáo viên
    const handleEditFrom_2 = (row) => {
        setShowForm_2(true)
        setUpdate(true)
        const selectedTeacher = teachers.find(
            (teacher) => teacher.id === row.original.id
        )
        setImage(
            process.env.REACT_APP_IMAGE_URL +
                IMG_URL +
                selectedTeacher.teacher.image
        )

        setTeacher({ ...selectedTeacher })
        setRSelected(selectedTeacher.teacher.gender)
    }

    const handleEditFrom_3 = (row) => {
        setShowForm_3(true)
        setUpdate(true)
        const selectedAdmin = admins.find(
            (admin) => admin.id === row.original.id
        )
        setImage(
            process.env.REACT_APP_IMAGE_URL +
                IMG_URL +
                selectedAdmin.admin.image
        )

        setAdmin({ ...selectedAdmin })
        setRSelected(selectedAdmin.admin.gender)
    }

    // Reset model của học viên
    const handleResetForm_1 = async () => {
        // hide form
        setShowForm_1((pre) => !pre)
        setUpdate(false)
        setImgData(null)
        setImage(null)
        setStudent({
            id: 0,
            username: '',
            password: '',
            email: '',
            roles: 1,
            status: true,
            student: {
                studentId: 0,
                fullname: '',
                gender: true,
                address: '',
                phone: '',
                image: ''
            }
        })
        setErrors_1({})
    }

    // Reset model của giáo viên
    const handleResetForm_2 = async () => {
        // hide form
        setShowForm_2((pre) => !pre)
        setUpdate(false)
        setImgData(null)
        setImage(null)
        setTeacher({
            id: 0,
            username: '',
            password: '',
            email: '',
            roles: 0,
            status: true,
            teacher: {
                teacherId: 0,
                fullname: '',
                gender: true,
                dateOfBirth: '',
                citizenIdentification: '',
                levels: '',
                address: '',
                phone: '',
                image: ''
            }
        })
        setErrors({})
    }

    const handleResetForm_3 = async () => {
        // hide form
        setShowForm_3((pre) => !pre)
        setUpdate(false)
        setImgData(null)
        setImage(null)
        setAdmin({
            id: 0,
            username: '',
            password: '',
            email: '',
            status: true,
            roles: 3,
            admin: {
                adminId: '',
                fullname: '',
                gender: true,
                dateOfBirth: '',
                citizenIdentification: '',
                levels: '',
                address: '',
                phone: '',
                image: ''
            }
        })
        setErrors({})
    }

    // Gọi API của học viên
    const handleSubmitForm_1 = (e) => {
        e.preventDefault()
        if (update) {
            updateStudent()
        } else {
            createStudent()
        }
    }

    // Gọi API của giáo viên
    const handleSubmitForm_2 = (e) => {
        e.preventDefault()
        if (update) {
            updateTeacher()
        } else {
            createTeacher()
        }
        // if (image) {
        //   setTeacher((preTeacher) => ({
        //     ...preTeacher,
        //     teacher: {
        //       ...preTeacher.teacher,
        //       image: image.name,
        //     },
        //   }));
        // }
    }

    const handleSubmitForm_3 = (e) => {
        e.preventDefault()
        if (update) {
            updateAdmin()
        } else {
            createAdmin()
        }
    }

    const validateForm_1 = () => {
        let validationErrors = {}
        let test = 0

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!student.email) {
            validationErrors.email = 'Vui lòng nhập email!!!'
            test++
        } else {
            if (!isEmail.test(student.email)) {
                validationErrors.email = 'Không đúng định dạng email!!!'
                test++
            } else {
                validationErrors.email = ''
            }
        }

        if (!student.password) {
            validationErrors.password = 'Vui lòng nhập password!!!'
            test++
        } else {
            if (student.password.length < 6) {
                validationErrors.password = 'Password tối thiểu gồm 6 kí tự!!!'
                test++
            } else {
                validationErrors.password = ''
            }
        }

        if (!student.student.fullname) {
            validationErrors.fullname = 'Vui lòng nhập tên!!!'
            test++
        } else {
            validationErrors.fullname = ''
        }

        if (!student.student.address) {
            validationErrors.address = 'Vui lòng nhập địa chỉ!!!'
            test++
        } else {
            validationErrors.address = ''
        }

        const isVNPhoneMobile =
            /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/

        if (!isVNPhoneMobile.test(student.student.phone)) {
            validationErrors.phone = 'Không đúng định dạng số điện thoại!!!'
            test++
        } else {
            validationErrors.phone = ''
        }

        if (test === 0) {
            return {}
        }
        return validationErrors
    }

    const validateForm_2 = () => {
        let validationErrors = {}
        let test = 0

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!teacher.email) {
            validationErrors.email = 'Vui lòng nhập email!!!'
            test++
        } else {
            if (!isEmail.test(teacher.email)) {
                validationErrors.email = 'Không đúng định dạng email!!!'
                test++
            } else {
                validationErrors.email = ''
            }
        }

        if (!teacher.password) {
            validationErrors.password = 'Vui lòng nhập password!!!'
            test++
        } else {
            if (teacher.password.length < 6) {
                validationErrors.password = 'Password tối thiểu gồm 6 kí tự!!!'
                test++
            } else {
                validationErrors.password = ''
            }
        }

        if (!teacher.teacher.dateOfBirth) {
            validationErrors.dateOfBirth = 'Vui lòng chọn ngày sinh!!!'
            test++
        } else {
            validationErrors.dateOfBirth = ''
        }

        if (!teacher.teacher.fullname) {
            validationErrors.fullname = 'Vui lòng nhập tên!!!'
            test++
        } else {
            validationErrors.fullname = ''
        }

        if (!teacher.teacher.citizenIdentification) {
            validationErrors.citizenIdentification = 'Vui lòng nhập CCCD!!!'
            test++
        } else {
            if (teacher.teacher.citizenIdentification.length !== 12) {
                validationErrors.citizenIdentification = 'Số CCCD gồm 12 số!!!'
                test++
            } else {
                validationErrors.citizenIdentification = ''
            }
        }

        if (!teacher.teacher.address) {
            validationErrors.address = 'Vui lòng nhập địa chỉ!!!'
            test++
        } else {
            validationErrors.address = ''
        }

        if (!teacher.teacher.levels) {
            validationErrors.levels = 'Vui lòng nhập trình độ học vấn!!!'
            test++
        } else {
            validationErrors.levels = ''
        }

        const isVNPhoneMobile =
            /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/

        if (!isVNPhoneMobile.test(teacher.teacher.phone)) {
            validationErrors.phone = 'Không đúng định dạng số điện thoại!!!'
            test++
        } else {
            validationErrors.phone = ''
        }

        if (test === 0) {
            return {}
        }
        return validationErrors
    }

    const validateForm_3 = () => {
        let validationErrors = {}
        let test = 0

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!admin.email) {
            validationErrors.email = 'Vui lòng nhập email!!!'
            test++
        } else {
            if (!isEmail.test(admin.email)) {
                validationErrors.email = 'Không đúng định dạng email!!!'
                test++
            } else {
                validationErrors.email = ''
            }
        }

        if (!admin.password) {
            validationErrors.password = 'Vui lòng nhập password!!!'
            test++
        } else {
            if (admin.password.length < 6) {
                validationErrors.password = 'Password tối thiểu gồm 6 kí tự!!!'
                test++
            } else {
                validationErrors.password = ''
            }
        }

        if (!admin.admin.dateOfBirth) {
            validationErrors.dateOfBirth = 'Vui lòng chọn ngày sinh!!!'
            test++
        } else {
            validationErrors.dateOfBirth = ''
        }

        if (!admin.admin.fullname) {
            validationErrors.fullname = 'Vui lòng nhập tên!!!'
            test++
        } else {
            validationErrors.fullname = ''
        }

        if (!admin.admin.citizenIdentification) {
            validationErrors.citizenIdentification = 'Vui lòng nhập CCCD!!!'
            test++
        } else {
            if (admin.admin.citizenIdentification.length !== 12) {
                validationErrors.citizenIdentification = 'Số CCCD gồm 12 số!!!'
                test++
            } else {
                validationErrors.citizenIdentification = ''
            }
        }

        if (!admin.admin.address) {
            validationErrors.address = 'Vui lòng nhập địa chỉ!!!'
            test++
        } else {
            validationErrors.address = ''
        }

        if (!admin.admin.levels) {
            validationErrors.levels = 'Vui lòng nhập trình độ học vấn!!!'
            test++
        } else {
            validationErrors.levels = ''
        }

        const isVNPhoneMobile =
            /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/

        if (!isVNPhoneMobile.test(admin.admin.phone)) {
            validationErrors.phone = 'Không đúng định dạng số điện thoại!!!'
            test++
        } else {
            validationErrors.phone = ''
        }

        if (test === 0) {
            return {}
        }
        return validationErrors
    }

    // Thêm thông tin học viên
    const createStudent = async () => {
        const validate = validateForm_1()

        if (Object.keys(validate).length === 0) {
            const formData = new FormData()
            formData.append('request', JSON.stringify(studentRequest))
            formData.append('file', image)
            // console.log("🚀 ~ file: Teachers.js:300 ~ updateTeacher ~ image:", image);
            var id = null
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                setLoadingRequest(true)
                const resp = await accountApi.addAccount(formData)
                console.log(
                    '🚀 ~ file: Accounts.js:1097 ~ createStudent ~ resp:',
                    resp
                )
                if (resp.status === 200) {
                    setLoadingRequest(false)
                    toast.update(id, Notify.options.createSuccess())

                    update_success('Thêm dữ liệu thành công')
                    handleResetForm_1()
                    // getAllStudent()
                    setStudents([resp.data, ...students])
                } else {
                    toast.update(id, Notify.options.createError())

                    setLoadingRequest(false)
                    if (resp.data.message === '1') {
                        //! cập nhật lại theo Notify
                        update_fail('Email đã được sử dụng')
                    } else {
                        toast.update(id, Notify.options.createError())

                        setLoadingRequest(false)
                    }
                }
            } catch (error) {
                setLoadingRequest(false)
                console.log('updateTeacher', error)
                toast.update(id, Notify.options.createError())
            }
        } else {
            setErrors_1(validate)
        }
    }

    // Cập nhật thông tin học viên
    const updateStudent = async () => {
        const validationErrors = validateForm_1()

        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData()
            formData.append('request', JSON.stringify(studentRequest))
            formData.append('file', image)
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                setLoadingRequest(true)
                const resp = await accountApi.updateAccount(formData)
                if (resp.status === 200) {
                    toast.update(id, Notify.options.updateSuccess())

                    handleResetForm_1()
                    // getAllStudent()
                    setLoadingRequest(false)

                    setStudents(
                        students.map((item) => {
                            if (item.id === student.id) {
                                return resp.data
                            }
                            return item
                        })
                    )
                } else {
                    toast.update(Notify.options.updateError())

                    setLoadingRequest(false)
                }
            } catch (error) {
                setLoadingRequest(false)
                toast.update(Notify.options.updateError())

                console.log('updateTeacher', error)
            }
        } else {
            setErrors_1(validationErrors)
        }
    }
    // Cập nhật thông tin giáo viên
    const updateTeacher = async () => {
        const validationErrors = validateForm_2()

        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData()
            formData.append('request', JSON.stringify(teacherRequest))
            formData.append('file', image)
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                setLoadingRequest(true)

                const resp = await accountApi.updateAccount(formData)
                if (resp.status === 200) {
                    toast.update(id, Notify.options.updateSuccess())
                    handleResetForm_2()
                    // getAllTeacher()
                    setTeachers(
                        teachers.map((item) => {
                            if (item.id === teacher.id) {
                                return resp.data
                            }
                            return item
                        })
                    )
                } else {
                    toast.update(Notify.options.updateError())

                    setLoadingRequest(false)
                }
            } catch (error) {
                console.log('updateTeacher', error)
                toast.update(Notify.options.updateError())

                setLoadingRequest(false)
            }
        } else {
            setErrors(validationErrors)
        }
    }

    // Thêm thông tin giáo viên
    const createTeacher = async () => {
        const validationErrors = validateForm_2()

        if (Object.keys(validationErrors).length == 0) {
            const formData = new FormData()
            formData.append('request', JSON.stringify(teacherRequest))
            formData.append('file', image)
            // console.log("🚀 ~ file: Teachers.js:300 ~ updateTeacher ~ image:", image);

            var id = null
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                setLoadingRequest(true)
                const resp = await accountApi.addAccount(formData)
                if (resp.status === 200) {
                    setLoadingRequest(false)
                    toast.update(id, Notify.options.createSuccess())
                    handleResetForm_2()
                    // getAllTeacher()
                    setTeachers([resp.data, ...teachers])
                } else {
                    toast.update(id, Notify.options.createError())

                    if (resp.data.message === '1') {
                        update_fail('Email đã được sử dụng')
                    } else {
                        setLoadingRequest(false)
                    }
                }
            } catch (error) {
                console.log('updateTeacher', error)
                toast.update(id, Notify.options.createError())
            }
        } else {
            setErrors(validationErrors)
        }
    }

    // Cập nhật thông tin giáo viên
    const updateAdmin = async () => {
        const validationErrors = validateForm_3()

        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData()
            formData.append('request', JSON.stringify(adminRequest))
            formData.append('file', image)

            const id = toast(Notify.msg.loading, Notify.options.loading())
            try {
                setLoadingRequest(true)

                const resp = await accountApi.updateAccount(formData)
                if (resp.status === 200) {
                    toast.update(id, Notify.options.updateSuccess())
                    setLoadingRequest(false)

                    handleResetForm_3()
                    // getAllAdmin()
                    setAdmins(
                        admins.map((item) => {
                            if (item.id === admin.id) {
                                return resp.data
                            }
                            return item
                        })
                    )
                } else {
                    toast.update(Notify.options.updateError())

                    setLoadingRequest(false)
                }
            } catch (error) {
                setLoadingRequest(false)
                toast.update(Notify.options.updateError())

                console.log('updateAdmin', error)
            }
        } else {
            setErrors(validationErrors)
        }
    }

    // Thêm thông tin giáo viên
    const createAdmin = async () => {
        const validationErrors = validateForm_3()

        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData()
            formData.append('request', JSON.stringify(adminRequest))
            formData.append('file', image)
            // console.log("🚀 ~ file: Teachers.js:300 ~ updateTeacher ~ image:", image);
            var id = null

            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                setLoadingRequest(true)

                const resp = await accountApi.addAccount(formData)
                console.log(
                    '🚀 ~ file: Accounts.js:1192 ~ getAllTeacher ~ resp:',
                    resp
                )
                if (resp.status === 200) {
                    handleResetForm_3()
                    // getAllAdmin()
                    setAdmins([resp.data, ...admins])
                    setLoadingRequest(false)
                    toast.update(id, Notify.options.createSuccess())
                } else {
                    toast.update(id, Notify.options.createError())

                    setLoadingRequest(false)

                    if (resp.data.message === '1') {
                        update_fail('Email đã được sử dụng')
                    } else {
                        toast.update(id, Notify.options.createError())

                        setLoadingRequest(false)
                    }
                }
            } catch (error) {
                console.log('updateTeacher', error)
                toast.update(id, Notify.options.createError())
            }
        } else {
            setErrors(validationErrors)
        }
    }

    //gọi API lấy data với vai trò giáo viên
    const getAllTeacher = async () => {
        console.log('getAllTeacher ~ teachers:', teachers)
        try {
            setLoadingTeachers(true)
            const resp = await accountApi.getAllAccountsByRole(2)
            console.log(
                '🚀 ~ file: Accounts.js:1196 ~ getAllTeacher ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setTeachers(resp.data.reverse())
            } else {
                setTeachers([])
            }

            setLoadingTeachers(false)
        } catch (error) {
            console.log('failed to load data', error)
            setTeachers([])
            setLoadingTeachers(false)
            notifi('Lỗi kết nối server', 'ERROR')
        }
    }

    // Lấy thông tin với vai trò học viên
    const getAllStudent = async () => {
        // if (students.length > 0) {
        //   setLoadingStudents(false);
        //   return;
        // }

        try {
            setLoadingStudents(true)
            const resp = await accountApi.getAllAccountsByRole(1)
            console.log(
                '🚀 ~ file: Accounts.js:1226 ~ getAllStudent ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setStudents(resp.data.reverse())
            } else {
                setStudents([])
            }
            setLoadingStudents(false)
        } catch (error) {
            console.log('failed to load data', error)
            setStudents([])
            setLoadingStudents(false)
            notifi('Lỗi kết nối server', 'ERROR')
        }
    }

    // Lấy thông tin với vai trò là Admin
    const getAllAdmin = async () => {
        // if (admins.length > 0) {
        //   setLoadingAdmins(false);
        //   return;
        // }

        try {
            setLoadingAdmins(true)
            const resp = await accountApi.getAllAccountsByRole(3)
            console.log(
                '🚀 ~ file: Accounts.js:1250 ~ getAllAdmin ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setAdmins(resp.data.reverse())
            } else {
                setAdmins([])
            }
            setLoadingAdmins(false)
        } catch (error) {
            console.log('failed to load data', error)
            setAdmins([])
            setLoadingAdmins(false)
            notifi('Lỗi kết nối server', 'ERROR')
        }
    }

    const setGender_1 = (gender) => {
        setStudent((preStudent) => ({
            ...preStudent,
            student: {
                ...preStudent.student,
                gender: gender
            }
        }))
    }

    const setGender_2 = (gender) => {
        setTeacher((preTeacher) => ({
            ...preTeacher,
            teacher: {
                ...preTeacher.teacher,
                gender: gender
            }
        }))
    }

    const setGender_3 = (gender) => {
        setAdmin((preAdmin) => ({
            ...preAdmin,
            admin: {
                ...preAdmin.admin,
                gender: gender
            }
        }))
    }

    const setStatus_1 = (status) => {
        setStudent((preStudent) => ({
            ...preStudent,
            status: status
        }))
    }

    const setStatus_2 = (status) => {
        setTeacher((preTeacher) => ({
            ...preTeacher,
            status: status
        }))
    }

    const setStatus_3 = (status) => {
        setAdmin((prevAdmin) => ({
            ...prevAdmin,
            status: status
        }))
    }

    //thay đổi dữ liệu của teacher để gửi request đến server
    //teacherRequest
    useEffect(() => {
        const {
            id,
            username,
            password,
            email,
            status,
            teacher: {
                teacherId,
                fullname,
                gender,
                dateOfBirth,
                citizenIdentification,
                levels,
                address,
                phone,
                image
            }
        } = { ...teacher }
        setTeacherRequest({
            id: id,
            username: username,
            password: password,
            email: email,
            status: status,
            roles: 2,
            teacher: {
                teacherId: teacherId,
                fullname: fullname,
                gender: gender,
                dateOfBirth: dateOfBirth,
                citizenIdentification: citizenIdentification,
                levels: levels,
                address: address,
                phone: phone,
                image: image
            }
        })
    }, [teacher])

    useEffect(() => {
        const {
            id,
            username,
            password,
            email,
            status,
            student: { studentId, fullname, gender, address, phone, image }
        } = { ...student }
        setStudentRequest({
            id: id,
            username: username,
            password: password,
            email: email,
            status: status,
            roles: 1,
            student: {
                studentId: studentId,
                fullname: fullname,
                gender: gender,
                address: address,
                phone: phone,
                image: image
            }
        })
    }, [student])

    //load data của 3 vai trò lên table
    useEffect(() => {
        // if (teachers.length > 0) return;
        getAllStudent()
        getAllTeacher()
        getAllAdmin()
    }, [])

    useEffect(() => {
        const {
            id,
            username,
            password,
            email,
            roles,
            status,
            admin: {
                adminId,
                fullname,
                gender,
                dateOfBirth,
                citizenIdentification,
                levels,
                address,
                phone,
                image
            }
        } = { ...admin }
        setAdminRequest({
            id: id,
            username: username,
            password: password,
            email: email,
            status: status,
            roles: 3,
            admin: {
                adminId: adminId,
                fullname: fullname,
                gender: gender,
                dateOfBirth: dateOfBirth,
                citizenIdentification: citizenIdentification,
                levels: levels,
                address: address,
                phone: phone,
                image: image
            }
        })
    }, [admin])

    return (
        <>
            <ToastContainer />
            <AccountHeader />
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    <CardBody>
                        <Tabs
                            defaultActiveKey="sinhVien"
                            id="fill-tab-example"
                            className="mb-3"
                            fill
                        >
                            <Tab
                                eventKey="sinhVien"
                                title={<strong>Sinh viên</strong>}
                            >
                                <MaterialReactTable
                                    enableColumnResizing
                                    enableGrouping
                                    enableStickyHeader
                                    enableStickyFooter
                                    enableRowNumbers
                                    state={{ isLoading: loadingStudents }}
                                    displayColumnDefOptions={{
                                        'mrt-row-actions': {
                                            header: 'Thao tác',
                                            size: 20
                                        },
                                        'mrt-row-numbers': {
                                            size: 5
                                        }
                                    }}
                                    positionActionsColumn="last"
                                    columns={columns_student}
                                    data={students}
                                    renderTopToolbarCustomActions={() => (
                                        <Button
                                            onClick={() => {
                                                handleResetForm_1()
                                            }}
                                            color="success"
                                            variant="contained"
                                        >
                                            <i className="bx bx-layer-plus"></i>
                                            Thêm học viên
                                        </Button>
                                    )}
                                    enableRowActions
                                    renderRowActions={({ row, table }) => (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                gap: '8px'
                                            }}
                                        >
                                            <IconButton
                                                color="secondary"
                                                onClick={() => {
                                                    handleEditFrom_1(row)
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {/* <IconButton
                        color="info"
                        onClick={() => {
                          // handelShowHistory(row.original.teacherId);
                        }}
                      >
                        <IconEyeSearch />
                      </IconButton> */}
                                        </Box>
                                    )}
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [10, 20, 50, 100],
                                        showFirstButton: true,
                                        showLastButton: true
                                    }}
                                />
                            </Tab>

                            <Tab
                                eventKey="gaingVien"
                                className="bold-title"
                                title={<strong>Giáo viên</strong>}
                            >
                                <MaterialReactTable
                                    enableColumnResizing
                                    enableGrouping
                                    enableStickyHeader
                                    enableStickyFooter
                                    enableRowNumbers
                                    state={{ isLoading: loadingTeachers }}
                                    displayColumnDefOptions={{
                                        'mrt-row-actions': {
                                            header: 'Thao tác',
                                            size: 20
                                        },
                                        'mrt-row-numbers': {
                                            size: 5
                                        }
                                    }}
                                    positionActionsColumn="last"
                                    columns={columns_teacher}
                                    data={teachers}
                                    renderTopToolbarCustomActions={() => (
                                        <Button
                                            onClick={() => {
                                                handleResetForm_2()
                                            }}
                                            color="success"
                                            variant="contained"
                                        >
                                            <i className="bx bx-layer-plus"></i>
                                            Thêm giáo viên
                                        </Button>
                                    )}
                                    enableRowActions
                                    renderRowActions={({ row, table }) => (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                gap: '8px'
                                            }}
                                        >
                                            <IconButton
                                                color="secondary"
                                                onClick={() => {
                                                    handleEditFrom_2(row)
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {/* <IconButton
                        color="info"
                        onClick={() => {
                          console.log(row.original.teacherId);
                          // handelShowHistory(row.original.teacherId);
                        }}
                      >
                        <IconEyeSearch />
                      </IconButton> */}
                                        </Box>
                                    )}
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [10, 20, 50, 100],
                                        showFirstButton: true,
                                        showLastButton: true
                                    }}
                                />
                            </Tab>

                            <Tab
                                eventKey="Admin"
                                title={<strong>Quản trị</strong>}
                            >
                                <MaterialReactTable
                                    enableColumnResizing
                                    enableGrouping
                                    enableStickyHeader
                                    enableStickyFooter
                                    enableRowNumbers
                                    state={{ isLoading: loadingAdmins }}
                                    displayColumnDefOptions={{
                                        'mrt-row-actions': {
                                            header: 'Thao tác',
                                            size: 20
                                            // Something else here
                                        },
                                        'mrt-row-numbers': {
                                            size: 5
                                        }
                                    }}
                                    positionActionsColumn="last"
                                    columns={columns_admin}
                                    data={admins}
                                    renderTopToolbarCustomActions={() => (
                                        <Button
                                            onClick={() => {
                                                handleResetForm_3()
                                            }}
                                            color="success"
                                            variant="contained"
                                        >
                                            <i className="bx bx-layer-plus"></i>
                                            Thêm quản trị viên
                                        </Button>
                                    )}
                                    enableRowActions
                                    renderRowActions={({ row, table }) => (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                gap: '8px'
                                            }}
                                        >
                                            <IconButton
                                                color="secondary"
                                                onClick={() => {
                                                    handleEditFrom_3(row)
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {/* <IconButton
                        color="info"
                        onClick={() => {
                          console.log(row.original.teacherId);
                          // handelShowHistory(row.original.teacherId);
                        }}
                      >
                        <IconEyeSearch />
                      </IconButton> */}
                                        </Box>
                                    )}
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [10, 20, 50, 100],
                                        showFirstButton: true,
                                        showLastButton: true
                                    }}
                                />
                            </Tab>
                        </Tabs>

                        {/* Model thông tin tài khoản học viên */}
                        <Modal
                            className="modal-dialog-centered  modal-lg "
                            isOpen={showForm_1}
                            backdrop="static"
                            toggle={() => handleResetForm_1()}
                        >
                            <Form
                                onSubmit={handleSubmitForm_1}
                                encType="multipart/form-data"
                            >
                                <LoadingOverlay
                                    visible={loadingRequest}
                                    overlayBlur={2}
                                />
                                <div className="modal-header">
                                    <h3 className="mb-0">
                                        Thông tin tài khoản
                                    </h3>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm_1}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="px-lg-2">
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Email
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Email tài khoản"
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput_1
                                                        }
                                                        name="email"
                                                        readOnly={update}
                                                        value={student.email}
                                                    />
                                                    {errors_1.email && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors_1.email}
                                                        </div>
                                                    )}
                                                    <br />
                                                    <label
                                                        hidden={update}
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Password
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Password"
                                                        type="password"
                                                        onChange={
                                                            handelOnChangeInput_1
                                                        }
                                                        name="password"
                                                        hidden={update}
                                                        value={student.password}
                                                    />
                                                    {errors_1.password && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors_1.password}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    Trạng thái
                                                </label>
                                                <br></br>
                                                <ButtonGroup>
                                                    <Button
                                                        color="success"
                                                        outline
                                                        onClick={() =>
                                                            setStatus_1(true)
                                                        }
                                                        active={
                                                            student.status ===
                                                            true
                                                        }
                                                    >
                                                        Mở khóa
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        outline
                                                        name="gender"
                                                        onClick={() =>
                                                            setStatus_1(false)
                                                        }
                                                        active={
                                                            student.status ===
                                                            false
                                                        }
                                                    >
                                                        Khóa
                                                    </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Tên học viên
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Tên học viên"
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput_1
                                                        }
                                                        name="fullname"
                                                        value={
                                                            student.student
                                                                .fullname
                                                        }
                                                    />
                                                    {errors_1.fullname && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors_1.fullname}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Số điện thoại
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-course-name"
                                                                placeholder="Số điện thoại"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_1
                                                                }
                                                                name="phone"
                                                                value={
                                                                    student
                                                                        .student
                                                                        .phone
                                                                }
                                                            />
                                                            {errors_1.phone && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors_1.phone
                                                                    }
                                                                </div>
                                                            )}
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Địa chỉ
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-courseDescription"
                                                                name="address"
                                                                placeholder="Địa chỉ..."
                                                                value={
                                                                    student
                                                                        .student
                                                                        .address
                                                                }
                                                                type="textarea"
                                                                onChange={
                                                                    handelOnChangeInput_1
                                                                }
                                                            />
                                                            {errors_1.address && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors_1.address
                                                                    }
                                                                </div>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Giới tính
                                                            </label>
                                                            <br />
                                                            <ButtonGroup>
                                                                <Button
                                                                    color="primary"
                                                                    outline
                                                                    onClick={() =>
                                                                        setGender_1(
                                                                            true
                                                                        )
                                                                    }
                                                                    active={
                                                                        student
                                                                            .student
                                                                            .gender ===
                                                                        true
                                                                    }
                                                                >
                                                                    Nam
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    outline
                                                                    name="gender"
                                                                    onClick={() =>
                                                                        setGender_1(
                                                                            false
                                                                        )
                                                                    }
                                                                    active={
                                                                        student
                                                                            .student
                                                                            .gender ===
                                                                        false
                                                                    }
                                                                >
                                                                    Nữ
                                                                </Button>
                                                            </ButtonGroup>
                                                            <br />
                                                            <br />
                                                            <Label
                                                                htmlFor="exampleFile"
                                                                className="form-control-label"
                                                            >
                                                                Ảnh đại diện
                                                                {/* học viên */}
                                                            </Label>
                                                            <FormGroup className="d-none">
                                                                <div className="custom-file">
                                                                    <input
                                                                        ref={
                                                                            fileInputRef
                                                                        }
                                                                        type="file"
                                                                        name="imageFile"
                                                                        accept="image/*"
                                                                        id="customFile"
                                                                        onChange={
                                                                            onChangePicture
                                                                        }
                                                                        // multiple={true}
                                                                    />
                                                                    <label
                                                                        className="custom-file-label"
                                                                        htmlFor="customFile"
                                                                    >
                                                                        {imgData
                                                                            ? 'Chọn một ảnh khác'
                                                                            : 'Chọn hình ảnh'}
                                                                    </label>
                                                                </div>
                                                            </FormGroup>
                                                            <div
                                                                className="previewProfilePic px-3 border d-flex justify-content-center"
                                                                style={{
                                                                    height: '200px',
                                                                    overflow:
                                                                        'hidden',
                                                                    position:
                                                                        'relative',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={
                                                                    handleImageClick
                                                                }
                                                            >
                                                                {imgData && (
                                                                    <img
                                                                        alt=""
                                                                        // width={120}
                                                                        className="playerProfilePic_home_tile"
                                                                        src={
                                                                            imgData
                                                                        }
                                                                    />
                                                                )}
                                                                {update &&
                                                                    !imgData && (
                                                                        <img
                                                                            alt=""
                                                                            className=""
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .REACT_APP_IMAGE_URL +
                                                                                IMG_URL +
                                                                                student
                                                                                    .student
                                                                                    .image
                                                                            }
                                                                        />
                                                                    )}
                                                                <small
                                                                    className={` position-absolute  text-center `}
                                                                    style={{
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform:
                                                                            'translate(-50%, -50%)',
                                                                        textAlign:
                                                                            'center'
                                                                    }}
                                                                >
                                                                    {student
                                                                        .student
                                                                        .image ===
                                                                    ''
                                                                        ? 'Nhấn chọn ảnh cho học viên'
                                                                        : null}
                                                                </small>
                                                            </div>
                                                            {/* <div className="custom-file">
                                                                <input
                                                                    type="file"
                                                                    name="imageFile"
                                                                    accept="image/*"
                                                                    className="custom-file-input form-control-alternative"
                                                                    id="customFile"
                                                                    onChange={
                                                                        onChangePicture_1
                                                                    }
                                                                />
                                                                <label
                                                                    className="custom-file-label"
                                                                    htmlFor="customFile"
                                                                >
                                                                    Chọn hình
                                                                    ảnh
                                                                </label>
                                                            </div> */}
                                                        </FormGroup>
                                                    </Col>
                                                    {/* <div className="previewProfilePic px-3">
                                                        {imgData && (
                                                            <img
                                                                alt=""
                                                                width={350}
                                                                className="playerProfilePic_home_tile"
                                                                src={imgData}
                                                            />
                                                        )}
                                                        {!imgData && (
                                                            <img
                                                                alt=""
                                                                width={350}
                                                                className=""
                                                                src={
                                                                    process.env
                                                                        .REACT_APP_IMAGE_URL +
                                                                    IMG_URL +
                                                                    student
                                                                        .student
                                                                        .image
                                                                }
                                                            />
                                                        )}
                                                        {!student.student
                                                            .image &&
                                                            !imgData && (
                                                                <img
                                                                    alt=""
                                                                    width={350}
                                                                    className=""
                                                                    src={
                                                                        process
                                                                            .env
                                                                            .REACT_APP_IMAGE_URL +
                                                                        IMG_URL +
                                                                        'defaultImgUser.jpg'
                                                                    }
                                                                />
                                                            )}
                                                    </div> */}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                </div>
                                <div className="modal-footer">
                                    <Button
                                        color="secondary"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm_1}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        className="px-5"
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </Form>
                        </Modal>

                        {/* Model thông tin giáo viên */}
                        <Modal
                            className="modal-dialog-centered  modal-lg "
                            isOpen={showForm_2}
                            backdrop="static"
                            toggle={() => handleResetForm_2()}
                        >
                            <Form
                                onSubmit={handleSubmitForm_2}
                                encType="multipart/form-data"
                            >
                                <LoadingOverlay
                                    visible={loadingRequest}
                                    overlayBlur={2}
                                />
                                <div className="modal-header">
                                    <h3 className="mb-0">
                                        Thông tin tài khoản
                                    </h3>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm_2}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="px-lg-2">
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Email
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Email tài khoản"
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput_2
                                                        }
                                                        name="email"
                                                        readOnly={update}
                                                        value={teacher.email}
                                                    />
                                                    {errors.email && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.email}
                                                        </div>
                                                    )}
                                                    <br />
                                                    <label
                                                        hidden={update}
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Password
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Password"
                                                        type="password"
                                                        onChange={
                                                            handelOnChangeInput_2
                                                        }
                                                        name="password"
                                                        hidden={update}
                                                        value={teacher.password}
                                                    />
                                                    {errors.password && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.password}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    Trạng thái
                                                </label>
                                                <br></br>
                                                <ButtonGroup>
                                                    <Button
                                                        color="success"
                                                        outline
                                                        onClick={() =>
                                                            setStatus_2(true)
                                                        }
                                                        active={
                                                            teacher.status ===
                                                            true
                                                        }
                                                    >
                                                        Mở khóa
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        outline
                                                        name="gender"
                                                        onClick={() =>
                                                            setStatus_2(false)
                                                        }
                                                        active={
                                                            teacher.status ===
                                                            false
                                                        }
                                                    >
                                                        Khóa
                                                    </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                        <br />
                                        <h3>Thông tin giáo viên</h3>
                                        <hr />
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Tên giáo viên
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Tên giáo viên"
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput_2
                                                        }
                                                        name="fullname"
                                                        value={
                                                            teacher.teacher
                                                                .fullname
                                                        }
                                                    />
                                                    {errors.fullname && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.fullname}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Trình độ học vấn
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-course-name"
                                                                placeholder="Trình độ học vấn"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_2
                                                                }
                                                                name="levels"
                                                                value={
                                                                    teacher
                                                                        .teacher
                                                                        .levels
                                                                }
                                                            />
                                                            {errors.levels && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.levels
                                                                    }
                                                                </div>
                                                            )}
                                                            <br></br>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Số điện thoại
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-course-name"
                                                                placeholder="Số điện thoại"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_2
                                                                }
                                                                name="phone"
                                                                value={
                                                                    teacher
                                                                        .teacher
                                                                        .phone
                                                                }
                                                            />
                                                            {errors.phone && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.phone
                                                                    }
                                                                </div>
                                                            )}
                                                            <br></br>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="citizenIdentification"
                                                            >
                                                                Số CCCD
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="citizenIdentification"
                                                                placeholder="Số CCCD"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_2
                                                                }
                                                                name="citizenIdentification"
                                                                value={
                                                                    teacher
                                                                        .teacher
                                                                        .citizenIdentification
                                                                }
                                                            />
                                                            {errors.citizenIdentification && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.citizenIdentification
                                                                    }
                                                                </div>
                                                            )}
                                                            <br></br>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Ngày sinh
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                // value={teacher.dateOfBirth}
                                                                value={moment(
                                                                    teacher
                                                                        .teacher
                                                                        .dateOfBirth
                                                                ).format(
                                                                    'YYYY-MM-DD'
                                                                )}
                                                                // pattern="yyyy-MM-dd"
                                                                id="input-coursePrice"
                                                                type="date"
                                                                name="dateOfBirth"
                                                                onChange={
                                                                    handelOnChangeInput_2
                                                                }
                                                            />
                                                            {errors.dateOfBirth && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.dateOfBirth
                                                                    }
                                                                </div>
                                                            )}
                                                            <br />
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Địa chỉ
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-courseDescription"
                                                                name="address"
                                                                placeholder="Địa chỉ..."
                                                                value={
                                                                    teacher
                                                                        .teacher
                                                                        .address
                                                                }
                                                                type="textarea"
                                                                onChange={
                                                                    handelOnChangeInput_2
                                                                }
                                                            />
                                                            {errors.address && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.address
                                                                    }
                                                                </div>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            {/* <Col md={12}> */}
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Giới tính
                                                            </label>
                                                            <br />
                                                            <ButtonGroup>
                                                                <Button
                                                                    color="primary"
                                                                    outline
                                                                    onClick={() =>
                                                                        setGender_2(
                                                                            true
                                                                        )
                                                                    }
                                                                    active={
                                                                        teacher
                                                                            .teacher
                                                                            .gender ===
                                                                        true
                                                                    }
                                                                >
                                                                    Nam
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    outline
                                                                    name="gender"
                                                                    onClick={() =>
                                                                        setGender_2(
                                                                            false
                                                                        )
                                                                    }
                                                                    active={
                                                                        teacher
                                                                            .teacher
                                                                            .gender ===
                                                                        false
                                                                    }
                                                                >
                                                                    Nữ
                                                                </Button>
                                                            </ButtonGroup>
                                                            {/* </Col> */}
                                                            <br />
                                                            <br></br>
                                                            <Label
                                                                htmlFor="exampleFile"
                                                                className="form-control-label"
                                                            >
                                                                Ảnh đại diện
                                                                {/* teacher */}
                                                            </Label>
                                                            <FormGroup className="d-none">
                                                                <div className="custom-file">
                                                                    <input
                                                                        ref={
                                                                            fileInputRef
                                                                        }
                                                                        type="file"
                                                                        name="imageFile"
                                                                        accept="image/*"
                                                                        id="customFile"
                                                                        onChange={
                                                                            onChangePicture
                                                                        }
                                                                        // multiple={true}
                                                                    />
                                                                </div>
                                                            </FormGroup>
                                                            <div
                                                                className="previewProfilePic px-3 border d-flex justify-content-center"
                                                                style={{
                                                                    height: '200px',
                                                                    overflow:
                                                                        'hidden',
                                                                    position:
                                                                        'relative',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={
                                                                    handleImageClick
                                                                }
                                                            >
                                                                {imgData && (
                                                                    <img
                                                                        alt=""
                                                                        // width={120}
                                                                        className="playerProfilePic_home_tile"
                                                                        src={
                                                                            imgData
                                                                        }
                                                                    />
                                                                )}
                                                                {update &&
                                                                    !imgData && (
                                                                        <img
                                                                            alt=""
                                                                            className=""
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .REACT_APP_IMAGE_URL +
                                                                                IMG_URL +
                                                                                teacher
                                                                                    .teacher
                                                                                    .image
                                                                            }
                                                                        />
                                                                    )}
                                                                <small
                                                                    className={` position-absolute  text-center `}
                                                                    style={{
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform:
                                                                            'translate(-50%, -50%)',
                                                                        textAlign:
                                                                            'center'
                                                                    }}
                                                                >
                                                                    {teacher
                                                                        .teacher
                                                                        .image ===
                                                                    ''
                                                                        ? 'Nhấn chọn ảnh cho giáo viên'
                                                                        : null}
                                                                </small>
                                                            </div>
                                                        </FormGroup>
                                                    </Col>

                                                    {!teacher.teacher.image &&
                                                        !imgData && (
                                                            <img
                                                                alt=""
                                                                width={350}
                                                                className=""
                                                                src={
                                                                    process.env
                                                                        .REACT_APP_IMAGE_URL +
                                                                    IMG_URL +
                                                                    'defaultImgUser.jpg'
                                                                }
                                                            />
                                                        )}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                </div>
                                <div className="modal-footer">
                                    <Button
                                        color="secondary"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm_2}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        className="px-5"
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </Form>
                        </Modal>

                        {/* Model thông tin quản trị viên */}
                        <Modal
                            className="modal-dialog-centered  modal-lg "
                            isOpen={showForm_3}
                            backdrop="static"
                            toggle={() => handleResetForm_3()}
                        >
                            <Form
                                onSubmit={handleSubmitForm_3}
                                encType="multipart/form-data"
                            >
                                <LoadingOverlay
                                    visible={loadingRequest}
                                    overlayBlur={2}
                                />
                                <div className="modal-header">
                                    <h3 className="mb-0">
                                        Thông tin tài khoản
                                    </h3>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm_3}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="px-lg-2">
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Email
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Email tài khoản"
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput_3
                                                        }
                                                        name="email"
                                                        readOnly={update}
                                                        value={admin.email}
                                                    />
                                                    {errors.email && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.email}
                                                        </div>
                                                    )}
                                                    <br />
                                                    <label
                                                        hidden={update}
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Password
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Password"
                                                        type="password"
                                                        onChange={
                                                            handelOnChangeInput_3
                                                        }
                                                        name="password"
                                                        hidden={update}
                                                        value={admin.password}
                                                    />
                                                    {errors.password && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.password}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    Trạng thái
                                                </label>
                                                <br></br>
                                                <ButtonGroup>
                                                    <Button
                                                        color="success"
                                                        outline
                                                        onClick={() =>
                                                            setStatus_3(true)
                                                        }
                                                        active={
                                                            admin.status ===
                                                            true
                                                        }
                                                    >
                                                        Mở khóa
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        outline
                                                        name="gender"
                                                        onClick={() =>
                                                            setStatus_3(false)
                                                        }
                                                        active={
                                                            admin.status ===
                                                            false
                                                        }
                                                    >
                                                        Khóa
                                                    </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                        <br />
                                        <h3>Thông tin quản trị viên</h3>
                                        <hr />
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Tên quản trị viên
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Tên quản trị viên"
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput_3
                                                        }
                                                        name="fullname"
                                                        value={
                                                            admin.admin.fullname
                                                        }
                                                    />
                                                    {errors.fullname && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.fullname}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Trình độ học vấn
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-course-name"
                                                                placeholder="Trình độ học vấn"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_3
                                                                }
                                                                name="levels"
                                                                value={
                                                                    admin.admin
                                                                        .levels
                                                                }
                                                            />
                                                            {errors.levels && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.levels
                                                                    }
                                                                </div>
                                                            )}
                                                            <br></br>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Số điện thoại
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-course-name"
                                                                placeholder="Số điện thoại"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_3
                                                                }
                                                                name="phone"
                                                                value={
                                                                    admin.admin
                                                                        .phone
                                                                }
                                                            />
                                                            {errors.phone && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.phone
                                                                    }
                                                                </div>
                                                            )}
                                                            <br></br>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="citizenIdentification"
                                                            >
                                                                Số CCCD
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                id="citizenIdentification"
                                                                placeholder="Số CCCD"
                                                                type="text"
                                                                onChange={
                                                                    handelOnChangeInput_3
                                                                }
                                                                name="citizenIdentification"
                                                                value={
                                                                    admin.admin
                                                                        .citizenIdentification
                                                                }
                                                            />
                                                            {errors.citizenIdentification && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.citizenIdentification
                                                                    }
                                                                </div>
                                                            )}
                                                            <br></br>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Ngày sinh
                                                            </label>

                                                            <Input
                                                                className="form-control-alternative"
                                                                // value={teacher.dateOfBirth}
                                                                value={moment(
                                                                    admin.admin
                                                                        .dateOfBirth
                                                                ).format(
                                                                    'YYYY-MM-DD'
                                                                )}
                                                                // pattern="yyyy-MM-dd"
                                                                id="input-coursePrice"
                                                                type="date"
                                                                name="dateOfBirth"
                                                                onChange={
                                                                    handelOnChangeInput_3
                                                                }
                                                            />
                                                            {errors.dateOfBirth && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.dateOfBirth
                                                                    }
                                                                </div>
                                                            )}
                                                            <br />
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Địa chỉ
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-courseDescription"
                                                                name="address"
                                                                placeholder="Địa chỉ..."
                                                                value={
                                                                    admin.admin
                                                                        .address
                                                                }
                                                                type="textarea"
                                                                onChange={
                                                                    handelOnChangeInput_3
                                                                }
                                                            />
                                                            {errors.address && (
                                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                                    {
                                                                        errors.address
                                                                    }
                                                                </div>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            {/* <Col md={12}> */}
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Giới tính
                                                            </label>
                                                            <br />
                                                            <ButtonGroup>
                                                                <Button
                                                                    color="primary"
                                                                    outline
                                                                    onClick={() =>
                                                                        setGender_3(
                                                                            true
                                                                        )
                                                                    }
                                                                    active={
                                                                        admin
                                                                            .admin
                                                                            .gender ===
                                                                        true
                                                                    }
                                                                >
                                                                    Nam
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    outline
                                                                    name="gender"
                                                                    onClick={() =>
                                                                        setGender_3(
                                                                            false
                                                                        )
                                                                    }
                                                                    active={
                                                                        admin
                                                                            .admin
                                                                            .gender ===
                                                                        false
                                                                    }
                                                                >
                                                                    Nữ
                                                                </Button>
                                                            </ButtonGroup>
                                                            {/* </Col> */}
                                                            <br />
                                                            <br></br>
                                                            <Label
                                                                htmlFor="exampleFile"
                                                                className="form-control-label"
                                                            >
                                                                Ảnh đại diện
                                                                {/* admin */}
                                                            </Label>
                                                            <FormGroup className="d-none">
                                                                <div className="custom-file">
                                                                    <input
                                                                        ref={
                                                                            fileInputRef
                                                                        }
                                                                        type="file"
                                                                        name="imageFile"
                                                                        accept="image/*"
                                                                        id="customFile"
                                                                        onChange={
                                                                            onChangePicture
                                                                        }
                                                                        // multiple={true}
                                                                    />
                                                                </div>
                                                            </FormGroup>
                                                            <div
                                                                className="previewProfilePic px-3 border d-flex justify-content-center"
                                                                style={{
                                                                    height: '200px',
                                                                    overflow:
                                                                        'hidden',
                                                                    position:
                                                                        'relative',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={
                                                                    handleImageClick
                                                                }
                                                            >
                                                                {imgData && (
                                                                    <img
                                                                        alt=""
                                                                        // width={120}
                                                                        className="playerProfilePic_home_tile"
                                                                        src={
                                                                            imgData
                                                                        }
                                                                    />
                                                                )}
                                                                {update &&
                                                                    !imgData && (
                                                                        <img
                                                                            alt=""
                                                                            className=""
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .REACT_APP_IMAGE_URL +
                                                                                IMG_URL +
                                                                                admin
                                                                                    .admin
                                                                                    .image
                                                                            }
                                                                        />
                                                                    )}
                                                                <small
                                                                    className={` position-absolute  text-center `}
                                                                    style={{
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform:
                                                                            'translate(-50%, -50%)',
                                                                        textAlign:
                                                                            'center'
                                                                    }}
                                                                >
                                                                    {admin.admin
                                                                        .image ===
                                                                    ''
                                                                        ? 'Nhấn chọn ảnh cho quản trị viên'
                                                                        : null}
                                                                </small>
                                                            </div>
                                                        </FormGroup>
                                                    </Col>

                                                    {!admin.admin.image &&
                                                        !imgData && (
                                                            <img
                                                                alt=""
                                                                width={350}
                                                                className=""
                                                                src={
                                                                    process.env
                                                                        .REACT_APP_IMAGE_URL +
                                                                    IMG_URL +
                                                                    'defaultImgUser.jpg'
                                                                }
                                                            />
                                                        )}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                </div>
                                <div className="modal-footer">
                                    <Button
                                        color="secondary"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm_3}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        className="px-5"
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </Form>
                        </Modal>
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}
export default memo(Accounts)
