import axiosClient from './axiosClient';

// api/classApi.js
const classApi = {
	getAllTeachers: () => {
		const url = '/teachers';
		return axiosClient.get(url);
	},
	createClass: (body) => {
		const url = '/classs';
		return axiosClient.post(url, body);
	},
	updateClass: (body, classId) => {
		const url = `/classs/${classId}`;
		return axiosClient.put(url, body);
	}
};

export default classApi;
