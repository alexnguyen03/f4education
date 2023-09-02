import axiosClient from "./axiosClient";
 
// api/productApi.js
const classHistoryApi = {
  getAllClassHistory: () => {
    const url = "/classhistory";
    return axiosClient.get(url);
  },
};

export default classHistoryApi;