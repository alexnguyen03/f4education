import axiosClient from './axiosClient'

const pointApi = {
    getAllPoint: () => {
        const url = '/points'
        return axiosClient.get(url)
    },
    savePoint: (body) => {
        const url = '/points'
        return axiosClient.post(url, JSON.stringify(body))
    },

    getAllPointByClassId: (classId) => {
        const url = '/points/classes/'
        return axiosClient.get(url + classId)
    },
    getPointByStudentAndClass: (studentId, classId) => {
        const url = `/point/result?studentId=${studentId}&classId=${classId}`
        return axiosClient.get(url)
    }
}

export default pointApi
