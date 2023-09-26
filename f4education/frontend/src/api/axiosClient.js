// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
import {useNavigate} from 'react-router-dom';
const accessToken = JSON.parse(localStorage.getItem('accessToken') | '');
const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
	console.log(accessToken);
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	console.log('🚀 ~ file: axiosClient.js:20 ~ axiosClient.interceptors.request.use ~ config:', config);
	return config;
});
axiosClient.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		const originalConfig = err.config;

		console.log('🚀 ~ file: axiosClient.js:30 ~ err.response:', err.response);
		if (err.response) {
			const refreshToken = JSON.parse(localStorage.getItem('refreshToken') ?? '');

			// Access Token was expired
			if (err.response.status === 401 && !originalConfig._retry) {
				originalConfig._retry = true;
				console.log('🚀 ~ file: axiosClient.js:38 ~ refreshToken:', refreshToken);

				try {
					const rs = await axiosClient.post('/auth/refresh-token', refreshToken);
					const {accessToken} = rs.data;
					localStorage.setItem('accessToken', accessToken);
					axiosClient.defaults.headers.common['x-access-token'] = accessToken;
					return axiosClient(originalConfig);
				} catch (_error) {
					if (_error.response && _error.response.data) {
						return err;
					}

					return err;
				}
			}

			if (err.response.status === 403 && err.response.data) {
				return err;
			}
		}

		return err;
		// return;
	},
);

export default axiosClient;
