import {
    Badge,
    Button,
    Center,
    Container,
    Grid,
    Group,
    HoverCard,
    Select,
    Stack,
    Text
} from '@mantine/core'
import MaterialReactTable from 'material-react-table'
import { useMemo } from 'react'
import { useState } from 'react'
import { formatDate } from '../../../utils/formater'
import classApi from '../../../api/classApi'
import { useEffect } from 'react'
import { convertArrayToLabel } from '../../../utils/Convertor'
import scheduleApi from '../../../api/scheduleApi'
import moment from 'moment'
const listOptionView = [
    {
        value: 'month',
        label: 'Tháng trước'
    },
    {
        value: 'halfMonth',
        label: '14 ngày trước'
    },
    {
        value: 'twoMonth',
        label: '2 tháng trước'
    }
]
const Schedule = (props) => {
    const [classSelected, setClassSelected] = useState([])
    const [classes, setClasses] = useState([])
    const [listSchedule, setListSchedule] = useState([])
    const [loadingSchedule, setLoadingSchedule] = useState(false)
    const formatDate = (date) => {
        const formattedDate = moment(new Date(date))
            .subtract(1, 'days')
            .locale('vi')
            .format('dddd, DD/MM/yyyy')
        console.log('🚀 ~ file: Schedule.js:32 ~ formatDate ~ date:', date)
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }
    const columnsSchedule = useMemo(
        () => [
            {
                accessorKey: 'studyDate',
                header: 'Ngày học',
                accessorFn: (row) => {
                    console.log(row.studyDate)
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
            }
        ],
        []
    )

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
            setLoadingSchedule(true)
            const resp = await scheduleApi.getScheduleByClassId(classId)
            console.log(
                '🚀 ~ file: Schedule.js:102 ~ getScheduleByClassId ~ resp:',
                resp
            )
            if (resp.status === 200) {
                const { listSchedules, sessionName, classroomName, teacher } = {
                    ...resp.data
                }
                console.log(
                    '🚀 ~ file: Schedule.js:130 ~ getScheduleByClassId ~ listSchedules:',
                    listSchedules
                )
                var schedule = listSchedules

                    .map((item) => {
                        return {
                            scheduleId: item.scheduleId,
                            studyDate: item.studyDate,
                            session: sessionName,
                            classroom: classroomName,
                            isPractice: item.isPractice,
                            teacherName: teacher.fullname,
                            content: item.content
                        }
                    })
                    .filter((item) => new Date(item.studyDate) >= new Date())
                console.log(
                    '🚀 ~ file: Schedule.js:152 ~ getScheduleByClassId ~ schedule:',
                    schedule
                )

                setListSchedule([...schedule])
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
                        value={classSelected}
                        onChange={(classId) => {
                            getScheduleByClassId(classId)
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
                    data={listSchedule}
                    muiTablePaginationProps={{
                        rowsPerPageOptions: [10, 20, 50, 100],
                        showFirstButton: true,
                        showLastButton: true
                    }}
                />
            </div>
        </>
    )
}

export default Schedule
