import axios from "axios";
import axiosClient from "./axiosClient";

// api/productApi.js
const registerCourseApi = {
  createRegisterCourse: (body) => {
    const url = "/register-course";
    return axiosClient.post(url, body);
  },
};

export default registerCourseApi;
