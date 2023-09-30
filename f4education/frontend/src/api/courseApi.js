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
	findCoursesByCheckedSubjects: (checkedSubjects) => {
		const url = `/courses/topic/${checkedSubjects}`;
		return axiosClient.get(url);
	},
	findCoursesByCheckedDurations: (checkedDurations) => {
		const url = `/courses/duration/${checkedDurations}`;
		return axiosClient.get(url);
	},
};

export default courseApi;
