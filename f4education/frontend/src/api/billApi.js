import axiosClient from "./axiosClient";

// api/productApi.js
const billApi = {
  // getAllCart: () => {
  //   const url = "/cart";
  //   return axiosClient.get(url);
  // },
  createBill: (body) => {
    const url = "/bills";
    return axiosClient.post(url, body);
  },
  // updateCart: (body, cartId) => {
  //   const url = `/cart/${cartId}`;
  //   return axiosClient.put(url, body);
  // },
};

export default billApi;
