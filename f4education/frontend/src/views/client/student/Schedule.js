import {
    Alert,
    Badge,
    Box,
    Button,
    Group,
    HoverCard,
    Loader,
    LoadingOverlay,
    Progress,
    Select,
    Text
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import MaterialReactTable from 'material-react-table'
import moment from 'moment'
import { memo, useEffect, useMemo, useState } from 'react'
import classApi from '../../../api/classApi'
import scheduleApi from '../../../api/scheduleApi'
import { convertArrayToLabel } from '../../../utils/Convertor'
import { useSearchParams } from 'react-router-dom'
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
const Schedule = () => {
    const today = new Date('2024-01-04').toDateString().substring(4, 16)
    const [showSchedule, setShowSchedule] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
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

        const presentSchedule = allSchedules.filter((item) => {
            return (
                new Date(item.studyDate.substring(0, 10)) >= new Date(today) // test
            )
        })
        let newScheduleInThePast = [...schedulesInThePast]

        // val is number of date
        switch (val) {
            case '15':
                if (viewValue === '15') return
                if (schedulesInThePast.length >= 15) {
                    newScheduleInThePast = [...schedulesInThePast.slice(-15)]
                }
                break
            case '30':
                if (viewValue === '30') return
                if (schedulesInThePast.length >= 30) {
                    newScheduleInThePast = [...schedulesInThePast.slice(-30)]
                }
                break
            case '60':
                if (viewValue === '60') return
                if (schedulesInThePast.length >= 60) {
                    newScheduleInThePast = [...schedulesInThePast.slice(-60)]
                }
                break

            default:
                newScheduleInThePast = schedulesInThePast
                break
        }
        setViewValue(val)

        setListScheduleInTable([...newScheduleInThePast, ...presentSchedule])
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
    const getScheduleByClassId = async () => {
        try {
            const classId = searchParams.get('classId')
            console.log(
                '🚀 ~ file: Schedule.js:181 ~ getScheduleByClassId ~ classId:',
                classId
            )
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
        // getAllClassByStudentId()
        getScheduleByClassId()
    }, [])
    return (
        <>
            <Box mt="xl" className="d-inline-block">
                <Button
                    color="violet"
                    // size="lg"
                    onClick={() => setShowSchedule((prev) => !prev)}
                >
                    {showSchedule ? 'Ẩn ' : 'Xem '} thời khóa biểu
                </Button>
            </Box>
            {showSchedule && (
                <>
                    <Select
                        label="Xem thêm "
                        placeholder="Chọn thời gian "
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
                    <div className="mt-2  pb-3">
                        {listScheduleInTable.length > 0 && (
                            <div pos={'relative'}>
                                {/* <LoadingOverlay visible={loadingSchedule} /> */}
                                <MaterialReactTable
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
                                        if (
                                            new Date(row.original.studyDate)
                                                .toDateString()
                                                .substring(4, 16) === today
                                        ) {
                                            return {
                                                sx: {
                                                    backgroundColor: '#87c7ff',
                                                    cursor: 'pointer'
                                                }
                                            }
                                        }
                                        return {
                                            sx: {
                                                cursor: 'pointer',
                                                '& tr:nth-of-type(odd)': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {listScheduleInTable.length === 0 &&
                            loadingSchedule && (
                                <>
                                    <div className="w-100 text-center mt-6">
                                        <Loader
                                            color="rgba(46, 46, 46, 1)"
                                            size={50}
                                        />
                                        <h3 className="text-muted mt-3">
                                            Vui lòng chờ trong giây lát!
                                        </h3>
                                    </div>
                                </>
                            )}
                        {listScheduleInTable.length === 0 &&
                            !loadingSchedule && (
                                <div>
                                    <Alert
                                        icon={<IconAlertCircle size="1rem" />}
                                        title="Thông báo!"
                                        color=""
                                        gray
                                    >
                                        <Text weight={500}>
                                            Bạn chưa có thời khóa biểu cho lớp
                                            này!
                                        </Text>
                                    </Alert>
                                </div>
                            )}
                    </div>
                </>
            )}
        </>
    )
}
export default Schedule
