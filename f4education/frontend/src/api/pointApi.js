import axiosClient from './axiosClient'

const pointApi = {
    getPointByStudentAndClass: (studentId, classId) => {
        const url = `/point/result?studentId=${studentId}&classId=${classId}`
        return axiosClient.get(url)
    }
}

export default pointApi
