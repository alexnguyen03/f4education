import axiosClient from "./axiosClient";

const questionApi = {
  getAllQuestion: () => {
    const url = "/questions";
    return axiosClient.get(url);
  },
  // createSubject: (body) => {
  //   const url = "/subjects";
  //   return axiosClient.post(url, body);
  // },
  // updateSubject: (body, subjectId) => {
  //   const url = `/subjects/${subjectId}`;
  //   return axiosClient.put(url, body);
  // },
};

export default questionApi;
