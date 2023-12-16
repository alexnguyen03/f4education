import { Box, Flex, Grid, Image, Skeleton } from '@mantine/core'
import { Typography } from '@material-ui/core'
import { MaterialReactTable } from 'material-react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// API
import progressApi from 'api/progressApi'

// scss
import 'react-toastify/dist/ReactToastify.css'
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const ClassProgress = () => {
    const toastId = React.useRef(null)
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(false)
    const { classId } = useParams()

    const columnStudent = useMemo(
        () => [
            {
                accessorKey: 'student.studentId',
                header: 'Mã sinh viên',
                enableEditing: false,
                enableSorting: false,
                size: 20
            },
            {
                accessorKey: 'student.image',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return (
                        <Image
                            src={`${PUBLIC_IMAGE}/courses/${row.student.image}`}
                            width={40}
                            height={40}
                            radius={50}
                            fit="cover"
                            withPlaceholder
                        />
                    )
                },
                header: 'Hình ảnh',
                size: 50
            },
            {
                accessorKey: 'student.fullname',
                header: 'Tên sinh viên',
                size: 80
            },
            {
                accessorKey: 'student.phone',
                header: 'SĐT',
                size: 80
            },
            {
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.soBuoiVang > 7) {
                        return (
                            <span className="text-danger">
                                Không đủ điều kiện dự thi
                            </span>
                        )
                    } else {
                        return (
                            <span className="text-success">
                                Đủ điều kiện dự thi
                            </span>
                        )
                    }
                },
                header: 'Điều kiện dự thi',
                size: 30
            }
        ],
        []
    )

    const getProgress = async () => {
        try {
            setLoading(true)
            const resp = await progressApi.getAllProgress(classId)
            if (resp.status === 200) {
                setProgress(resp.data)
                setLoading(false)
            }
        } catch (error) {
            setProgress([])
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getProgress()
    }, [])

    return (
        <>
            <Grid>
                <Grid.Col>
                    <Box className={styles['box-content']}>
                        {loading ? (
                            <>
                                <Flex justify="space-between" align="center">
                                    <Skeleton width={150} height={30} mb="lg" />
                                    <Skeleton width={200} height={20} mb="lg" />
                                </Flex>

                                <Skeleton width={'100%'} height={400} />
                            </>
                        ) : (
                            <>
                                <MaterialReactTable
                                    muiTableBodyProps={{
                                        sx: {
                                            '& tr:nth-of-type(odd)': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }
                                    }}
                                    columns={columnStudent}
                                    data={progress}
                                    enableColumnOrdering
                                    enableStickyHeader
                                    displayColumnDefOptions={{
                                        'mrt-row-numbers': {
                                            size: 5
                                        }
                                    }}
                                    renderDetailPanel={({ row }) => (
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                margin: 'auto',
                                                gridTemplateColumns: '1fr 1fr',
                                                width: '100%'
                                            }}
                                        >
                                            <Typography>
                                                Số buổi vắng:{' '}
                                                {row.original.soBuoiVang}{' '}
                                                {'/ 7'}
                                            </Typography>
                                            <Typography>
                                                Tổng buổi học:
                                                {row.original.tongSoBuoi}
                                            </Typography>
                                        </Box>
                                    )}
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [10, 20, 50, 100],
                                        showFirstButton: true,
                                        showLastButton: true
                                    }}
                                />
                            </>
                        )}
                    </Box>
                </Grid.Col>
            </Grid>
            <ToastContainer />
        </>
    )
}

export default ClassProgress
