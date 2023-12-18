import { Box, rem, Title, Badge } from '@mantine/core'

import { MaterialReactTable } from 'material-react-table'
import React, { useState, useMemo } from 'react'
import { useEffect } from 'react'
import moment from 'moment'

import scheduleApi from 'api/scheduleApi'
import { formatDate } from '../../../utils/formater'

const user = JSON.parse(localStorage.getItem('user'))

const SchdulesExam = ({ courseName }) => {
    const [loadingBillPayment, setLoadingBillPayment] = useState(false)
    const [billInformation, setBillInformation] = useState([])

    // bảng lịch sử thanh toán
    const columnBillPayment = useMemo(
        () => [
            {
                accessorKey: 'studyDate',
                header: 'Ngày thi',

                accessorFn: (row) => formatDate(row.studyDate),
                size: 80
            },
            {
                accessorKey: 'content',
                header: 'Nội dung',
                size: 120
            },
            {
                accessorKey: 'isPractice',
                header: 'Thi',
                // accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    //lý thuyết: false | thực hành: true
                    if (row === null) {
                        return (
                            <Badge className="font-weight-bold" color="info">
                                {'Thi'}
                            </Badge>
                        )
                    }
                    return row ? (
                        <Badge className="font-weight-bold" color="info">
                            {'Thực hành'}
                        </Badge>
                    ) : (
                        <Badge className="font-weight-bold" color="primary">
                            {'Lý thuyết'}
                        </Badge>
                    )
                },
                size: 35
            },
            {
                accessorKey: 'teacherName',
                header: 'Giáo viên',
                size: 80
            },
            {
                accessorKey: 'session',
                header: 'Ca',
                size: 80
            },
            {
                accessorKey: 'classroom',
                header: 'Phòng',
                size: 80
            }
        ],
        []
    )

    const getAllByBillInformation = async () => {
        try {
            setLoadingBillPayment(true)
            const resp = await scheduleApi.findAllScheduleByStudentId(
                user.username
            )
            if (resp.status === 200) {
                const { listSchedules, sessionName, classroomName, teacher } = {
                    ...resp.data
                }

                const schedule = listSchedules.map((item) => {
                    return {
                        scheduleId: item.scheduleId,
                        studyDate: moment(item.studyDate)._d,
                        session: sessionName,
                        classroom: classroomName,
                        isPractice: item.isPractice,
                        teacherName: teacher.fullname,
                        content: item.content
                    }
                })

                setBillInformation(schedule)
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
                    Lịch thi
                </Title>
                <MaterialReactTable
                    enableColumnResizing
                    enableGrouping
                    enableStickyHeader
                    enableStickyFooter
                    enableRowNumbers
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

export default SchdulesExam
