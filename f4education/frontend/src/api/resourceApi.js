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
	getAllFileByFolderId: (folderId) => {
		const url = `/resource/file/${folderId}`;
		return axiosClient.get(url);
	},
	deleteFileById: (fileId) => {
		const url = `/resource/delete/file/${fileId}`;
		return axiosClient.get(url);
	}
};

export default resourceApi;
