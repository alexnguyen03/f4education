const { toast } = require('react-toastify')
/**
 * @param  msg - the message
 * @param  toastId - the id
 * @param  type - the type
 */
const defaultOptions = {
    //options mac dinh neu muon them thi cu ghi de la ok!
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
        updateSuccess: 'Cập nhật thành công!'
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

        //! toast SUCCESS ----------------------------------------------------------------
        changePasswordSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Cập nhật mật khẩu thành công!',
                ...defaultOptions
            }
        },
        updateSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Cập nhật thành công!',
                ...defaultOptions
            }
        },
        createSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Thêm mới thành công!',
                ...defaultOptions
            }
        },
        createSuccessParam: (msg) => {
            return {
                type: toast.TYPE.SUCCESS,
                render: msg,
                ...defaultOptions
            }
        },

        deleteSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Xóa thành công!',
                ...defaultOptions
            }
        },
        rightOTP: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'OTP chính xác!',
                ...defaultOptions
            }
        },

        uploadFileSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Upload file thành công!',
                ...defaultOptions
            }
        },
        deleteFileSuccess: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Xóa file thành công!',
                ...defaultOptions
            }
        },
        nullFile: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'Bạn chưa chọn File!',
                ...defaultOptions
            }
        },
        sendedMail: () => {
            return {
                type: toast.TYPE.SUCCESS,
                render: 'Đã gửi OTP đến email của bạn!',
                ...defaultOptions
            }
        },

        //! toast ERROR ----------------------------------------------------------------
        undefinedAccount: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'Email chưa đăng ký tài khoản!',
                ...defaultOptions
            }
        },
        updateError: () => {
            return {
                render: 'Cập nhật thất bại!',
                type: toast.TYPE.ERROR,
                ...defaultOptions
            }
        },
        deleteError: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'Xóa thất bại!',
                ...defaultOptions
            }
        },
        wrongOTP: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'OTP không chính xác!',
                ...defaultOptions
            }
        },
        deadOTP: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'OTP không còn hiệu lực!',
                ...defaultOptions
            }
        },
        usedEmail: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'Email đã được sử dụng!',
                ...defaultOptions
            }
        },
        error: () => {
            // loi chung thi dung ong nay
            return {
                type: toast.TYPE.ERROR,
                render: 'Lỗi. Vui lòng thử lại sau!',
                ...defaultOptions
            }
        },
        createError: () => {
            return {
                type: toast.TYPE.ERROR,
                render: 'Thêm mới thất bại!',
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
        warningParam: (param) => {
            // loi chung thi dung ong nay
            return {
                type: toast.TYPE.WARNING,
                render: param,
                ...defaultOptions
            }
        }
    }
}
export default Notify
