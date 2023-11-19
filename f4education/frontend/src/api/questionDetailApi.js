import axiosClient from './axiosClient'

const questionDetailApi = {
    getQuestionDetailsByClassId: (classId) => {
        const url = `/question-detail/quizz/${classId}`
        return axiosClient.get(url)
    }
}

export default questionDetailApi
