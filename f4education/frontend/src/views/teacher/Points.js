import {
    Box,
    Button,
    Center,
    Group,
    Modal,
    NumberInput,
    Paper,
    Stack,
    Title,
    Tooltip
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Edit as EditIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { IconDeviceFloppy } from '@tabler/icons-react'
import MaterialReactTable from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import pointApi from '../../api/pointApi'
import Notify from '../../utils/Notify'
import { ToastContainer, toast } from 'react-toastify'

const Points = () => {
    const params = useParams()
    const [listPoint, setListPoint] = useState({
        pointId: 0,
        studentName: '',
        studentId: '',
        quizzPoint: 0,
        attendancePoint: 0,
        exercisePoint: 0,
        averagePoint: 0
    })
    const [listEditedPoint, setListEditedPoint] = useState([])
    const [validate, setValidate] = useState()
    const [editModal, handlersEditModal] = useDisclosure(false, {
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed')
    })
    const [editPoint, setEditPoint] = useState({
        pointId: 0,
        studentName: '',
        studentId: '',
        quizzPoint: 0,
        attendancePoint: 0,
        exercisePoint: 0,
        averagePoint: 0
    })
    const [loadingGetAllPoint, setLoadingGetAllPoint] = useState(false)
    const getAllPointsByClassId = async () => {
        try {
            setLoadingGetAllPoint(true)
            const resp = await pointApi.getAllPointByClassId(params.classId)
            if (resp.status === 200) {
                setListPoint(
                    resp.data.listPointsOfStudent.map((item) => {
                        const {
                            pointId,
                            averagePoint,
                            exercisePoint,
                            quizzPoint,
                            attendancePoint,
                            studentName,
                            studentId
                        } = { ...item }

                        return {
                            pointId: pointId,
                            studentName: studentName,
                            studentId: studentId,
                            quizzPoint: quizzPoint,
                            attendancePoint: attendancePoint,
                            exercisePoint: exercisePoint,
                            averagePoint: averagePoint
                        }
                    })
                )
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: Points.js:11 ~ getAllPoints ~ error:',
                error
            )
            setLoadingGetAllPoint(false)
        }
        setLoadingGetAllPoint(false)
    }

    const handelShowEditModal = (point) => {
        console.log(
            '🚀 ~ file: Points.js:63 ~ handelShowEditModal ~ pointId:',
            point
        )
        handlersEditModal.open()
        setEditPoint({ ...point })
    }
    const handleOnChangeExercisePoint = (val) => {
        console.log(typeof val)
        if (val === '') {
            setValidate('Điểm không hợp lệ !')
        } else if (val !== '') {
            setValidate('')
            const avgPoint =
                editPoint.attendancePoint * 0.1 +
                val * 0.5 +
                editPoint.quizzPoint * 0.4
            setEditPoint((prev) => ({
                ...prev,
                exercisePoint: val,
                averagePoint: avgPoint
            }))
        }
    }
    const handleAgreeEditPoint = () => {
        handlersEditModal.close()

        setListPoint(
            listPoint.map((item) => {
                if (item.pointId === editPoint.pointId) {
                    return {
                        ...editPoint
                    }
                }
                return item
            })
        )
        var foundItem = listEditedPoint.find(
            (item) => item.pointId === editPoint.pointId
        )
        console.log(
            '🚀 ~ file: Points.js:127 ~ handleAgreeEditPoint ~ foundItem:',
            editPoint
        )
        if (foundItem !== undefined) {
            setListEditedPoint(
                listEditedPoint.map((item) => {
                    if (item.pointId === editPoint.pointId) {
                        const avgPoint =
                            editPoint.attendancePoint * 0.1 +
                            editPoint.exercisePoint * 0.5 +
                            editPoint.quizzPoint * 0.5
                        return {
                            ...editPoint,
                            averagePoint: avgPoint
                        }
                    }
                    return item
                })
            )
        } else if (foundItem === undefined) {
            setListEditedPoint([...listEditedPoint, editPoint])
        }
    }
    const handleSavePoint = async () => {
        try {
            toast(Notify.msg.updateSuccess, Notify.options.updateSuccess())
            console.log(listEditedPoint)
            // const pointRequest = {
            //     classId: params.classId,
            //     listPointOfStudent: listEditedPoint
            // }
            // const resp = await pointApi.savePoint(pointRequest)
            // console.log(
            //     '🚀 ~ file: Points.js:165 ~ handleSavePoint ~ resp:',
            //     resp
            // )
        } catch (error) {
            console.log(
                '🚀 ~ file: Points.js:155 ~ handleSavePoint ~ error:',
                error
            )
        }
    }
    const renderAveragePoint = () => {
        const avgPoint =
            editPoint.attendancePoint * 0.1 +
            editPoint.exercisePoint * 0.5 +
            editPoint.quizzPoint * 0.5
        return avgPoint.toFixed(2)
    }
    //! KIEM TRA LAI DIEM CHUYEN CAN VA DIEM QUIZZ
    const columnsPoints = useMemo(
        () => [
            {
                accessorKey: 'studentName',
                header: 'Tên học viên',
                size: 80
            },
            {
                accessorKey: 'quizzPoint',
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    return <span>{row.toFixed(2)}</span>
                },
                header: 'Kiểm tra',
                size: 200
            },
            {
                accessorKey: 'attendancePoint',
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    return <span>{row.toFixed(2)}</span>
                },
                header: 'Điểm danh',
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    return <span>{row.toFixed(2)}</span>
                },
                size: 150
            },
            {
                accessorKey: 'exercisePoint',
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    return <span>{row.toFixed(2)}</span>
                },
                header: 'Bài tập',
                size: 35
            },
            {
                accessorKey: 'averagePoint',
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    return <span>{row.toFixed(2)}</span>
                },
                header: 'Trung bình',
                size: 35
            }
        ],
        []
    )

    useEffect(() => {
        getAllPointsByClassId()
    }, [])
    return (
        <div>
            <ToastContainer />{' '}
            <MaterialReactTable
                muiTableBodyProps={{
                    sx: {
                        //stripe the rows, make odd rows a darker color
                        '& tr:nth-of-type(odd)': {
                            backgroundColor: '#f5f5f5'
                        }
                    }
                }}
                enableEditing={true}
                enableStickyHeader
                enableStickyFooter
                enableRowNumbers
                state={{ isLoading: loadingGetAllPoint }}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: 'Thao tác',
                        size: 20
                        // Something else here
                    },
                    'mrt-row-numbers': {
                        size: 5
                    }
                }}
                positionActionsColumn="last"
                columns={columnsPoints}
                data={listPoint}
                renderTopToolbarCustomActions={() => (
                    <Button
                        onClick={() => {
                            handleSavePoint()
                        }}
                        color="blue"
                    >
                        <IconDeviceFloppy /> Lưu thay đổi
                    </Button>
                )}
                enableRowActions
                renderRowActions={({ row, table }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: '8px'
                        }}
                    >
                        <IconButton
                            color="info"
                            onClick={() => {
                                handelShowEditModal(row.original)
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                )}
                muiTablePaginationProps={{
                    labelRowsPerPage: 'Hiển thị: ',

                    rowsPerPageOptions: [10, 20, 50, 100],
                    showFirstButton: true,
                    showLastButton: true
                }}
            />
            {/* Modals */}
            <Modal.Root
                opened={editModal}
                onClose={handlersEditModal.close}
                centered
                size={'lg'}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Chi tiết điểm học viên </Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Paper shadow="xs" mt={'md'} p="md">
                            <Group grow>
                                <Stack>
                                    <Tooltip
                                        withArrow
                                        label="Điểm được tự động tính dựa trên số buổi vắng (chiếm 10% trọng số)"
                                    >
                                        <Center>Chuyên cần</Center>
                                    </Tooltip>
                                    <Center>
                                        <Title order={1} color="blue">
                                            {editPoint.attendancePoint.toFixed(
                                                2
                                            )}
                                        </Title>
                                    </Center>
                                </Stack>
                                <Stack>
                                    <Tooltip
                                        withArrow
                                        label="Điểm được tự động tính dựa trên bài kiểm tra cuối khóa (chiếm 40% trọng số)"
                                    >
                                        <Center>Kiểm tra(Quizz)</Center>
                                    </Tooltip>
                                    <Center>
                                        <Title order={1} color="blue">
                                            {editPoint.quizzPoint.toFixed(2)}
                                        </Title>
                                    </Center>
                                </Stack>
                                <Stack>
                                    <Tooltip
                                        withArrow
                                        label="Điểm giáo viên chấm bài (chiếm 50% trọng số)"
                                    >
                                        <Center>Bài tập</Center>
                                    </Tooltip>
                                    <Center>
                                        <Title order={1} color="blue">
                                            {editPoint.exercisePoint
                                                ? parseFloat(
                                                      editPoint.exercisePoint
                                                  ).toFixed(2)
                                                : 0}
                                        </Title>
                                    </Center>
                                </Stack>
                                <Stack>
                                    <Tooltip
                                        withArrow
                                        label="Điểm được tự động tính dựa tổng điểm cuối khóa"
                                    >
                                        <Center>Điểm trung bình</Center>
                                    </Tooltip>
                                    <Center>
                                        <Title order={1} color="blue">
                                            {renderAveragePoint()}
                                        </Title>
                                    </Center>
                                </Stack>
                            </Group>
                        </Paper>
                        <Stack mt={'md'}>
                            <Group grow>
                                <NumberInput
                                    label="Điểm bài tập"
                                    precision={2}
                                    min={0}
                                    step={0.05}
                                    max={10}
                                    error={validate ? validate : ''}
                                    hideControls
                                    value={editPoint.exercisePoint}
                                    onChange={(val) => {
                                        handleOnChangeExercisePoint(val)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAgreeEditPoint()
                                        }
                                    }}
                                    onFocus={(e) => {
                                        e.target.select()
                                    }}
                                />
                            </Group>
                        </Stack>
                        <Group position="apart" grow mt={'md'}>
                            <Button
                                onClick={handleAgreeEditPoint}
                                variant="filled"
                                color="blue"
                            >
                                {' '}
                                Xác nhận{' '}
                            </Button>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </div>
    )
}

export default Points
