import axios from 'axios';
import axiosClient from './axiosClient';

// api/productApi.js
const registerCourseApi = {
	createRegisterCourse: (body) => {
		const url = '/register-course';
		return axiosClient.post(url, body);
	},
	getRegisterCourseDistinc: () => {
		const url = '/register-course/distinc';
		return axiosClient.get(url);
	},
	getAllRegisterCourse: () => {
		const url = '/register-course';
		return axiosClient.get(url);
	},
};

export default registerCourseApi;
