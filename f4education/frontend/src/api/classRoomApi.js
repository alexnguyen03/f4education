import axiosClient from './axiosClient';

// api/classApi.js
const classRoomApi = {
	getAllClassRoom: () => {
		const url = '/classroom';
		return axiosClient.get(url);
	},
	createClassRoom: (body) => {
		const url = '/classroom';
		return axiosClient.post(url, body);
	},
	updateClassRoom: (body, classroomId) => {
		const url = `/classroom/${classroomId}`;
		return axiosClient.put(url, body);
	}
};


export default classRoomApi;
