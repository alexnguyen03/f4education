import axiosClient from './axiosClient'

// api/productApi.js
const registerCourseApi = {
    createRegisterCourse: (body) => {
        const url = '/register-course'
        return axiosClient.post(url, body)
    },
    getAllCourseProgress: (studentId) => {
        const url = `/register-course/student/${studentId}`
        return axiosClient.get(url)
    },
    getCourseProgressByClassId: (classId) => {
        const url = `/register-course/student/progress/${classId}`
        return axiosClient.get(url)
    },
}

export default registerCourseApi;