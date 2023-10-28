import axiosClient from './axiosClient'

const questionApi = {
    getAllQuestion: () => {
        const url = '/questions'
        return axiosClient.get(url)
    },
    getQuestionById: (questionId) => {
        const url = `/questions/${questionId}`
        return axiosClient.get(url)
    },
    createQuestion: (body) => {
        const url = '/questions'
        return axiosClient.post(url, body)
    },
    getQuestionDetailByQuestionId: (questionId) => {
        const url = `/question-detail/${questionId}`
        return axiosClient.get(url)
    },
    createQuestionDetail: (body) => {
        const url = '/question-detail'
        return axiosClient.post(url, body)
    },
    updateQuestionDetail: (questionDetailId, body) => {
        const url = `/question-detail/${questionDetailId}`
        return axiosClient.put(url, body)
    },
    deleteQuestionDetail: (questionDetailId) => {
        const url = `/question-detail/${questionDetailId}`
        return axiosClient.delete(url)
    }
}

export default questionApi
