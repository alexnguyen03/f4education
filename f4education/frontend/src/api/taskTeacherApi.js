import axiosClient from './axiosClient'

const taskTeacherApi = {
    getAllTask: (id) => {
        const url = '/task/' + id
        return axiosClient.get(url)
    },
    addTask: (body) => {
        const url = '/task'
        return axiosClient.post(url, body)
    }
}

export default taskTeacherApi
