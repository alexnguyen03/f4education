import axiosClient from './axiosClient';

// api/courseApi.js
const courseApi = {
	getAll: () => {
		const url = '/courses';
		return axiosClient.get(url);
	},
	getAllCourseHistory: () => {
		const url = '/courses-history';
		return axiosClient.get(url);
	},
	getHistoryByCourseid: (id) => {
		const url = `/courses-history/${id}`;
		return axiosClient.get(url);
	},
	addCourse: (body) => {
		const url = '/courses';
		return axiosClient.post(url, body, {headers: {'Content-Type': 'multipart/form-data'}});
	},
	updateCourse: (body) => {
		const url = '/courses';
		return axiosClient.put(url, body, {headers: {'Content-Type': 'multipart/form-data'}});
	},
	getNewestCourse: () => {
		const url = '/courses/newest-courses';
		return axiosClient.get(url);
	},

	getRegisterCourse: () => {
		const url = '/register-course';
		return axiosClient.get(url);
	},
};

export default courseApi;
