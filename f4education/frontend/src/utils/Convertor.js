/**
 *  su dung de chuyen doi mang de su dung trong React Select
 * @param arr to convert
 * @returns value and lable to using in React Select
 */
export const convertArrayToLabel = (arr, valueKey, lableKey) => {
    const convertedArray = arr.map((item) => ({
        value: item[valueKey],
        label: item[lableKey]
    }))
    return convertedArray
}
