import axiosClient from "./axiosClient";
 
// api/productApi.js
const classRoomHistoryApi = {
  getAllClassRoomHistory: () => {
    const url = "/classroomhistory";
    return axiosClient.get(url);
  },
  getClassRoomHistoryByClassId: (classroomId) => {
		const url = `/classroomhistory/${classroomId}`;
		return axiosClient.get(url);
	}
};

export default classRoomHistoryApi;