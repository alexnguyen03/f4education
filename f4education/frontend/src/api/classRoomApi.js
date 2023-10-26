import axiosClient from './axiosClient'

// api/classApi.js
const classRoomApi = {
    getAllClassRoom: () => {
        const url = '/classroom'
        return axiosClient.get(url)
    },
    getAllClassRoomAvailblBySessionId: (startDate) => {
        console.log(
            '🚀 ~ file: classRoomApi.js:22 ~ classRoomApi.startDate:',
            classRoomApi.startDate
        )
        const url = `/classroom/session`
        return axiosClient.post(url, startDate)
    },
    createClassRoom: (body) => {
        const url = '/classroom'
        return axiosClient.post(url, body)
    },
    updateClassRoom: (body, classroomId) => {
        const url = `/classroom/${classroomId}`
        return axiosClient.put(url, body)
    }
}

export default classRoomApi
