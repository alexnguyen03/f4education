import Index from './views/Index.js'
import Register from './views/examples/Register.js'
import ClientRegister from 'views/client/visitor/Register.js'
import Subjects from 'views/admin/Subjects'
import Sessions from 'views/admin/Sessions'
import Courses from 'views/admin/Courses.js'
import Teachers from 'views/admin/Teachers.js'
import Classs from 'views/admin/Classs.js'
import ClasssRoom from 'views/admin/ClasssRoom.js'
import Resources from 'views/admin/Resources.js'
import ResourceDetail from 'views/admin/ResourceDetail'
import Questions from 'views/admin/Questions'
import QuestionDetail from 'views/admin/QuestionDetail'
import Home from '../../../f4education/frontend/src/views/client/visitor/Home'
import CourseClient from '../../../f4education/frontend/src/views/client/visitor/CourseClient'
import TeacherResources from 'views/teacher/TeacherResources'
import Cart from '../../../f4education/frontend/src/views/client/visitor/Cart'
import CheckMail from 'views/client/visitor/CheckMail'
import Checkout from '../../../f4education/frontend/src/views/client/visitor/Checkout'
import ClassDetail from 'views/admin/ClassDetail'
import Login from './views/examples/Login'

import CourseDetailClient from './views/client/visitor/CourseDetailClient'
import CourseRegisterClient from './views/client/visitor/CourseRegisterClient'
import InformationTeacher from './views/teacher/information'
import StudentInformation from './views/client/visitor/StudentInformation'
import QuizzClient from './views/client/visitor/QuizzClient'

import Accounts from './views/admin/Accounts'
import Schedules from './views/admin/Schedules'

import Icons from './views/examples/Icons'
import ClassInformation from './views/teacher/ClassInformation'
import ClassInformationDetail from './views/teacher/ClassInformationDetail'
import CourseProgress from './views/client/student/CourseProgress'
import StudentHome from './views/client/student/StudentHome'
import SubmitHomework from 'views/client/student/SubmitHomework'
import CoursesDetail from './views/admin/CoursesDetail'
import DownloadRecource from './views/client/student/DownloadRecource'
import CertificatePDF from './views/PDF/CertificatePDF'
import DownloadTaskStudent from 'views/teacher/DownloadTaskStudent'
import Points from './views/teacher/Points'
import LearningResult from './views/client/student/LearningResult'
import EvaluateTeacherCompleted from './views/client/student/EvaluateTeacherCompleted'
import EvaluateTeacher from './views/client/student/EvaluateTeacher'
import EvaluateTeacherViewByTeacher from './views/client/student/EvaluateTeacherViewByTeacher.js'
import PaymentHistory from 'views/client/student/PaymentHistory'
import ClassResult from 'views/teacher/ClassResult'
import TeacherSchedule from 'views/teacher/TeacherSchedule'
import TaskTeacher from 'views/teacher/TaskTeacher'
import Attendance from 'views/client/student/Attendance.js'

export var routes = [
    {
        path: '/index',
        name: 'Dashboard',
        icon: 'ni ni-tv-2 text-primary',
        component: <Index />,
        layout: '/admin'
    },

    {
        path: '/teachers',
        name: 'Giảng viên',
        icon: 'fa-solid fa-user-tie text-primary',
        component: <Teachers />,
        layout: '/admin'
    },
    {
        path: '/subjects',
        name: 'Môn học',
        icon: 'ni ni-books text-blue',
        component: <Subjects />,
        layout: '/admin'
    },
    {
        path: '/sessions',
        name: 'Ca học',
        icon: 'fa-regular fa-clock',
        component: <Sessions />,
        layout: '/admin'
    },
    {
        path: '/courses',
        name: 'Khóa học',
        icon: 'fa-solid fa-list-ul text-yellow',
        component: <Courses />,
        layout: '/admin'
    },
    {
        path: '/courses-detail/:courseId',
        component: <CoursesDetail />,
        layout: '/admin'
    },
    {
        path: '/class-room',
        name: 'Phòng học',
        icon: 'ni ni-single-02 text-yellow',
        component: <ClasssRoom />,
        layout: '/admin'
    },
    {
        path: '/register',
        name: 'Tài khoản',
        icon: 'ni ni-circle-08 text-pink',
        component: <Accounts />,
        layout: '/admin'
    },
    {
        path: '/classs',
        name: 'Lớp học',
        icon: 'fa-solid fa-users-line text-danger',
        component: <Classs />,
        layout: '/admin'
    },
    {
        path: '/class-detail/:classIdParam',
        name: 'Lớp học',
        icon: 'ni ni-single-02 text-yellow',
        component: <ClassDetail />,
        layout: '/admin'
    },
    {
        path: '/questions',
        name: 'Câu hỏi',
        icon: 'ni ni-ui-04 text-primary',
        component: <Questions />,
        layout: '/admin'
    },
    {
        path: '/schedule',
        name: 'Thời khóa biểu',
        icon: 'ni ni-ui-04 text-primary',
        component: <Schedules />,
        layout: '/admin'
    },

    {
        path: '/question-detail/:questionId',
        component: <QuestionDetail />,
        layout: '/admin'
    },

    {
        path: '/resources',
        name: 'Tài nguyên',
        icon: 'fa-solid fa-folder-open text-success',
        component: <Resources />,
        layout: '/admin'
    },
    {
        name: 'login',
        path: '/login',
        component: <Login />,
        layout: '/auth'
    },

    {
        path: '/question-detail/:questionId',
        component: <QuestionDetail />,
        layout: '/admin'
    },
    {
        path: '/resourceDetail/:courseName/:folderId',
        component: <ResourceDetail />,
        layout: '/admin'
    }
]

export var routesClient = [
    {
        path: '/',
        name: 'Trang chủ',
        icon: 'ni ni-tv-2 text-primary',
        component: <Home />,
        layout: '/client'
    },
    {
        path: '/courses',
        name: 'Khóa học',
        icon: 'ni ni-planet text-blue',
        component: <CourseClient />,
        layout: '/client'
    },
    {
        path: '/cart',
        name: 'Giỏ hàng',
        icon: 'ni ni-planet text-blue',
        component: <Cart />,
        layout: '/client'
    },
    {
        path: '/payment/checkout',
        component: <Checkout />,
        layout: '/client'
    },
    {
        path: '/course/:courseId',
        name: 'Khóa học chi tiết',
        icon: 'ni ni-planet text-blue',
        component: <CourseDetailClient />,
        layout: '/client'
    },
    {
        path: '/course-register',
        name: 'khóa học đăng ký',
        icon: 'ni ni-planet text-blue',
        component: <CourseRegisterClient />,
        layout: '/client'
    },
    // {
    //   path: "/course-register-detail/:courseId",
    //   name: "khóa học đăng ký chi tiết",
    //   icon: "ni ni-planet text-blue",
    //   component: <CourseRegisterDetailClient />,
    //   layout: "/client",
    // },
    {
        path: '/student-information',
        name: 'Thông tin học viên',
        icon: 'ni ni-planet text-blue',
        component: <StudentInformation />,
        layout: '/client'
    },
    {
        path: '/check-mail',
        name: 'Thông tin email',
        icon: 'ni ni-planet text-blue',
        component: <CheckMail />,
        layout: '/client'
    },
    {
        path: '/client-register/:email',
        name: 'Thông tin tài khoản',
        icon: 'ni ni-planet text-blue',
        component: <ClientRegister />,
        layout: '/client'
    },
    {
        path: '/quizz',
        name: 'Thông tin bài kiểm tra',
        icon: 'ni ni-planet text-blue',
        component: <QuizzClient />,
        layout: '/client'
    },
    {
        path: '/course-progress',
        component: <CourseProgress />,
        layout: '/client'
    }
]

export const routesTeacher = [
    {
        path: '/information',
        name: 'Thông tin tài khoản',
        icon: 'ni ni-tv-2 text-primary',
        component: <InformationTeacher />,
        layout: '/teacher'
    },
    {
        path: '/class-info',
        name: 'Danh sách lớp học',
        icon: 'ni ni-collection text-blue',
        component: <ClassInformation />,
        layout: '/teacher'
    },
    {
        path: '/resources',
        name: 'Tài nguyên',
        icon: 'ni ni-collection text-blue',
        component: <TeacherResources />,
        layout: '/teacher'
    },
    {
        path: '/schedule',
        name: 'Lịch dạy',
        icon: 'ni ni-collection text-blue',
        component: <TeacherSchedule />,
        layout: '/teacher'
    },
    {
        path: '/task',
        name: 'Giao bài tập',
        icon: 'ni ni-collection text-blue',
        component: <TaskTeacher />,
        layout: '/teacher'
    },
    {
        path: '/class-info/:classId',
        component: <ClassInformationDetail />,
        layout: '/teacher'
    },
    {
        path: '/download-task-student',
        component: <DownloadTaskStudent />,
        layout: '/teacher'
    },
    {
        path: '/class-info/point/:classId',
        icon: 'ni ni-planet text-blue',
        component: <Points />,
        layout: '/teacher'
    },
    {
        path: '/class-result',
        name: 'Kết quả lớp học',
        icon: 'ni ni-planet text-blue',
        component: <ClassResult />,
        layout: '/teacher'
    }
]

export const routesStudent = [
    {
        path: '/classes',
        name: 'Trang chủ',
        icon: 'ni ni-planet text-blue',
        component: <StudentHome />,
        layout: '/student'
    },
    {
        path: '/student-information',
        name: 'Thông tin học viên',
        icon: 'ni ni-planet text-blue',
        component: <StudentInformation />,
        layout: '/student'
    },
    {
        path: '/quizz',
        name: 'Thông tin bài kiểm tra',
        icon: 'ni ni-planet text-blue',
        component: <QuizzClient />,
        layout: '/student'
    },
    {
        path: '/task',
        name: 'Nộp bài tập',
        icon: 'ni ni-planet text-blue',
        component: <SubmitHomework />,
        layout: '/student'
    },
    {
        path: '/classes/recources/:classId',
        name: 'Thông tin bài kiểm tra',
        icon: 'ni ni-planet text-blue',
        component: <DownloadRecource />,
        layout: '/student'
    },
    {
        path: '/result',
        name: 'Kết quả học tập',
        icon: 'ni ni-planet text-primary',
        component: <LearningResult />,
        layout: '/student'
    },
    {
        path: '/payment-history',
        name: 'Lịch sử thanh toán',
        icon: 'ni ni-planet text-primary',
        component: <PaymentHistory />,
        layout: '/student'
    },
    {
        path: '/attendance-review',
        name: 'Điểm danh',
        icon: 'ni ni-planet text-primary',
        component: <Attendance />,
        layout: '/student'
    }
]

export const routesPDF = [
    {
        path: '/certificate/download',
        component: <CertificatePDF />,
        layout: '/pdf'
    }
]
export const routesEvaluation = [
    {
        path: '/student/:classIdParam',
        component: <EvaluateTeacher />,
        layout: '/evaluation'
    },
    {
        path: '/student/completed',
        component: <EvaluateTeacherCompleted />,
        layout: '/evaluation'
    },
    {
        path: '/teacher',
        component: <EvaluateTeacherViewByTeacher />,
        layout: '/evaluation'
    }
]
