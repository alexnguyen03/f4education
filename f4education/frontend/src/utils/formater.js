import moment from 'moment'

export const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    })

    return formatter.format(amount)
}
/**
 *
 * @param {*} date
 * @returns the date formatted with pattern DD/MM/yyyy, h:mm A
 */
export const formatDate = (date) => {
    const formattedDate = moment(date).format('DD/MM/yyyy, h:mm A')
    return formattedDate
}

// export default formatCurrency;

export const CheckUserLogin = (user) => {
    console.log(user)

    if (user === null || user === undefined) {
        return false
    } else {
        const listRole = user.roles[0]
        const pathName = window.location.pathname

        if (listRole) {
            if (pathName.includes('student')) {
                if (listRole === 'ROLE_USER') {
                    return true
                } else return false
            } else if (pathName.includes('teacher')) {
                if (listRole === 'ROLE_TEACHER') {
                    return true
                } else return false
            } else if (pathName.includes('admin')) {
                if (listRole === 'ROLE_ADMIN') {
                    return true
                } else return false
            }
        }
    }
}
