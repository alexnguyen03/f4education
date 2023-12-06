import axiosClient from './axiosClient'
import moment from 'moment'

const reportApi = {
    getCoursesWithStudentCount: () => {
        const url = '/report/course/student-count'
        return axiosClient.get(url)
    },
    getCoursesWithStudentCountCertificate: () => {
        const url = '/report/course/student-count-certificate'
        return axiosClient.get(url)
    }
}

export default reportApi
