import axiosClient from './axiosClient';

// api/productApi.js
const userApi = {
	signin: (body) => {
		const url = 'http://localhost:8080/api/auth/signin';
		return axiosClient.post(url, body);
	},
	signup: (params) => {
		const url = '/auth';
		return axiosClient.post(url, {params});
	},
};

export default userApi;
