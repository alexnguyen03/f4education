import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Flex,
    Grid,
    Group,
    Image,
    Modal,
    rem,
    SegmentedControl,
    Skeleton,
    Stack,
    Text,
    Title,
    useMantineTheme
} from '@mantine/core'
import { MaterialReactTable } from 'material-react-table'
import { Dropzone } from '@mantine/dropzone'
import { IconUpload, IconPhoto, IconX, IconEye } from '@tabler/icons-react'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'

// API
import classApi from '../../api/classApi'
import resourceApi from 'api/resourceApi'
import attendanceApi from '../../api/attendanceApi'
import scheduleApi from '../../api/scheduleApi'

// scss
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'
import { useDisclosure } from '@mantine/hooks'
import questionApi from '../../api/questionApi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Notify from '../../utils/Notify'

const teacherId = 'nguyenhoainam121nTC'
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const ClassInformationDetail = () => {
    // ************* Routes Variable
    const data = useParams()
    let navigate = useNavigate()

    // ************* Main variable
    const [students, setStudents] = useState([])
    const [classInfor, setClassInfor] = useState({
        classId: '',
        className: '',
        startDate: '',
        endDate: '',
        status: '',
        maximumQuantity: ''
    })
    const [courseName, setCourseName] = useState('')

    // ************* Action variable
    const [loading, setLoading] = useState(false)
    const [classStudyToday, setClassStudyToday] = useState(false)

    const [examOpened, handlers] = useDisclosure(false, {
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed')
    })

    const [activedExam, setActivedExam] = useState(false)
    const [seletedStudent, setSletedStudent] = useState({
        studentId: '',
        fullname: '',
        image: ''
    })

    const [opened, { open, close }] = useDisclosure(false)

    const [openConfirm, setOpenConfirm] = useState(false)

    const openModal = () => {
        setOpenConfirm(true)
    }

    const closeModal = () => {
        setOpenConfirm(false)
    }

    const theme = useMantineTheme()
    const [selectedFile, setSelectedFile] = useState([null])

    // ************* fetch Area
    const fetchClass = async () => {
        try {
            const resp = await classApi.getByClassId(data.classId)
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:95 ~ fetchClass ~ resp:',
                resp
            )

            const newData = resp.data.students.map((data) => {
                return {
                    ...data,
                    isPresent: true
                }
            })
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:106 ~ newData ~ newData:',
                newData
            )

            setStudents(newData)
            if (resp.status === 200 && resp.data != null) {
                setClassInfor(resp.data)
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchClassByTeacher = async () => {
        try {
            const resp = await classApi.getAllClassByTeacherId(teacherId)
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:109 ~ fetchClassByTeacher ~ resp:',
                resp
            )
            if (resp.status === 200 && resp.data.length > 0) {
                const studentRespData = resp.data[0].students

                // const newData = studentRespData.map((data) => {
                //     return {
                //         ...data,
                //         isPresent: true
                //     }
                // })

                // setStudents(newData)
                setCourseName(resp.data[0].courseName[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkIfClassStudyToDay = async () => {
        const today = moment(new Date()).format('DD-MM-yyyy')
        try {
            const resp = await scheduleApi.findAllScheduleByClassAndStudyDate(
                data.classId,
                today
            )

            console.log(resp.data)

            if (resp.status === 200 && resp.data.length > 0) {
                setClassStudyToday(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const settingQuizz = async () => {
        const classId = classInfor.classId
        console.log(
            '🚀 ~ file: ClassInformationDetail.js:101 ~ settingQuizz ~ classId:',
            classId
        )
        try {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            const resp = await questionApi.createExamination(classId)
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:103 ~ settingQuizz ~ resp:',
                resp
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())
            } else {
                toast.update(id, Notify.options.createError())
            }
        } catch (error) {
            toast(Notify.options.createError())
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:105 ~ settingQuizz ~ error:',
                error
            )
        }
        checkActivedExam()
        handlers.close()
    }

    const checkActivedExam = async () => {
        const classId = data.classId

        try {
            const resp = await questionApi.checkActivedExam(classId)
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:182 ~ checkActivedExam ~ resp:',
                resp
            )

            if (resp.status === 200 && resp.data) {
                setActivedExam(true)
            } else {
                setActivedExam(false)
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:134 ~ checkActivedExam ~ error:',
                error
            )
        }
    }

    const redirectTo = () => {
        return navigate('/teacher/class-infor')
    }

    // ********* Action Area
    const handlCheckAttandance = (e, studentIdParam) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) => {
                if (student.studentId.trim() === studentIdParam.trim()) {
                    if (e.target.defaultValue === 'present') {
                        console.log('ok')
                        return {
                            ...student,
                            isPresent: true
                        }
                    } else if (e.target.defaultValue === 'absent') {
                        console.log('ok')
                        return {
                            ...student,
                            isPresent: false
                        }
                    }
                }
                return student
            })
        )
    }

    const handleSaveAttendance = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        const listAbsent = students.filter((student) => !student.isPresent)

        const body = listAbsent.map((lst) => {
            return {
                classId: parseInt(data.classId),
                studentId: lst.studentId
            }
        })

        console.log(body)

        try {
            const resp = await attendanceApi.createAttendance(body)

            console.log(resp)

            if (resp.status === 200) {
                toast.update(
                    id,
                    Notify.options.createSuccessParam('Điểm danh thành công')
                )
            }
        } catch (error) {
            toast.update(
                id,
                Notify.options.createErrorParam('Điểm danh thất bại')
            )
            console.log(error)
        }
    }

    // ********* Material table variable
    const columnStudent = useMemo(
        () => [
            {
                accessorKey: 'studentId',
                header: 'Mã sinh viên',
                enableEditing: false,
                enableSorting: false,
                size: 20
            },
            {
                accessorKey: 'fullname',
                header: 'Tên Sinh viên',
                size: 80
            },
            {
                accessorKey: 'image',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return (
                        <Image
                            src={`${PUBLIC_IMAGE}/courses/${row.image}`}
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
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    return (
                        <SegmentedControl
                            color="teal"
                            data={[
                                { label: 'Có mặt', value: 'present' },
                                { label: 'Vắng mặt', value: 'absent' }
                            ]}
                            onClick={(e) => {
                                handlCheckAttandance(e, row.studentId)
                            }}
                        />
                    )
                },
                header: 'Có / Vắng',
                size: 50
            }
        ],
        []
    )

    const handleShowTask = (classId) => {
        navigate({
            pathname: '/teacher/download-task-student',
            search: `?${createSearchParams({
                classId: classId
            })}`
        })
    }

    const uploadResource = async (courseName) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

        const formData = new FormData()
        formData.append('courseName', courseName)
        formData.append('type', 'TÀI NGUYÊN')
        for (var i = 0; i < selectedFile.length; i++) {
            formData.append('file', selectedFile[i])
        }
        console.log([...formData])
        try {
            const resp = await resourceApi.uploadResource(formData)
            if (resp.status === 200) {
                toast.update(id, Notify.options.uploadFileSuccess())
                closeModal()
                close(true)
            }
        } catch (error) {
            console.log('Upload thất bại', error)
        }
    }

    // Use Effect Area
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await Promise.all([
                fetchClass(),
                fetchClassByTeacher(),
                checkActivedExam(),
                checkIfClassStudyToDay()
            ])
            setLoading(false)
        }

        fetchData()
    }, [])

    return (
        <>
            <ToastContainer />

            {/* Header */}
            <Box my={'md'} className={styles['box-header']}>
                <Group position="apart" px={'lg'} py={'md'}>
                    {/* <Button color="cyan" size="md"> */}
                    <div
                        onClick={() => redirectTo()}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    {/* </Button> */}
                    <Title order={3} color="dark">
                        Chi tiết lớp học: {classInfor.className}
                    </Title>
                </Group>
            </Box>

            <Grid>
                {/* Left side */}
                <Grid.Col xl={3} lg={3}>
                    {loading ? (
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section>
                                <Flex
                                    direction="column"
                                    justify="center"
                                    align="center"
                                >
                                    <Skeleton
                                        width={90}
                                        height={90}
                                        circle
                                        mb={25}
                                        mt={90}
                                    />
                                    <Skeleton
                                        width="100%"
                                        height={15}
                                        mb={15}
                                    />
                                    <Skeleton
                                        width="100%"
                                        height={15}
                                        mb={15}
                                    />
                                    <Skeleton
                                        width="100%"
                                        height={15}
                                        mb={15}
                                    />
                                    <Skeleton
                                        width="100%"
                                        height={15}
                                        mt={25}
                                    />
                                </Flex>
                            </Card.Section>
                        </Card>
                    ) : (
                        <Card
                            // padding="xl"
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            className={styles.card}
                        >
                            <Card.Section
                                h={200}
                                style={{
                                    backgroundImage:
                                        'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)'
                                }}
                            />
                            {/* <Image
                                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                                    height={160}
                                    alt="Norway"
                                    className={styles.avatar}
                                /> */}
                            <Avatar
                                src="https://th.bing.com/th/id/OIP.0MP14fOr1ykZDCnNZ5grFwHaGZ?pid=ImgDet&rs=1"
                                size={80}
                                radius={80}
                                mx="auto"
                                mt={-30}
                            />
                            <Title order={2} fw={500} mt="sm" align="center">
                                {classInfor.className}
                            </Title>
                            <Text
                                ta="center"
                                fz="lg"
                                mt={'md'}
                                c="dimmed"
                                align="center"
                            >
                                {courseName}
                            </Text>
                            <Text
                                c="dimmed"
                                mt="md"
                                fz="md"
                                align="center"
                                gap={30}
                            >
                                Từ ngày{' '}
                                {moment(classInfor.startDate).format(
                                    'DD/MM/yyyy'
                                ) === 'Invalid date'
                                    ? 'ngày không khả dụng'
                                    : moment(classInfor.startDate).format(
                                          'DD/MM/yyyy'
                                      )}{' '}
                                -{' '}
                                {moment(classInfor.endDate).format(
                                    'DD/MM/yyyy'
                                ) === 'Invalid date'
                                    ? 'ngày không khả dụng'
                                    : moment(classInfor.endDate).format(
                                          'DD/MM/yyyy'
                                      )}
                            </Text>
                            <Flex
                                align={'center'}
                                justify="space-between"
                                mt="lg"
                            >
                                <Text
                                    ta="center"
                                    fz="md"
                                    c="dimmed"
                                    align="left"
                                >
                                    Trạng thái:
                                </Text>
                                <Badge color="indigo" radius="sm" mt={rem(3)}>
                                    {classInfor.status}
                                </Badge>
                            </Flex>
                            <Stack my={'xl'}>
                                {/* <Button
                                        fullWidth
                                        radius="md"
                                        mt="xl"
                                        size="md"
                                        variant="default"
                                        onClick={() => redirectTo()}
                                    >
                                        Trở về
                                    </Button> */}
                                <Button
                                    onClick={handlers.open}
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    disabled={activedExam}
                                >
                                    Tạo quiz
                                </Button>
                                <Button
                                    color="indigo"
                                    size="md"
                                    mb="md"
                                    onClick={() => {
                                        navigate(
                                            '/teacher/class-info/point/' +
                                                classInfor.classId
                                        )
                                    }}
                                >
                                    Nhập điểm
                                </Button>
                                <Button color="cyan" size="md" mb="md">
                                    Giao bài tập
                                </Button>
                                <Button
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    onClick={() => {
                                        handleShowTask(classInfor.classId)
                                    }}
                                >
                                    Download bài tập
                                </Button>
                                <Button
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    onClick={() => {
                                        open()
                                    }}
                                >
                                    Upload tài nguyên
                                </Button>
                            </Stack>
                        </Card>
                    )}
                </Grid.Col>

                {/* Right side */}
                <Grid.Col xl={9} lg={9}>
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
                                <Flex justify="space-between" align="center">
                                    <Group position="left">
                                        {classStudyToday ? (
                                            <>
                                                <Button
                                                    color="violet"
                                                    size="md"
                                                    mb="lg"
                                                    onClick={() =>
                                                        handleSaveAttendance()
                                                    }
                                                >
                                                    Lưu điểm danh
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    color="violet"
                                                    size="md"
                                                    mb="lg"
                                                    onClick={() =>
                                                        handleSaveAttendance()
                                                    }
                                                    disabled
                                                >
                                                    Lưu điểm danh
                                                </Button>
                                            </>
                                        )}
                                    </Group>

                                    <Text color="dark" fz="lg" fw={500}>
                                        Tổng sinh viên:{' '}
                                        {students.length > 0
                                            ? students.length
                                            : 0}{' '}
                                        / {classInfor.maximumQuantity}.
                                    </Text>
                                </Flex>

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
                                    data={students}
                                    enableColumnOrdering
                                    enableStickyHeader
                                    displayColumnDefOptions={{
                                        'mrt-row-numbers': {
                                            size: 5
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
                </Grid.Col>
            </Grid>

            {/*Modals  */}
            <Modal.Root opened={examOpened} onClose={handlers.close} centered>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Xác nhận tạo bài kiểm tra </Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Title order={3} weight={100} align="center">
                            Bạn có chắc chắn muốn tạo bài kiểm tra cho lớp{' '}
                            {classInfor.className} không ?{' '}
                        </Title>
                        <Group grow mt={'lg'}>
                            <Button color="red">Không, để sau</Button>
                            <Button onClick={settingQuizz} color="teal">
                                Có, tạo ngay
                            </Button>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
            <Modal size="70%" opened={opened} onClose={close} centered>
                <Center>
                    <Title order={2} mb={30}>
                        Upload tài nguyên
                    </Title>
                </Center>
                <Dropzone
                    onDrop={(files) => {
                        const selectedFiles = Array.from(files)
                        setSelectedFile(selectedFiles)
                    }}
                    maxSize={3 * 1024 ** 2}
                    name="excelFile"
                >
                    <Group
                        position="center"
                        spacing="xl"
                        style={{
                            minHeight: rem(220),
                            pointerEvents: 'none'
                        }}
                    >
                        <Dropzone.Accept>
                            <IconUpload
                                size="3.2rem"
                                stroke={1.5}
                                color={
                                    theme.colors[theme.primaryColor][
                                        theme.colorScheme === 'dark' ? 4 : 6
                                    ]
                                }
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                size="3.2rem"
                                stroke={1.5}
                                color={
                                    theme.colors.red[
                                        theme.colorScheme === 'dark' ? 4 : 6
                                    ]
                                }
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size="3.2rem" stroke={1.5} />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                Thả files excel vào đây hoặc click vào để chọn
                                files
                            </Text>
                            <Text size="sm" color="dimmed" inline mt={7}>
                                Thả mỗi lần một file, lưu ý dung lượng file phải
                                dưới 5MB
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
                <Flex
                    mt={30}
                    mih={50}
                    gap="md"
                    justify="flex-end"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Button
                        color="default"
                        outline
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            close(true)
                        }}
                    >
                        Trở lại
                    </Button>
                    <Button color={'teal'} type="button" onClick={openModal}>
                        Upload
                    </Button>
                </Flex>
            </Modal>
            <Modal opened={openConfirm} onClose={closeModal} title="Thông báo">
                <Text size="lg">Bạn có chắc chắn muốn Upload ???</Text>
                <Button
                    onClick={() => {
                        uploadResource(courseName)
                        closeModal()
                    }}
                    className="float-right"
                    mt={30}
                >
                    Upload
                </Button>
                <Button
                    onClick={closeModal}
                    color="red"
                    mr={10}
                    mb={20}
                    mt={30}
                    className="float-right"
                >
                    Hủy
                </Button>
            </Modal>
        </>
    )
}

export default ClassInformationDetail
