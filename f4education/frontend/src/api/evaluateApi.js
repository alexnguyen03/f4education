import axiosClient from './axiosClient'

const evaluateApi = {
    getAll: () => {
        const url = '/evaluate'
        return axiosClient.get(url)
    },
    getNewestEvaluate: () => {
        const url = `/evaluate/newest-evaluete`
        return axiosClient.get(url)
    },
    getAllByCourseId: (courseId) => {
        const url = `/evaluate/course/${courseId}`
        return axiosClient.get(url)
    },
    createEvaluate: (body) => {
        const url = '/evaluate'
        return axiosClient.post(url, body)
    },
    updateEvaluate: (body, evaluateId) => {
        const url = `/evaluate/${evaluateId}`
        return axiosClient.put(url, body)
    },
    deleteEvaluate: (evaluateId) => {
        const url = `/evaluate/${evaluateId}`
        return axiosClient.delete(url)
    },
    saveEvaluationTeacher: (data) => {
        //ham nay tao danh gia giao vien
        const url = `/evaluation/student`
        return axiosClient.post(url, data)
    },
    getEvaluationTeacherId: (teacherId) => {
        //ham nay tao danh gia giao vien
        const url = `/evaluation/teacher/${teacherId}`
        return axiosClient.get(url)
    },
    getAllReportEvaluationTeacher: () => {
        const url = `/evaluation/report`
        return axiosClient.get(url)
    }
}

export default evaluateApi
