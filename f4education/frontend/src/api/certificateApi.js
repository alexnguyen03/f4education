import axiosClient from './axiosClient'

// api/productApi.js
const certificateApi = {
    getAllCertificate: () => {
        const url = '/certificate'
        return axiosClient.get(url)
    },
    getAllCertificateByCertificateId: (certificateId) => {
        const url = '/certificate/' + certificateId
        return axiosClient.get(url)
    },
    getAllCertificateByStudentId: (studentId) => {
        const url = '/certificate/' + studentId
        return axiosClient.get(url)
    },
    getAllCertificateByRegisterCourseAndStudentId: (
        registerCourseId,
        studentId
    ) => {
        const url = `/certificate/pdf?registerCourseId=${registerCourseId}&studentId=${studentId}`
        return axiosClient.get(url)
    },
    createCertificate: (body) => {
        const url = '/certificate'
        return axiosClient.post(url, body)
    },
    removeCertificate: (certificateId) => {
        const url = `/certificate/${certificateId}`
        return axiosClient.delete(url)
    },
    downloadCertificate: (formData) => {
        const url = `/certificate/teacher/download`
        return axiosClient.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}

export default certificateApi
