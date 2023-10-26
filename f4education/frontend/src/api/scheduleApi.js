import axiosClient from './axiosClient'

// api/scheduleApi.js
const scheduleApi = {
    saveSchedule: (body) => {
        const url = '/schedule'
        return axiosClient.post(url, body)
    },
    getScheduleByClassId(classId) {
        const url = '/schedule/' + classId
        return axiosClient.get(url)
    }
}

export default scheduleApi
