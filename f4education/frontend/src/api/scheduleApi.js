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
    findAllScheduleByStudentId: (studentId) => {
        const url = '/schedule/student-schdule-exam/' + studentId
        return axiosClient.get(url)
    },
    findAllScheduleByClassIdAndIsPractice: (classId) => {
        const url = '/schedule/is-practice/' + classId
        return axiosClient.get(url)
    },
    findAllScheduleTeacherByID: (accountId) => {
        const url = '/schedule/teacher/' + accountId
        return axiosClient.get(url)
    },
    findAllScheduleByClassAndStudyDate: (classId) => {
        const url = `/schedule/classes?classId=${classId}`
        return axiosClient.get(url)
    },
    getScheduleByAttendance: (classId, studentId) => {
        const url = `/schedule/student?classId=${classId}&studentId=${studentId}`
        return axiosClient.get(url)
    },
    deleteScheduleById: (scheduleId) => {
        const url = '/schedule/delete/' + scheduleId
        return axiosClient.delete(url)
    }
}

export default scheduleApi
