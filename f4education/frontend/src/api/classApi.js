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
    createClass: (body) => {
        const url = '/classes'
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
    }
}

export default classApi
