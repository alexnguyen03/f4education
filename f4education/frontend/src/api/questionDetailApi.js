import axiosClient from './axiosClient'

const questionDetailApi = {
    getQuestionDetailsByClassId: (classId, studentId) => {
        const url = `/question-detail/quizz/${classId}/${studentId}`
        return axiosClient.get(url)
    }
}

export default questionDetailApi
