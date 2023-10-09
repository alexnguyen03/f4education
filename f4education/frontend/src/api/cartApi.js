import axios from "axios";
import axiosClient from "./axiosClient";

// api/productApi.js
const cartApi = {
  getAllCart: () => {
    const url = "/cart";
    return axiosClient.get(url);
  },
  createCart: (body) => {
    const url = "/cart";
    return axiosClient.post(url, body);
  },
  updateCart: (body, cartId) => {
    const url = `/cart/${cartId}`;
    return axiosClient.put(url, body);
  },
  removeCart: (cartId) => {
    const url = `/cart/${cartId}`;
    return axiosClient.delete(url);
  },
};

export default cartApi;
