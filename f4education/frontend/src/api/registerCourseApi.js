import axiosClient from './axiosClient'

// api/productApi.js
const registerCourseApi = {
    createRegisterCourse: (body) => {
        const url = '/register-course'
        return axiosClient.post(url, body)
    },
    getRegisterCourseDistinc: () => {
        const url = '/register-course/distinc'
        return axiosClient.get(url)
    },
    getAllRegisterCourse: () => {
        const url = '/register-course'
        return axiosClient.get(url)
    },
    updateRegisterCourse: (body) => {
        const url = '/register-course'
        return axiosClient.put(url, body)
    },
    getAllCourseProgress: (studentId) => {
        const url = `/register-course/student/${studentId}`
        return axiosClient.get(url)
    },
    getCourseProgressByClassId: (classId) => {
        const url = `/register-course/student/progress/${classId}`
        return axiosClient.get(url)
    },
    checkIfEvaratePointGreaterThanFive: (studentId, classId, registerCourseId) => {
        const url = `/register-course/student/is-done?studentId=${studentId}
                &classId=${classId}&registerCourseId=${registerCourseId}`
        return axiosClient.get(url)
    }
}

export default registerCourseApi
