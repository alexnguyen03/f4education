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
