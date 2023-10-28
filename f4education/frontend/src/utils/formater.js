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
