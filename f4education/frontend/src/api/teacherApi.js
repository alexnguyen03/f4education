import axiosClient from './axiosClient'

const teacherApi = {
    getAllTeachers: () => {
        const url = '/teachers'
        return axiosClient.get(url)
    },
    getAllTeachersHistory: () => {
        const url = '/teachers-history'
        return axiosClient.get(url)
    },
    getTeacherHistoryByCourseid: (id) => {
        const url = `/teachers-history/${id}`
        return axiosClient.get(url)
    },
    addTeacher: (body) => {
        const url = '/teachers'
        return axiosClient.post(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    updateTeacher: (body) => {
        const url = '/teachers'
        return axiosClient.put(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    getTeacher: (id) => {
        const url = `/teachers/${id}`
        return axiosClient.get(url)
    }
}

export default teacherApi
