import axiosClient from './axiosClient';

// api/classApi.js
const classApi = {
	getAllClass: () => {
		const url = '/classes';
		return axiosClient.get(url);
	},
	createClass: (body) => {
		const url = '/classes';
		return axiosClient.post(url, body);
	},
	updateClass: (body, classId) => {
		const url = `/classes/${classId}`;
		return axiosClient.put(url, body);
	},
	getClassById: (classId) => {
		const url = `/classes/${classId}`;
		return axiosClient.get(url);
	},
};

export default classApi;
