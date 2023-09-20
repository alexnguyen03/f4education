import axiosClient from './axiosClient';

// api/courseApi.js
const courseApi = {
	getAll: () => {
		const url = '/courses';
		return axiosClient.get(url);
	},
	addCourse: (body) => {
		const url = '/courses';
		return axiosClient.post(url, body);
	},
	getCourseBySubjectName: (subjectName)=>{
		const url = `/courses/${subjectName}`;
		return axiosClient.get(url);
	}
};

export default courseApi;
