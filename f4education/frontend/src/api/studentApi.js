import axiosClient from './axiosClient'

// api/studentApi.js
const studentApi = {
    updateStudent: (body) => {
        const url = '/students'
        return axiosClient.put(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    getStudent: (id) => {
        const url = `/students/${id}`
        return axiosClient.get(url)
    }
}

export default studentApi
