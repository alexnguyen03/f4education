import axiosClient from './axiosClient';

// api/classApi.js
const classApi = {
	getAllClass: () => {
		const url = '/classs';
		return axiosClient.get(url);
	},
	createClass: (body) => {
		const url = '/classs';
		return axiosClient.post(url, body);
	},
	updateClass: (body, classId) => {
		const url = `/classs/${classId}`;
		return axiosClient.put(url, body);
	},
	getByClassId: (classId)=>{
		const url = `/classs/${classId}`;
		return axiosClient.get(url);
	}
	,getAllClassByTeacherId: (teacherId)=>{
		const url = `/classs/teacher/${teacherId}`;
		return axiosClient.get(url);
	}
};


export default classApi;
