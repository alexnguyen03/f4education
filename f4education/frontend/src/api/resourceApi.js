import axiosClient from './axiosClient'

// api/resourceApi.js
const resourceApi = {
    getAllResource: () => {
        const url = '/resource'
        return axiosClient.get(url)
    },
    createResource: (body) => {
        const url = '/resource'
        return axiosClient.post(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    getAllFileByFolderId: (folderId) => {
        const url = `/resource/file/${folderId}`
        return axiosClient.get(url)
    },
    deleteFileById: (fileId) => {
        const url = `/resource/delete/file/${fileId}`
        return axiosClient.get(url)
    },
    getAllFileByCourseName: (courseName) => {
        const url = `/resource/files/${courseName}`
        return axiosClient.get(url)
    },
    downloadFiles: (folderIds) => {
        const url = `/resource/download-multiple?fileIds=${folderIds.join(',')}`
        return axiosClient.get(url, {
            responseType: 'arraybuffer'
        })
    },
    downloadFilesStudent: (className, taskName) => {
        const url = `/resource/download-multiple-student/${className}/${taskName}`
        return axiosClient.get(url, {
            responseType: 'arraybuffer'
        })
    },
    deleteFoldelTmp: () => {
        const url = '/resource/delete-foldel-tmp'
        return axiosClient.get(url)
    },
}

export default resourceApi
