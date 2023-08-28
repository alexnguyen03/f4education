import axiosClient from "./axiosClient";

// api/productApi.js
const userApi = {
  getAllSubject: () => {
    const url = "/subjects";
    return axiosClient.get(url);
  },
  createSubject: (body) => {
    const url = "/subjects"; 
    return axiosClient.post(url, body);
  },
  updateSubject: (body, subjectId) => {
    const url = `/subjects/${subjectId}`;
    return axiosClient.put(url, body);
  },
};

export default userApi;