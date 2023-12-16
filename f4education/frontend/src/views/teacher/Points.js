import {
    Button,
    Center,
    Flex,
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
import { Box, IconButton } from '@mui/material'
import { pdf, usePDF } from '@react-pdf/renderer'
import { IconDeviceFloppy } from '@tabler/icons-react'
import MaterialReactTable from 'material-react-table'
import moment from 'moment/moment'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

// API
import certificateApi from '../../api/certificateApi'
import pointApi from '../../api/pointApi'
import classApi from '../../api/classApi'
import scheduleApi from '../../api/scheduleApi'

// Utils
import Notify from '../../utils/Notify'

// component Import
import CertificateDownload from '../PDF/CertificateDownload'

const Points = () => {
    const params = useParams()
    let navigate = useNavigate()
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

    // certificate variable
    const [classIsFinish, setClassIsFinish] = useState(false)
    const certificateIdRef = useRef()

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
                            studentId,
                            registerCourseId,
                            courseName
                        } = { ...item }

                        return {
                            pointId: pointId,
                            studentName: studentName,
                            studentId: studentId,
                            quizzPoint: quizzPoint,
                            attendancePoint: attendancePoint,
                            exercisePoint: exercisePoint,
                            averagePoint: averagePoint,
                            registerCourseId: registerCourseId,
                            courseName: courseName
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
            const pointRequest = {
                classId: params.classId,
                listPointOfStudent: listEditedPoint
            }
            const resp = await pointApi.savePoint(pointRequest)
            console.log(
                '🚀 ~ file: Points.js:165 ~ handleSavePoint ~ resp:',
                resp
            )
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

    // Check for certificateId and end class
    const handleCheckIfClassIsClose = async () => {
        try {
            const resp = await scheduleApi.getScheduleByClassId(params.classId)
            console.log(resp.data)

            if (resp.status === 200) {
                const respData = resp.data
                const today = moment(new Date())
                const lastItem =
                    respData.listSchedules[respData.listSchedules.length - 1]

                if (today.isAfter(moment(lastItem.studyDate))) {
                    setClassIsFinish(true)
                    return console.log('class is Done')
                } else {
                    setClassIsFinish(false)
                    return console.log('class is studying')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [instance, updateInstance] = usePDF({
        document: (
            <CertificateDownload
                certificateId={
                    parseInt(certificateIdRef.current)
                        ? parseInt(certificateIdRef.current)
                        : 18
                }
            />
        )
    })

    const awaitComplete = (isComplete) => {
        return isComplete ? true : false
    }

    const handleEndClassAndSendCertificate = async () => {
        const filterData = listPoint.filter((item) => item.averagePoint > 5)

        const id = toast(Notify.msg.loading, Notify.options.loading())
        const listCertificate = filterData.map((item) => {
            return {
                certificateName: `Chứng chỉ xác nhận hoàn thành khóa học ${item.courseName}`,
                registerCourseId: item.registerCourseId
            }
        })

        if (filterData.length > 0) {
            try {
                const resp = await certificateApi.createCertificate(
                    listCertificate
                )
                if (resp.status === 200) {
                    console.log(resp.data)

                    const updatedListCertificateDownload = []

                    for (let i = 0; i < resp.data.length; i++) {
                        const item = resp.data[i]
                        certificateIdRef.current = item.certificateId

                        // await Promise.all([
                        //     updateInstance(
                        //         <CertificateDownload
                        //             certificateId={parseInt(
                        //                 certificateIdRef.current
                        //             )}
                        //             awaitComplete={awaitComplete}
                        //         />
                        //     )
                        // ])

                        const blob = await pdf(
                            <CertificateDownload
                                certificateId={parseInt(
                                    certificateIdRef.current
                                )}
                            />
                        ).toBlob()

                        console.log(blob)

                        updatedListCertificateDownload.push({
                            blob: blob,
                            certificateId: item.certificateId
                        })
                    }

                    await handleDownloadAndSendMail(
                        updatedListCertificateDownload
                    )

                    await handleEndClass(params.classId)

                    toast.update(
                        id,
                        Notify.options.createSuccessParam(
                            'Gửi chứng nhận và kết thúc lớp học thành công'
                        )
                    )
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('filter null')
        }
    }

    useEffect(() => {
        getAllPointsByClassId()
        handleCheckIfClassIsClose()
    }, [])

    const handleDownloadAndSendMail = async (
        updatedListCertificateDownload
    ) => {
        try {
            const formData = new FormData()

            const listBlob = updatedListCertificateDownload.map(
                (item) => item.blob
            )
            const listCertoficates = updatedListCertificateDownload.map(
                (item) => item.certificateId
            )
            console.log(listBlob)
            console.log(listCertoficates)

            for (const blob of listBlob) {
                formData.append('files', blob)
            }
            for (const certificateId of listCertoficates) {
                formData.append('certificateIds', certificateId)
            }
            // formData.append('files', ...listBlob)
            // formData.append('certificateIds', ...listCertoficates)

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1])
            }

            const response = await certificateApi.downloadCertificate(formData)
            console.log(response.data)
        } catch (error) {
            console.error('Error uploading files:', error)
        }
    }

    const handleEndClass = async (classId) => {
        try {
            const resp = await classApi.endClass(classId)

            if (resp.status === 200) {
                console.log('close class')
                navigate('/teacher/class-infor')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <ToastContainer />

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
                    <Flex justify="left" gap={10} align="center">
                        <Button
                            onClick={() => {
                                handleSavePoint()
                            }}
                            color="blue"
                        >
                            <IconDeviceFloppy /> Lưu thay đổi
                        </Button>
                        {classIsFinish && (
                            <Button
                                onClick={() => {
                                    handleEndClassAndSendCertificate()
                                }}
                                color="violet"
                            >
                                Kết thúc khóa học
                            </Button>
                        )}
                    </Flex>
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
