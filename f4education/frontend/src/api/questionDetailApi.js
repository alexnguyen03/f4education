import axiosClient from './axiosClient'

const questionDetailApi = {
    getQuestionDetailsByStudentId: (studentId) => {
        const url = `/question-detail/${studentId}`
        return axiosClient.get(url)
    }
}

export default questionDetailApi
