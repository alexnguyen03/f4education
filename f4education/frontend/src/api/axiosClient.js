// api/axiosClient.js
import axios from 'axios'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    paramsSerializer: (params) => queryString.stringify(params)
})
axiosClient.interceptors.request.use(async (config) => {
    var accessToken = localStorage.getItem('accessToken')

    if (accessToken !== undefined) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})
axiosClient.interceptors.response.use(
    (res) => {
        return res
    },
    async (err) => {
        const originalConfig = err.config

        if (err.response) {
            const refreshToken = localStorage.getItem('refreshToken')

            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true

                try {
                    const rs = await axiosClient.post(
                        '/auth/refresh-token',
                        refreshToken
                    )
                    console.log('🚀 ~ file: axiosClient.js:40 ~ rs:', rs)
                    const { accessToken } = rs.data

                    if (accessToken !== undefined) {
                        localStorage.setItem('accessToken', accessToken)
                        originalConfig.headers.Authorization = `Bearer ${accessToken}`
                    }
                    axiosClient.defaults.headers.common['x-access-token'] =
                        accessToken
                    return axiosClient(originalConfig)
                } catch (_error) {
                    console.log(
                        '🚀 ~ file: axiosClient.js:41 ~ _error:',
                        _error
                    )
                    if (_error.response && _error.response.data) {
                        return err.response
                    }

                    return err.response
                }
            }

            if (err.response.status === 403 && err.response.data) {
                return err.response
            }
        }

        return err.response
        // return;
    }
)

export default axiosClient
