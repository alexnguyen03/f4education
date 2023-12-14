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
    checkMail: (body) => {
        const url = '/accounts/checkEmail'
        return axiosClient.post(url, body)
    },

    // Forgot Password--------------------------------------------------------------------------------
    checkMailForPassword: (body) => {
        const url = '/accounts/checkEmailForPassWord'
        return axiosClient.post(url, body)
    },
    changePassword: (body) => {
        const url = '/accounts/changePassword'
        return axiosClient.post(url, body)
    },
    checkOTP: (body) => {
        const url = '/accounts/checkOTP'
        return axiosClient.post(url, body)
    },

    // Đăng ký tài khoản--------------------------------------------------------------------------------
    checkEmailForRegsiter: (body) => {
        const url = '/accounts/checkEmailForRegsiter'
        return axiosClient.post(url, body)
    },

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
