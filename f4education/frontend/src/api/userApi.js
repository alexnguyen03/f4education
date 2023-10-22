import axiosClient from './axiosClient';

// api/productApi.js
const userApi = {
	signin: (body) => {
		const url = '/auth/signin';
		return axiosClient.post(url, body);
	},
	signup: (params) => {
		const url = '/auth';
		return axiosClient.post(url, {params});
	},
	signout: (id) => {
		const url = `/auth/signout/${id}`;
		return axiosClient.post(url);
	},
	getRole: (email) => {
		const url = `/auth/${email}`;
		return axiosClient.get(url);
	},
};

export default userApi;
