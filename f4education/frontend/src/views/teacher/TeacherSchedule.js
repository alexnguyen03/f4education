import {
    Alert,
    Badge,
    Box,
    Button,
    Center,
    Flex,
    Grid,
    Group,
    Image,
    Input,
    Loader,
    MediaQuery,
    Modal,
    Paper,
    rem,
    Skeleton,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'

import { IconColorSwatch, IconFilterSearch } from '@tabler/icons-react'
import moment from 'moment'
import { MaterialReactTable } from 'material-react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DatePicker } from '@mantine/dates'
import { DatePickerInput } from '@mantine/dates'

// API
import scheduleApi from '../../api/scheduleApi'

// scss
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'
import { red } from '@mui/material/colors'
import { useDisclosure } from '@mantine/hooks'

const today = new Date()
// const today = new Date('2023-12-30 7:00:00')

const TeacherSchedule = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')

    let navigate = useNavigate()

    const [examOpened, handlers] = useDisclosure(false, {
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed')
    })

    const [listClasses, setListClasses] = useState([])

    const [datepicker, setDatepicker] = useState([null, null])

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    //! useState chứa lịch dạy của giảng viên
    const [schedules, setSchedules] = useState([])

    const [schedulesFillter, setSchedulesFillter] = useState([])

    //! useState chứa 1 buổi dạy của giảng viên
    const [schedule, setSchedule] = useState({
        date: '',
        classRoomName: '',
        classId: '',
        courseName: '',
        sessionName: '',
        time: '',
        isPractice: false
    })

    //! fetch lịch dạy của giảng viên
    const fetchClassByTeacher = async () => {
        try {
            setLoading(true)
            const resp = await scheduleApi.findAllScheduleTeacherByID(user.id)
            if (resp.status === 200 && resp.data.length > 0) {
                let data = resp.data
                console.log(
                    '🚀 ~ file: TeacherSchedule.js:83 ~ fetchClassByTeacher ~ data:',
                    data
                )
                let a = fillerWithTime(data)
                console.log('🚀 ~ a:', a)
                setSchedules(a)
                let dataFilter = filler(a, datepicker)
                setSchedulesFillter([...dataFilter])
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (date) => {
        const formattedDate = moment(date)
            // .locale('vi')
            .format('dddd, DD/MM/yyyy')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    const columnStudent = useMemo(
        () => [
            {
                header: 'Ngày học',
                enableEditing: false,
                enableSorting: false,
                accessorFn: (row) => {
                    console.log('🚀', new Date(row.date.substring(0, 10)))
                    return formatDate(new Date(row.date.substring(0, 10)))
                },
                size: 100
            },
            {
                accessorKey: 'className',
                header: 'Tên lớp học',
                size: 50
            },
            {
                accessorKey: 'courseName',
                header: 'Khóa học',
                size: 50
            },

            {
                accessorKey: 'classRoomName',
                header: 'Phòng',
                size: 20
            },
            {
                accessorKey: 'sessionName',
                header: 'Ca',
                size: 10
            },
            {
                header: 'Thời gian',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return row.startTime + ' - ' + row.endTime
                },
                size: 40
            },
            {
                header: 'Nội dung',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.isPractice) {
                        return <span className="text-danger">Lý thuyết</span>
                    } else {
                        return <span className="text-success">Thực hành</span>
                    }
                },
                size: 40
            },
            {
                header: 'Điểm danh',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    const startDate = new Date(row.date)

                    startDate.setHours(
                        row.startTime.substring(0, 2),
                        row.startTime.substring(3, 5),
                        0,
                        0
                    )
                    const endDate = new Date(row.date)
                    endDate.setHours(
                        row.endTime.substring(0, 2),
                        row.endTime.substring(3, 5),
                        0,
                        0
                    )

                    if (startDate < today && endDate > today) {
                        return (
                            <Button
                                // className="text-danger"
                                color="teal"
                                onClick={() => {
                                    redirectTo(row.classId)
                                }}
                            >
                                Điểm danh
                            </Button>
                        )
                    } else {
                        if (endDate < today) {
                            return (
                                <span className="text-success">
                                    Đã điểm danh
                                </span>
                            )
                        } else {
                            return (
                                <span className="text-danger">
                                    Chưa điểm danh
                                </span>
                            )
                        }
                    }
                },
                size: 40
            }
        ],
        []
    )

    const redirectTo = (classId) => {
        return navigate('/teacher/class-info/' + classId)
    }

    useEffect(() => {
        fetchClassByTeacher()
    }, [])

    const handleChangeSearchClass = (e) => {
        setSearchTerm(e.target.value)
    }

    const filler = (list, value) => {
        let schedulesInThePast = null
        let check = false
        if (value[0] != null && value[1] != null) {
            check = true
        }

        switch (check) {
            case true: {
                schedulesInThePast = list.filter((item) => {
                    return (
                        new Date(item.date.substring(0, 10)) >
                            new Date(value[0]) &&
                        new Date(item.date.substring(0, 10)) <
                            new Date(value[1])
                    )
                })
                break
            }
            default: {
                schedulesInThePast = list.filter((item) => {
                    console.log(
                        '🚀 ~ list:',
                        new Date(item.date.substring(0, 10)) +
                            ' - ' +
                            new Date(today)
                    )

                    return (
                        new Date(item.date.substring(0, 10)) >=
                        new Date(today.toString().substring(0, 10))
                    )
                })
                break
            }
        }

        return schedulesInThePast
    }

    const fillerWithTime = (list) => {
        list.sort((a, b) => {
            // Sắp xếp theo date
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            if (dateA !== dateB) {
                return dateA - dateB
            }

            // Nếu date giống nhau, sắp xếp theo startTime
            const startTimeA = convertTimeStringToMinutes(a.startTime)
            const startTimeB = convertTimeStringToMinutes(b.startTime)
            return startTimeA - startTimeB
        })
        return list
    }

    function convertTimeStringToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':')
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10)
    }

    const navigateToClassInformationDetail = (classId) => {
        navigate('/teacher/classes-info/' + classId)
    }

    const filteredClasses = listClasses.filter((item) => {
        const className = item.classes.className
        const startDate = item.classes.startDate
        const endDate = item.classes.endDate
        const courseName = item.courseName[0]

        // console.log(className, startDate, endDate, courseName);

        const lowerSearchTerm = searchTerm.toLowerCase()

        return (
            className.toLowerCase().includes(lowerSearchTerm) ||
            courseName.toLowerCase().includes(lowerSearchTerm) ||
            startDate.includes(lowerSearchTerm) ||
            endDate.includes(lowerSearchTerm)
        )
    })

    const classInformationList = filteredClasses.map((c) => (
        <Grid.Col xl={3} lg={4} md={4} sm={6} key={c.classes.classId}>
            {loading ? (
                <>
                    <Skeleton
                        radius={'sm'}
                        mb="lg"
                        mt="md"
                        width={rem('3rem')}
                        height={rem('3rem')}
                    />
                    <Skeleton width={'100%'} height={rem('2rem')} mb="sm" />
                    <Skeleton width={'100%'} height={rem('1rem')} mb="sm" />
                    <Skeleton width={'100%'} height={rem('1rem')} mb="sm" />
                </>
            ) : (
                <>
                    <Paper
                        withBorder
                        radius="md"
                        p={0}
                        className={styles.card}
                        onClick={() =>
                            navigateToClassInformationDetail(c.classes.classId)
                        }
                    >
                        <Flex justify={'space-between'} align="center" mt="md">
                            <ThemeIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{
                                    deg: 0,
                                    from: 'pink',
                                    to: 'violet'
                                }}
                            >
                                <IconColorSwatch
                                    style={{ width: rem(28), height: rem(28) }}
                                    stroke={1.5}
                                />
                            </ThemeIcon>
                            <Tooltip label="Tổng số sinh viên" position="top">
                                <Alert
                                    title={c.numberStudent}
                                    color="indigo"
                                ></Alert>
                            </Tooltip>
                        </Flex>
                        <Title order={3} fw={500} mt="md">
                            Tên Lớp: {c.classes.className}
                        </Title>
                        <Text size="lg" mt="sm" c="dimmed" lineClamp={2}>
                            Khóa học: {c.courseName[0]}
                        </Text>
                        <Text size="lg" mt="sm" c="dimmed">
                            Thời gian dạy:{' '}
                            <strong>
                                {moment(c.classes.startDate).format(
                                    'DD/mm/yyyy'
                                )}{' '}
                                -{' '}
                                {moment(c.classes.endDate).format('DD/mm/yyyy')}
                            </strong>
                        </Text>
                        <Flex justify="start" align="center" gap={5} mb={10}>
                            <Text size="lg" mt="sm" c="dimmed">
                                Trạng thái:
                            </Text>
                            <Badge color="indigo" mt={12}>
                                {c.classes.status}
                            </Badge>
                        </Flex>
                    </Paper>
                </>
            )}
        </Grid.Col>
    ))

    const onChangeDatePickr = async (value) => {
        setDatepicker(value)
        let dataFilter = await filler(schedules, value)
        setSchedulesFillter([...dataFilter])
    }

    return (
        <>
            <Box className={styles['box-content']}>
                {loading ? (
                    <>
                        <Flex justify="space-between" align="center">
                            <Skeleton width={150} height={30} mb="lg" />
                            <Skeleton width="200" height={20} mb="lg" />
                        </Flex>

                        <Skeleton width={'100%'} height={400} />
                    </>
                ) : (
                    <>
                        <DatePickerInput
                            type="range"
                            clearable
                            label="Thời gian"
                            valueFormat="DD/MM/YYYY"
                            placeholder="Chọn khoảng thời gian"
                            value={datepicker}
                            onChange={(datepicker) =>
                                onChangeDatePickr(datepicker)
                            }
                            mx="auto"
                            maw={400}
                        />
                        <br />
                        <MaterialReactTable
                            muiTableBodyProps={{
                                sx: {
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                            enableRowNumbers
                            columns={columnStudent}
                            data={schedulesFillter}
                            enableColumnOrdering
                            enableStickyHeader
                            displayColumnDefOptions={{
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
                            muiTableBodyRowProps={({ row }) => {
                                // console.log(
                                //     '🚀 ~ file: Schedule.js:320 ~ Schedule ~  row.original.studyDate.substring(5,16) :',

                                //     new Date(row.original.date)
                                //         .toDateString()
                                //         .substring(4, 16),
                                //     today
                                // )

                                if (
                                    new Date(row.original.date)
                                        .toDateString()
                                        .substring(4, 16)
                                        .trim() === today
                                ) {
                                    console.log('==========')
                                    return {
                                        sx: { backgroundColor: 'red' }
                                    }
                                }
                            }}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                        />
                    </>
                )}
            </Box>
        </>
    )
}

export default TeacherSchedule
