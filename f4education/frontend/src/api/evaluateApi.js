import axiosClient from './axiosClient'

const evaluateApi = {
    getAll: () => {
        const url = '/evaluate'
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
    }
}

export default evaluateApi
