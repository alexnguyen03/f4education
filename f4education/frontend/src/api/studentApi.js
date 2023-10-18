import axiosClient from "./axiosClient";

// api/classApi.js
const classApi = {
  updateStudent: (body) => {
    const url = "/students";
    return axiosClient.put(url, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getStudent: (id) => {
		const url = `/students/${id}`;
		return axiosClient.get(url);
	},
};

export default classApi;
