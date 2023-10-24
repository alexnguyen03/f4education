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
    }
}

export default questionApi
