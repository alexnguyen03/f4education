import axiosClient from './axiosClient'

const answersApi = {
    getAllAnswer: () => {
        const url = '/answers'
        return axiosClient.get(url)
    },
    getAnswerById: (answerId) => {
        const url = `/answers/${answerId}`
        return axiosClient.get(url)
    },
    createAnswer: (body) => {
        const url = '/answers'
        return axiosClient.post(url, body)
    },
    updateAnswer: (answerId, body) => {
        const url = `/answers/${answerId}`
        return axiosClient.put(url, body)
    },
    deleteAnswer: (answerId) => {
        const url = `/answers/${answerId}`
        return axiosClient.delete(url)
    }
}

export default answersApi
