import axiosClient from './axiosClient'

// api/scheduleApi.js
const scheduleApi = {
    saveSchedule: (body) => {
        const url = '/schedule'
        return axiosClient.post(url, body)
    },
    getScheduleByClassId: (classId) => {
        const url = '/schedule/' + classId
        return axiosClient.get(url)
    },
    findAllScheduleTeacherByID: (accountId) => {
        const url = '/schedule/teacher/' + accountId
        return axiosClient.get(url)
    },
    findAllScheduleByClassAndStudyDate: (classId, studyDate) => {
        const url = `/schedule/classes?classId=${classId}&studyDate=${studyDate}`
        return axiosClient.get(url)
    },
    getScheduleByAttendance: (classId, studentId) => {
        const url = `/schedule/student?classId=${classId}&studentId=${studentId}`
        return axiosClient.get(url)
    }
}

export default scheduleApi
