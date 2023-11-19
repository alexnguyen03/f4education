import { Box, rem, Title } from '@mantine/core'

import { MaterialReactTable } from 'material-react-table'
import React, { useState, useMemo } from 'react'
import { useEffect } from 'react'

import billApi from 'api/billApi'
import { formatDate } from '../../../utils/formater'

const user = JSON.parse(localStorage.getItem('user'))

const PaymentHistory = ({ courseName }) => {
    const [loadingBillPayment, setLoadingBillPayment] = useState(false)
    const [billInformation, setBillInformation] = useState([
        {
            billId: 0,
            courseName: '',
            createDate: '',
            status: '',
            coursePrice: 0.0,
            totalPrice: 0.0,
            paymentMethodName: ''
        }
    ])

    // bảng lịch sử thanh toán
    const columnBillPayment = useMemo(
        () => [
            {
                accessorKey: 'billId',
                header: 'ID',
                size: 80
            },
            {
                accessorKey: 'courseName',
                header: 'Tên khóa học',
                size: 180
            },
            {
                accessorKey: 'createDate',
                accessorFn: (row) => formatDate(row.createDate),
                header: 'Ngày tạo',
                size: 150
            },
            {
                accessorKey: 'coursePrice',
                header: 'Giá khóa học',
                size: 110
            },
            {
                accessorKey: 'paymentMethodName',
                header: 'Thanh toán',
                size: 110
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                size: 110
            },
            {
                accessorKey: 'totalPrice',
                header: 'Tổng tiền',
                size: 110
            }
        ],
        []
    )

    const getAllByBillInformation = async () => {
        try {
            setLoadingBillPayment(true)
            const resp = await billApi.getAllByBillInformation(user.username)
            if (resp.status === 200) {
                setBillInformation(resp.data)
                setLoadingBillPayment(false)
                console.log('billinformation: ' + resp.data)
            }
        } catch (error) {
            console.log(error)
            setLoadingBillPayment(false)
        }
    }

    useEffect(() => {
        getAllByBillInformation()
    }, [])

    return (
        <>
            <Box p={rem('2rem')}>
                <Title order={1} color="dark" mb={rem('2rem')}>
                    Lịch sử thanh toán
                </Title>
                <MaterialReactTable
                    enableColumnResizing
                    enableGrouping
                    enableStickyHeader
                    enableStickyFooter
                    state={{ isLoading: loadingBillPayment }}
                    columns={columnBillPayment}
                    data={billInformation}
                    muiTablePaginationProps={{
                        rowsPerPageOptions: [10, 20, 50, 100],
                        showFirstButton: false,
                        showLastButton: false
                    }}
                />
            </Box>
        </>
    )
}

export default PaymentHistory
