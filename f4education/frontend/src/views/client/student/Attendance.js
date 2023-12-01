import {
    Badge,
    Card,
    Container,
    Divider,
    Grid,
    Group,
    rem,
    Skeleton,
    Text,
    Title
} from '@mantine/core'
import { MaterialReactTable } from 'material-react-table'
import React, { useEffect, useMemo, useState } from 'react'

// API
import attendanceAPI from '../../../api/attendanceApi'
import scheduleAPI from '../../../api/scheduleApi'
import classAPI from '../../../api/classApi'
import moment from 'moment/moment'
import { IconBook } from '@tabler/icons-react'

const Attendance = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // Main variable
    const [listAttendance, setListAttendance] = useState([])

    // Action variable
    const [loading, setLoading] = useState(false)

    // Fetch
    const fetchAllClasses = async () => {
        try {
            const resp = await classAPI.getAllClassByStudentId(user.username)

            if (resp.status === 200) {
                const newData = resp.data

                const updatedData = await Promise.all(
                    newData.map(async (data) => {
                        if (!data || data.classId === null) {
                            return {
                                ...data,
                                schedule: [],
                                courseName: null
                            }
                        } else {
                            const scheduleData = await fetchSchedule(
                                data.classId,
                                user.username
                            )

                            const attendanceData =
                                await fetchAttendanceByClassAndStudent(
                                    user.username,
                                    data.classId
                                )

                            const updatedScheduleData = scheduleData.map(
                                (schedule) => ({
                                    ...schedule,
                                    isAbsent: attendanceData.some(
                                        (attendance) => {
                                            return (
                                                moment(
                                                    attendance.attendanceDate
                                                ).format('DD-MM-yyyy') ===
                                                moment(
                                                    schedule.studyDate
                                                ).format('DD-MM-yyyy')
                                            )
                                        }
                                    )
                                })
                            )

                            // count total isAbsent
                            const totalAbsent = updatedScheduleData.reduce(
                                (sum, item) => {
                                    return (
                                        sum + (item.isAbsent === true ? 1 : 0)
                                    )
                                },
                                0
                            )

                            // Check courseName
                            let courseName
                            for (const item of attendanceData) {
                                if (item.courseName !== null) {
                                    courseName = item.courseName
                                    break
                                }
                            }

                            return {
                                ...data,
                                schedule: updatedScheduleData,
                                courseName: courseName,
                                totalAbsent: totalAbsent
                            }
                        }
                    })
                )

                const resultData = updatedData.filter(
                    (data) => data.schedule.length !== 0
                )

                console.log(resultData)
                setListAttendance(resultData)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSchedule = async (classId, studentId) => {
        try {
            const resp = await scheduleAPI.getScheduleByAttendance(
                classId,
                studentId
            )
            return resp.data
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAttendanceByClassAndStudent = async (studentId, classId) => {
        try {
            const resp = await attendanceAPI.getAttendanceByStudentAndClass(
                studentId,
                classId
            )
            return resp.data
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (date) => {
        const formattedDate = moment(date)
            .locale('vi')
            .format('dddd, DD/MM/yyyy')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    // Materriable table
    const attendanceColumn = useMemo(
        () => [
            {
                accessorFn: (row) => formatDate(row.studyDate),
                header: 'ngày học',
                size: 180
            },
            {
                accessorKey: 'sessions.sessionName',
                header: 'Ca học',
                size: 85
            },
            {
                accessorFn: (row) => row.isPratice,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row === true) {
                        return <Badge color="indigo">Thực hành</Badge>
                    } else {
                        return <Badge color="violet">Lý thuyết</Badge>
                    }
                },
                header: 'Mô tả',
                size: 85
            },
            {
                accessorFn: (row) => row.isAbsent,
                Cell: ({ cell }) => {
                    const today = moment(new Date())
                    if (cell.row.original.isAbsent === true) {
                        return <Badge color="red">Vắng mặt</Badge>
                    } else {
                        return (
                            <>
                                {today.isBefore(
                                    moment(cell.row.original.studyDate)
                                ) ? (
                                    <Badge color="gray">Tương lai</Badge>
                                ) : (
                                    <Badge color="indigo">Có mặt</Badge>
                                )}
                            </>
                        )
                    }
                },
                header: 'Trạng thái',
                size: 85
            },
            {
                accessorKey: 'notes',
                header: 'Ghi chú',
                size: 85
            }
        ],
        []
    )

    // UseEffect
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await Promise.all([fetchAllClasses()])
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <Container fluid>
            <Title order={1} color="dark" fw={500} mb={20}>
                ĐIỂM DANH
            </Title>
            <Grid mt={30}>
                {loading ? (
                    <>
                        <Skeleton width="100%" height={250} mb={20} />
                        <Skeleton width="100%" height={250} mb={20} />
                        <Skeleton width="100%" height={250} mb={20} />
                    </>
                ) : (
                    <>
                        {listAttendance.map((attendance, index) => (
                            <Grid.Col span={12} key={index} mb={30}>
                                <Card withBorder shadow="md" w={'100%'} p={10}>
                                    <Card.Section p={15}>
                                        <Group position="left">
                                            <IconBook
                                                size={rem('2rem')}
                                                color="#5F3DC4"
                                            />
                                            <Title
                                                order={2}
                                                color="dark"
                                                fw={700}
                                            >
                                                Khóa học {attendance.courseName}{' '}
                                                - Lớp {attendance.className}
                                            </Title>
                                        </Group>
                                    </Card.Section>
                                    <Divider />
                                    <Card.Section>
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
                                            data={attendance.schedule}
                                            renderTopToolbarCustomActions={() => (
                                                <Text
                                                    color="dark"
                                                    fw={500}
                                                    size="lg"
                                                    p={10}
                                                >
                                                    Đã vắng{' '}
                                                    <strong className="text-danger">
                                                        {attendance.totalAbsent}{' '}
                                                        /{' '}
                                                        {
                                                            attendance.schedule
                                                                .length
                                                        }
                                                    </strong>{' '}
                                                    tổng số buổi học
                                                </Text>
                                            )}
                                            muiTablePaginationProps={{
                                                rowsPerPageOptions: [
                                                    10, 20, 50, 100
                                                ],
                                                showFirstButton: true,
                                                showLastButton: true
                                            }}
                                        />
                                    </Card.Section>
                                </Card>
                            </Grid.Col>
                        ))}
                    </>
                )}
            </Grid>
        </Container>
    )
}

export default Attendance
