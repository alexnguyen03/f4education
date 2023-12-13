import axiosClient from './axiosClient'

// api/courseApi.js
const courseApi = {
    getAll: (studentId) => {
        const url = `/courses/get-all?studentId=${studentId}`
        return axiosClient.get(url)
    },
    getAllCourseHistory: () => {
        const url = '/courses-history'
        return axiosClient.get(url)
    },
    getHistoryByCourseid: (id) => {
        const url = `/courses-history/${id}`
        return axiosClient.get(url)
    },
    addCourse: (body) => {
        const url = '/courses'
        return axiosClient.post(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    validateCourseName: (courseName) => {
        const url = `/courses/validate?courseName=${courseName}`
        return axiosClient.get(url)
    },
    updateCourse: (body) => {
        const url = '/courses'
        return axiosClient.put(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    findCoursesByCheckedSubjects: (checkedSubjects, studentId) => {
        const url = `/courses/topic/${checkedSubjects}?studentId=${studentId}`
        return axiosClient.get(url)
    },
    findCoursesByCheckedRating: (star, studentId) => {
        const url = `/courses/rating/${star}?studentId=${studentId}`
        return axiosClient.get(url)
    },
    findCoursesByCheckedDurations: (checkedDurations) => {
        const url = `/courses/duration/${checkedDurations}`
        return axiosClient.get(url)
    },
    findCoursesByStudenttId: (studentId) => {
        const url = `/courses/course-register/${studentId}`
        return axiosClient.get(url)
    },
    findCourseById: (courseId) => {
        const url = `/courses/course-detail/${courseId}`
        return axiosClient.get(url)
    },
    getNewestCourse: (studentId) => {
        const url = `/courses/newest-courses?studentId=${studentId}`
        return axiosClient.get(url)
    },
    getTopSellingCourse: (studentId) => {
        const url = `/courses/top-selling?studentId=${studentId}`
        return axiosClient.get(url)
    },
    getCourseBySubjectName: (subjectName) => {
        const url = `/courses/${subjectName}`
        return axiosClient.get(url)
    },
    getCourseByCourseId: (courseId, studentId) => {
        const url = `/courses/detail/${courseId}?studentId=${studentId}`
        return axiosClient.get(url)
    },
    getAllCourseContentByClassId: (classId) => {
        const url = `/courses/schedule/${classId}`
        return axiosClient.get(url)
    }
}

export default courseApi
