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

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const ClassInformationDetail = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // ************* Routes Variable
    const data = useParams()
    let navigate = useNavigate()

    // ************* Main variable
    const [students, setStudents] = useState([])
    const [classInfor, setClassInfor] = useState({
        classId: '',
        className: '',
        courseName: '',
        startDate: '',
        endDate: '',
        status: '',
        maximumQuantity: ''
    })
    const [courseName, setCourseName] = useState('')

    // ************* Action variable
    const [loading, setLoading] = useState(false)
    const [classStudyToday, setClassStudyToday] = useState(false)

    const [examOpenedAgain, handlersAgain] = useDisclosure(false, {
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed')
    })

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
            const resp = await classApi.getAllClassByTeacherId(user.username)
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
        try {
            const resp = await scheduleApi.findAllScheduleByClassAndStudyDate(
                data.classId
            )

            if (resp.status === 200) {
                console.log(resp.data)
                setClassStudyToday(true)
            } else {
                console.log('class dont study today')
                setClassStudyToday(false)
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

    const updateExamination = async () => {
        const classId = classInfor.classId
        try {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            const resp = await questionApi.updateExamination(classId)
            if (resp.status === 200) {
                toast.update(id, Notify.options.againSuccess())
            } else {
                toast.update(id, Notify.options.updateError())
            }
        } catch (error) {
            toast(Notify.options.updateError())
            console.log(
                '🚀 ~ file: ClassInformationDetail.js:105 ~ settingQuizz ~ error:',
                error
            )
        }
        handlersAgain.close()
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
        return navigate('/teacher/class-info')
    }

    // ********* Action Area
    const handlCheckAttandance = (e, studentIdParam) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) => {
                if (student.studentId.trim() === studentIdParam.trim()) {
                    if (e.target.defaultValue === 'present') {
                        return {
                            ...student,
                            isPresent: true
                        }
                    } else if (e.target.defaultValue === 'absent') {
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
                            src={`${PUBLIC_IMAGE}/avatars/accounts/${row.image}`}
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

    const handleClassProgress = (classId) => {
        navigate({
            pathname: '/teacher/class-progress/' + classId
        })
    }

    const handleCreateTask = (classId) => {
        navigate({
            pathname: '/teacher/task/' + classId
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
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            className={styles.card}
                        >
                            <Card.Section
                                h={200}
                                style={{
                                    backgroundImage:
                                        'url(https://images.pexels.com/photos/247839/pexels-photo-247839.jpeg?auto=compress&cs=tinysrgb&w=600)',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    objectFit: 'cover'
                                }}
                            />

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
                                size="lg"
                                mt="md"
                                c="dimmed"
                                fw={500}
                                align="center"
                            >
                                {courseName}
                            </Text>
                            <Text
                                c="dimmed"
                                mt="sm"
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
                                mt="sm"
                            >
                                <Text
                                    ta="center"
                                    fz="md"
                                    c="dimmed"
                                    align="left"
                                >
                                    Trạng thái:
                                </Text>
                                <Badge
                                    color={
                                        classInfor.status === 'Đang diễn ra'
                                            ? 'indigo'
                                            : 'yellow'
                                    }
                                    radius="sm"
                                    mt={rem(3)}
                                >
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
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    onClick={() => {
                                        handleClassProgress(classInfor.classId)
                                    }}
                                    disabled={classInfor.status === 'Kết thúc'}
                                >
                                    Xem điều kiện dự thi
                                </Button>

                                {/* <Button
                                    onClick={handlersAgain.open}
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    disabled={classInfor.status === 'Kết thúc'}
                                >
                                    Mở lại bài thi
                                </Button> */}
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
                                    disabled={classInfor.status === 'Kết thúc'}
                                >
                                    Nhập điểm
                                </Button>
                                <Button
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    disabled={classInfor.status === 'Kết thúc'}
                                    onClick={() => {
                                        handleCreateTask(classInfor.classId)
                                    }}
                                >
                                    Giao bài tập
                                </Button>
                                <Button
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    onClick={() => {
                                        handleShowTask(classInfor.classId)
                                    }}
                                    disabled={classInfor.status === 'Kết thúc'}
                                >
                                    Tải bài tập học viên
                                </Button>
                                <Button
                                    color="cyan"
                                    size="md"
                                    mb="md"
                                    onClick={() => {
                                        open()
                                    }}
                                    disabled={classInfor.status === 'Kết thúc'}
                                >
                                    Upload tài liệu
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
                                            <Button
                                                color="violet"
                                                size="lg"
                                                mb="lg"
                                                onClick={() =>
                                                    handleSaveAttendance()
                                                }
                                            >
                                                Lưu điểm danh
                                            </Button>
                                        ) : (
                                            <Button
                                                color="violet"
                                                size="md"
                                                mb="lg"
                                                disabled
                                            >
                                                Lưu điểm danh
                                            </Button>
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

            {/* Modal quiz */}
            <Modal.Root
                opened={examOpenedAgain}
                onClose={handlersAgain.close}
                centered
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Xác nhận mở lại bài thi</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Title order={3} weight={100} align="center">
                            Bạn có chắc chắn muốn mở lại bài thi cho lớp{' '}
                            {classInfor.className} không ?{' '}
                        </Title>
                        <Group grow mt={'lg'}>
                            <Button color="red" onClick={handlersAgain.close}>
                                Không, để sau
                            </Button>
                            <Button onClick={updateExamination} color="teal">
                                Có, mở lại ngay
                            </Button>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

            {/* Modal upload data */}
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
                {selectedFile.length > 0 && (
                    <div>
                        <Text size="lg">File đã chọn:</Text>
                        <ul>
                            {selectedFile.map((file, index) => (
                                <li key={index}>{file && file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
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
