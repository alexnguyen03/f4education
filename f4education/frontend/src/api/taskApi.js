import axiosClient from './axiosClient'

const taskApi = {
    getAllTaskByClassId: (classId) => {
        const url = `/task/${classId}`
        return axiosClient.get(url)
    },
    submitTaskFile: (body) => {
        const url = '/task/submit'
        return axiosClient.post(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    getAllFilesInFolderTaskStudent: (className, taskName, studentName) => {
        const url = `/task/file/${className}/${taskName}/${studentName}`
        return axiosClient.get(url)
    }
}

export default taskApi
