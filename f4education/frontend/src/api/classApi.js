import axiosClient from './axiosClient'

// api/classApi.js
const classApi = {
    getAllClassActive: () => {
        const url = '/classes/actived'
        return axiosClient.get(url)
    },
    getAllClass: () => {
        const url = '/classes'
        return axiosClient.get(url)
    },
    createClass: (body, adminId) => {
        const url = `/classes/${adminId}`
        return axiosClient.post(url, body)
    },
    updateClass: (body, classId) => {
        const url = `/classes/${classId}`
        return axiosClient.put(url, body)
    },
    getByClassId: (classId) => {
        const url = `/classes/${classId}`
        return axiosClient.get(url)
    },
    getAllClassByTeacherId: (teacherId) => {
        const url = `/classes/teacher/${teacherId}`
        return axiosClient.get(url)
    },
    getAllClassByStudentId: (studentId) => {
        const url = `/classes/student/${studentId}`
        return axiosClient.get(url)
    },
    getLearningResult: (studentId) => {
        const url = `/classes/student/result/${studentId}`
        return axiosClient.get(url)
    },
    endClass: (classId) => {
        const url = `/classes/teacher/point?classId=${classId}`
        return axiosClient.post(url)
    }
}

export default classApi
