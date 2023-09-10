import axiosClient from './axiosClient';

const sessionsApi = {
	getAllSessions: () => {
		const url = '/sessions';
		return axiosClient.get(url);
	},
	createSessions: (body) => {
		const url = '/sessions';
		return axiosClient.post(url, JSON.stringify(body));
	},
	updateSessions: (body) => {
		const url = `/sessions`;
		return axiosClient.put(url, body);
	},
};

export default sessionsApi;
