import {
    Alert,
    Badge,
    Center,
    Flex,
    Group,
    HoverCard,
    Loader,
    LoadingOverlay,
    Select,
    Stack,
    Text
} from '@mantine/core'
import MaterialReactTable from 'material-react-table'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import classApi from '../../../api/classApi'
import scheduleApi from '../../../api/scheduleApi'
import { convertArrayToLabel } from '../../../utils/Convertor'
import { IconAlertCircle } from '@tabler/icons-react'
const listOptionView = [
    {
        value: '30',
        label: 'Tháng trước'
    },
    {
        value: '15',
        label: '14 ngày trước'
    },
    {
        value: '60',
        label: '2 tháng trước'
    }
]
const today = new Date('2024-01-04').toDateString().substring(4, 16)
const Schedule = (props) => {
    const [classSelected, setClassSelected] = useState()
    const [classes, setClasses] = useState([])
    const [viewValue, setViewValue] = useState(null)
    const [listScheduleInTable, setListScheduleInTable] = useState([])
    const [allSchedules, setAllSchedules] = useState([])
    const [loadingSchedule, setLoadingSchedule] = useState(null)
    const formatDate = (date) => {
        const formattedDate = moment(new Date(date))
            .locale('vi')
            .format('dddd, DD/MM/yyyy')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }
    const columnsSchedule = useMemo(
        () => [
            {
                accessorKey: 'studyDate',
                header: 'Ngày học',
                accessorFn: (row) => {
                    return formatDate(row.studyDate)
                    // return row.studyDate
                },
                size: 150
            },
            {
                accessorKey: 'content',
                accessorFn: (row) => {
                    return (
                        <HoverCard width={280} shadow="md">
                            <HoverCard.Target>
                                <Text styles={{ cursor: 'pointer' }}>
                                    {row.content}
                                </Text>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">
                                    Nội dung của buổi học hiển thị ở đây
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    )
                },
                header: 'Nội dung',
                size: 200
            },
            {
                accessorKey: 'session',
                header: 'Ca',
                size: 35
            },
            {
                accessorKey: 'classroom',
                header: 'Phòng',
                size: 35
            },
            {
                accessorKey: 'isPractice',
                header: 'Thực hành/Lý thuyết',
                accessorFn: (row) => {
                    return row.isPractice ? (
                        <Badge className="font-weight-bold" color="indigo.9">
                            Thực hành
                        </Badge>
                    ) : (
                        <Badge className="font-weight-bold">Lý thuyết</Badge>
                    )
                },
                size: 35
            },
            {
                accessorKey: 'teacherName',
                header: 'Giáo viên',
                size: 150
            }
        ],
        []
    )
    const handleOnChangeViewValue = (val) => {
        console.log(val)

        let schedulesInThePast = allSchedules.filter((item) => {
            return (
                new Date(item.studyDate.substring(0, 10)) < new Date(today) // test
            )
        })

        let newScheduleInTable = []

        // val is number of date
        switch (val) {
            case '15':
                if (schedulesInThePast.length >= 5) {
                    console.log(
                        '🚀 ~ file: Schedule.js:132 ~ handleOnChangeViewValue ~ schedulesInThePast:',
                        schedulesInThePast
                    )
                    newScheduleInTable = [...schedulesInThePast.slice(-5)]
                }
                break
            case '30':
                if (schedulesInThePast.length >= 30) {
                    newScheduleInTable = [...schedulesInThePast.slice(-30)]
                }
                break
            case '60':
                if (schedulesInThePast.length >= 60) {
                    newScheduleInTable = [...schedulesInThePast.slice(-60)]
                }
                break

            default:
                newScheduleInTable = schedulesInThePast
                break
        }

        setListScheduleInTable([...newScheduleInTable, ...listScheduleInTable])

        console.log(
            '🚀 ~ file: Schedule.js:117 ~ handleOnChangeViewValue ~ schedulesInThePast:',
            newScheduleInTable,
            listScheduleInTable
        )
    }
    // ! API
    const getAllClassByStudentId = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const username = user.username
            const resp = await classApi.getAllClassByStudentId(username)
            console.log(
                '🚀 ~ file: Schedule.js:81 ~ getAllClassByStudentId ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setClasses(resp.data)
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: Schedule.js:79 ~ getAllClassByStudentId ~ error:',
                error
            )
        }
    }
    const getScheduleByClassId = async (classId) => {
        try {
            setClassSelected(classId)
            setLoadingSchedule(true)
            const resp = await scheduleApi.getScheduleByClassId(classId)

            if (resp.status === 200) {
                const { listSchedules, sessionName, classroomName, teacher } = {
                    ...resp.data
                }

                setAllSchedules(
                    listSchedules.map((item) => {
                        return {
                            scheduleId: item.scheduleId,
                            studyDate: item.studyDate.substring(0, 10),
                            session: sessionName,
                            classroom: classroomName,
                            isPractice: item.isPractice,
                            teacherName: teacher.fullname,
                            content: item.content
                        }
                    })
                )
                var schedule = listSchedules
                    .map((item) => {
                        console.log(
                            '🚀 ~ file: Schedule.js:162 ~ .map ~ item.studyDate:',
                            item.studyDate
                        )
                        return {
                            scheduleId: item.scheduleId,
                            studyDate: item.studyDate.substring(0, 10),
                            session: sessionName,
                            classroom: classroomName,
                            isPractice: item.isPractice,
                            teacherName: teacher.fullname,
                            content: item.content
                        }
                    })
                    .filter((item) => {
                        return (
                            new Date(item.studyDate.substring(0, 10)) >=
                            new Date(today) // test
                        )
                    })

                setListScheduleInTable([...schedule])
                setLoadingSchedule(false)
            }
        } catch (error) {
            setLoadingSchedule(false)
            console.log(
                '🚀 ~ file: Schedule.js:101 ~ getScheduleByClassId ~ error:',
                error
            )
        }
    }
    useEffect(() => {
        getAllClassByStudentId()
    }, [])
    return (
        <>
            <div className="my-3 px-2">
                <Group grow>
                    <Select
                        label="Chọn lớp học"
                        placeholder="Chọn 1 lớp học"
                        value={classSelected}
                        onChange={(classId) => {
                            getScheduleByClassId(classId)
                        }}
                        data={convertArrayToLabel(
                            classes,
                            'classId',
                            'className'
                        )}
                    />
                    <Select
                        label="Chọn lớp học"
                        placeholder="Chọn 1 lớp học"
                        value={viewValue}
                        onChange={(viewVal) => {
                            handleOnChangeViewValue(viewVal)
                        }}
                        data={convertArrayToLabel(
                            listOptionView,
                            'value',
                            'label'
                        )}
                    />
                </Group>
            </div>
            {/* <Group my={'lg'}>
                <Center mx="auto" className="shadow" p="md">
                    <div>Đã học: 30 buổi</div>
                </Center>
                <Center mx="auto" className="shadow" p="md">
                    <div>Còn lại: 20 buổi</div>
                </Center>
                <Center mx="auto" className="shadow" p="md">
                    <div>All elements inside Center are centered</div>
                </Center>
            </Group> */}
            <div className="mt-2  pb-3">
                {listScheduleInTable.length > 0 && (
                    <div pos={'relative'}>
                        <LoadingOverlay visible={loadingSchedule} />
                        <MaterialReactTable
                            muiTableBodyProps={{
                                sx: {
                                    //stripe the rows, make odd rows a darker color
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                            enableToolbarInternalActions={false}
                            enableStickyHeader
                            enableStickyFooter
                            enableSorting={false}
                            enableRowNumbers
                            enableTopToolbar={false}
                            enableColumnActions={false}
                            state={{ isLoading: loadingSchedule }}
                            displayColumnDefOptions={{
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
                            columns={columnsSchedule}
                            data={listScheduleInTable}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                            muiTableBodyRowProps={({ row }) => {
                                console.log(
                                    '🚀 ~ file: Schedule.js:320 ~ Schedule ~  row.original.studyDate.substring(5,16) :',

                                    new Date(row.original.studyDate)
                                        .toDateString()
                                        .substring(4, 16),
                                    today
                                )

                                if (
                                    new Date(row.original.studyDate)
                                        .toDateString()
                                        .substring(4, 16) === today
                                ) {
                                    console.log('==========')
                                    return {
                                        sx: { backgroundColor: '#87c7ff' }
                                    }
                                }
                            }}
                        />
                    </div>
                )}
                {listScheduleInTable.length === 0 && (
                    <div>
                        <Alert
                            icon={<IconAlertCircle size="1rem" />}
                            title="Chú ý !"
                            color=""
                            gray
                        >
                            <Text weight={500}>
                                Vui lòng chọn lớp học để xem thời khóa biểu !!
                            </Text>
                        </Alert>
                    </div>
                )}
            </div>
        </>
    )
}
export default Schedule
