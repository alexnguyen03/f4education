import axiosClient from './axiosClient'

// api/accountApi.js
const accountApi = {
    getAllAccounts: () => {
        const url = '/accounts'
        return axiosClient.get(url)
    },
    getAllAccountsByRole: (role) => {
        const url = `/accounts/${role}`
        return axiosClient.get(url)
    },
    // getAllTeachersHistory: () => {
    //   const url = "/teachers-history";
    //   return axiosClient.get(url);
    // },
    // getTeacherHistoryByCourseid: (id) => {
    //   const url = `/teachers-history/${id}`;
    //   return axiosClient.get(url);
    // },
    addAccount: (body) => {
        const url = '/accounts'
        return axiosClient.post(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    updateAccount: (body) => {
        const url = '/accounts'
        return axiosClient.put(url, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}

export default accountApi
