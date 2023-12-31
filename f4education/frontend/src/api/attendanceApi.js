import axiosClient from './axiosClient'

const attendanceApi = {
    getAllAttendance: () => {
        const url = '/attendance'
        return axiosClient.get(url)
    },
    getAttendanceById: (attendanceId) => {
        const url = `/attendance/${attendanceId}`
        return axiosClient.get(url)
    },
    getAttendanceByStudentId: (student) => {
        const url = `/attendance/student/${student}`
        return axiosClient.get(url)
    },
    getAttendanceByStudentAndClass: (studentId, classId) => {
        const url = `/attendance/student-review?studentId=${studentId}&classId=${classId}`
        return axiosClient.get(url)
    },
    createAttendance: (body) => {
        const url = '/attendance'
        return axiosClient.post(url, body)
    },
    updateAttendance: (attendanceId, body) => {
        const url = `/attendance/${attendanceId}`
        return axiosClient.put(url, body)
    },
    deleteAttendance: (attendanceId) => {
        const url = `/attendance/${attendanceId}`
        return axiosClient.delete(url)
    }
}

export default attendanceApi
