import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Grid,
    Group,
    Image,
    rem,
    Skeleton,
    Text,
    Title
} from '@mantine/core'
import { MaterialReactTable } from 'material-react-table'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// API
import classApi from '../../api/classApi'

// scss
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

const teacherId = 'nguyenhoainam121nTC'
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const ClassInformationDetail = () => {
    // ************* Param Variable
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
    const [isPresent, setIsPresent] = useState(false)
    const [seletedStudent, setSletedStudent] = useState({
        studentId: '',
        fullname: '',
        image: ''
    })

    // ************* fetch Area
    const fetchClass = async () => {
        try {
            setLoading(true)
            const resp = await classApi.getByClassId(data.classId)

            if (resp.status === 200 && resp.data != null) {
                setClassInfor(resp.data)
            } else {
                console.log('Error')
            }

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchClassByTeacher = async () => {
        try {
            setLoading(true)
            const resp = await classApi.getAllClassByTeacherId(teacherId)
            if (resp.status === 200 && resp.data.length > 0) {
                setStudents(resp.data[0].students)
                setCourseName(resp.data[0].courseName[0])
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const redirectTo = () => {
        return navigate('/teacher/classes-infor')
    }

    // ********* Action Area
    const handleAttandance = (e, studentId) => {
        students.map((student) => {
            if (
                e.target.innerText.trim() === 'Có mặt' &&
                student.studentId.toLowerCase() === studentId.toLowerCase()
            ) {
                console.log('Co mat')
            }
            if (
                e.target.innerText.trim() === 'Vắng mặt' &&
                student.studentId.toLowerCase() === studentId.toLowerCase()
            ) {
                console.log('vang mat')
                const newStudent = students.find(
                    (st) => st.studentId.trim() === studentId.trim()
                )
                console.log(newStudent)
                setSletedStudent(newStudent)
            }
        })
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
                        <Button.Group>
                            <Button
                                id="present"
                                variant="filled"
                                color="green"
                                onClick={(e) => {
                                    handleAttandance(e, row.studentId)
                                }}
                            >
                                Có mặt
                            </Button>
                            <Button
                                id="absent"
                                variant="outline"
                                color={
                                    seletedStudent.studentId === row.studentId
                                        ? 'red'
                                        : 'gray'
                                }
                                onClick={(e) => {
                                    handleAttandance(e, row.studentId)
                                }}
                            >
                                Vắng mặt
                            </Button>
                        </Button.Group>
                    )
                },
                header: 'Có / Vắng',
                size: 50
            }
        ],
        []
    )

    // Use Effect Area
    useEffect(() => {
        fetchClass()
        fetchClassByTeacher()
    }, [])

    return (
        <>
            {/* Header */}
            <Box mb={'md'} className={styles['box-header']}>
                <Group position="apart">
                    <Title order={3} color="dark">
                        Chi tiết lớp học: {classInfor.className}
                    </Title>
                </Group>
            </Box>

            <Grid>
                {/* Left side */}
                <Grid.Col xl={3} lg={3}>
                    <Box className={styles['box-header']}>
                        {loading ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <Card
                                    padding="xl"
                                    radius="md"
                                    className={styles.card}
                                >
                                    <Card.Section
                                        h={140}
                                        style={{
                                            backgroundImage:
                                                'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)'
                                        }}
                                    />
                                    <Avatar
                                        src="https://th.bing.com/th/id/OIP.0MP14fOr1ykZDCnNZ5grFwHaGZ?pid=ImgDet&rs=1"
                                        size={80}
                                        radius={80}
                                        mx="auto"
                                        mt={-30}
                                        className={styles.avatar}
                                    />
                                    <Title
                                        order={2}
                                        fw={500}
                                        mt="sm"
                                        align="center"
                                    >
                                        {classInfor.className}
                                    </Title>
                                    <Text
                                        ta="center"
                                        fz="md"
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
                                            'DD/mm/yyyy'
                                        )}{' '}
                                        -{' '}
                                        {moment(classInfor.endDate).format(
                                            'DD/mm/yyyy'
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
                                        <Badge
                                            color="indigo"
                                            radius="sm"
                                            mt={rem(3)}
                                        >
                                            {classInfor.status}
                                        </Badge>
                                    </Flex>
                                    <Button
                                        fullWidth
                                        radius="md"
                                        mt="xl"
                                        size="md"
                                        variant="default"
                                        onClick={() => redirectTo()}
                                    >
                                        Trở về
                                    </Button>
                                </Card>
                            </>
                        )}
                    </Box>
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
                                    <Button color="violet" size="md" mb="lg">
                                        Lưu điểm danh
                                    </Button>
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
        </>
    )
}

export default ClassInformationDetail
