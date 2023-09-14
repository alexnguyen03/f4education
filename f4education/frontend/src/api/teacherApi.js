import axiosClient from './axiosClient';

// api/classApi.js
const classApi = {
	getAllTeachers: () => {
		const url = '/teachers';
		return axiosClient.get(url);
	},
	addTeacher: (body) => {
		const url = '/teachers';
		return axiosClient.post(url, body);
	},
	updateTeacher: (body) => {
		const url = '/teachers';
		return axiosClient.put(url, body);
	}
};

export default classApi;
