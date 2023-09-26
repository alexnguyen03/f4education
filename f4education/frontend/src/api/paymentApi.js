import axiosClient from "./axiosClient";

// api/productApi.js
const paymentApi = {
  // getAllCart: () => {
  //   const url = "/cart";
  //   return axiosClient.get(url);
  // },
  createPayment: (body) => {
    const url = "/payment/create_payment";
    return axiosClient.post(url, body);
  },
  // updateSubject: (body, subjectId) => {
  //   const url = `/cart/${subjectId}`;
  //   return axiosClient.put(url, body);
  // },
};

export default paymentApi;
