import axiosClient from './axiosClient';

// api/resourceApi.js
const resourceApi = {
	getAllResource: () => {
		const url = '/resource';
		return axiosClient.get(url);
	},
	createResource: (body) => {
		const url = '/resource';
		return axiosClient.post(url, body, {headers: {'Content-Type': 'multipart/form-data'}});
	},
};

export default resourceApi;
