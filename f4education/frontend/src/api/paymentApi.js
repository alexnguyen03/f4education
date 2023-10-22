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
};

export default paymentApi;
