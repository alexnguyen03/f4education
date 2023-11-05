const { toast } = require('react-toastify')
/**
 * @param  msg - the message
 * @param  toastId - the id
 * @param  type - the type
 */
const defaultOptions = {
    //options mac dinh neu muon them thi cu ghi de la ok !
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    position: 'top-right',
    closeButton: true,
    pauseOnHover: true,
    theme: 'light',
    isLoading: false
}
const Notify = {
    msg: {
        loading: 'Đang xử lý...',
        updateSuccess: 'Cập nhật thành công !'
    },
    options: {
        loading: () => {
            return {
                type: toast.TYPE.LOADING,
                autoClose: false,
                isLoading: true,
                closeButton: false,
                closeOnClick: true
            }
        },
        updateSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Cập nhật thành công !',
                ...defaultOptions
            }
        },
        updateError: () => {
            return {
                render: 'Cập nhật thất bại !',
                type: toast.TYPE.ERROR,
                ...defaultOptions
            }
        },
        createSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Thêm mới thành công !',
                ...defaultOptions
            }
        },
        createError: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'Thêm mới thất bại !',
                ...defaultOptions
            }
        },
        createErrorParam: (message) => {
            return {
                type: toast.TYPE.ERROR,
                render: message,
                ...defaultOptions
            }
        },
        deleteSuccess: ()=>{
            return{
                type:toast.TYPE.SUCCESS,
                render:'Xóa thành công !',
                ...defaultOptions
            }
        },
        deleteError: ()=>{
            return{
                type:toast.TYPE.ERROR,
                render:'Xóa thất bại !',
                ...defaultOptions
            }
        },
        error: () => {
            // loi chung thi dung ong nay
            return {
                type: toast.TYPE.ERROR,
                render: 'Lỗi. Vui lòng thử lại sau !',
                ...defaultOptions
            }
        }
    }
}
export default Notify
