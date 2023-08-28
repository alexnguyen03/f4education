// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
	const accessToken = JSON.parse(localStorage.getItem('accessToken'));
	console.log(accessToken);
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});
axiosClient.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return response.data;
		}
		return response;
	},
	(error) => {
		// Handle errors
		throw error;
	},
);
export default axiosClient;
