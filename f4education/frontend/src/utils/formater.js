export const formatCurrency = (amount) => {
	const formatter = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		minimumFractionDigits: 0,
	});

	return formatter.format(amount);
};
// export default formatCurrency;
