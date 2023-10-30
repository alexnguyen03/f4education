import axiosClient from './axiosClient'

// api/resourceApi.js
const quizzResultApi = {
    createQuizzResult: (body) => {
        const url = '/quizz-result'
        return axiosClient.post(url, body)
    }
}

export default quizzResultApi
