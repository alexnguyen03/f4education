import axiosClient from './axiosClient'

const progressApi = {
    getAllProgress: (classId) => {
        const url = '/progress/' + classId
        return axiosClient.get(url)
    }
}

export default progressApi
