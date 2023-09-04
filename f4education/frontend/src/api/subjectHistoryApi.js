import axiosClient from "./axiosClient";

// api/productApi.js
const subjectHistoryApi = {
  getAllSubjectHistory: () => {
    const url = "/subjectHistory";
    return axiosClient.get(url);
  },
  getSubjectHistoryBySubjectId: (subjectId) => {
    const url = `/subjectHistory/subjectid/${subjectId}`;
    return axiosClient.get(url);
  },
  createSubjectHistory: (body) => {
    const url = "/subjectHistory";
    return axiosClient.post(url, body);
  },
  updateSubjectHistory: (body, subjectId) => {
    const url = `/subjects/${subjectId}`;
    return axiosClient.put(url, body);
  },
};

export default subjectHistoryApi;
