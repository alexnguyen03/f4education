import axiosClient from "./axiosClient";

// api/productApi.js
const subjectHistoryApi = {
  getAllSubjectHistory: () => {
    const url = "/subject-history";
    return axiosClient.get(url);
  },
  getSubjectHistoryBySubjectId: (subjectId) => {
    const url = `/subject-history/subjectid/${subjectId}`;
    return axiosClient.get(url);
  },
  // createSubjectHistory: (body) => {
  //   const url = "/subject-history";
  //   return axiosClient.post(url, body);
  // },
  // updateSubjectHistory: (body, subjectId) => {
  //   const url = `/subjects/${subjectId}`;
  //   return axiosClient.put(url, body);
  // },
};

export default subjectHistoryApi;
