import axiosClient from './axiosClient'

const courseDetailApi = {
    getAll: () => {
        const url = '/courses-detail'
        return axiosClient.get(url)
    },
    getAllByCourseId: (courseId) => {
        const url = `/courses-detail/${courseId}`
        return axiosClient.get(url)
    },
    createCourseDetail: (body) => {
        const url = '/courses-detail'
        return axiosClient.post(url, body)
    },
    updateCourseDetail: (courseDetailId, body) => {
        const url = `/courses-detail/${courseDetailId}`
        return axiosClient.put(url, body)
    },
    deleteCourseDetail: (courseDetailId) => {
        const url = `/courses-detail/${courseDetailId}`
        return axiosClient.delete(url)
    },
    uploadExcel: (file, courseId) => {
        const url = `/courses-detail/upload-excel/${courseId}`
        return axiosClient.post(url, file, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    downloadExcel: () => {
        const url = `/courses-detail/download-excel`
        return axiosClient.get(url, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'arraybuffer'
        })
    },
    checkHasContents: (classId) => {
        const url = `/courses-detail/schedule/check/${classId}`
        return axiosClient.get(url)
    }
}

export default courseDetailApi
