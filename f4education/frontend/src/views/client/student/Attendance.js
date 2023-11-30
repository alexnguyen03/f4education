import { Container, Grid, Skeleton, Title } from '@mantine/core'
import { MaterialReactTable } from 'material-react-table'
import React, { useEffect, useMemo, useState } from 'react'

const Attendance = () => {
    // Main variable
    const [listAttendance, setListAttendance] = useState([])

    // Action variable
    const [loading, setLoading] = useState(false)

    // Fetch
    const fetchAttendance = async () => {
        setLoading(true)
        try {
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Materriable table
    const attendanceColumn = useMemo(
        () => [
            {
                accessorKey: 'username',
                header: 'Tên tài khoản',
                size: 50
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 85
            }
        ],
        []
    )

    // UseEffect
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchAttendance()])
        }

        fetchData()
    }, [])

    return (
        <Container size="xl">
            <Title order={1} color="dark" fw={500}>
                Xem điểm danh
            </Title>
            <Grid mt={30}>
                {loading ? (
                    <>
                        <Skeleton width="100%" height={300} />
                        <Skeleton width="100%" height={300} />
                        <Skeleton width="100%" height={300} />
                    </>
                ) : (
                    <>
                        <Grid.Col span={12}>
                            <MaterialReactTable
                                enableColumnResizing
                                enableGrouping
                                enableStickyHeader
                                enableStickyFooter
                                enableRowNumbers
                                displayColumnDefOptions={{
                                    'mrt-row-numbers': {
                                        size: 5
                                    }
                                }}
                                columns={attendanceColumn}
                                // data={students}
                                renderTopToolbarCustomActions={() => (
                                    <Title order={3} color="dark">
                                        Lớp CJV101
                                    </Title>
                                )}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: true,
                                    showLastButton: true
                                }}
                            />
                        </Grid.Col>
                    </>
                )}
            </Grid>
        </Container>
    )
}

export default Attendance
