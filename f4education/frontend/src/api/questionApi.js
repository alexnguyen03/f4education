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
    },
    uploadExcel: (file, questionId) => {
        const url = `/question-detail/upload-excel/${questionId}`
        return axiosClient.post(url, file, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    createExamination: (classId) => {
        const url = `exam/${classId}`
        return axiosClient.post(url)
    },

    checkActivedExam: (classId) => {
        const url = `exam/${classId}`
        return axiosClient.get(url)
    },

    checkActivedExamByTodayAndClassId: (classId) => {
        const url = `exam/student/${classId}`
        return axiosClient.get(url)
    }
}

export default questionApi
