import axiosClient from "./axiosClient";

const questionApi = {
  getAllQuestion: () => {
    const url = "/questions";
    return axiosClient.get(url);
  },
  createQuestion: (body) => {
    const url = "/questions";
    return axiosClient.post(url, body);
  },
  updateQuestion: (body, subjectId) => {
    const url = `/subjects/${subjectId}`;
    return axiosClient.put(url, body);
  },
};

export default questionApi;
