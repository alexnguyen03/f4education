import {
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    Group,
    Input,
    rem,
    Skeleton,
    Stack,
    Table,
    Text,
    Title
} from '@mantine/core'
import { IconFilterSearch } from '@tabler/icons-react'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'

// API
import classApi from '../../../api/classApi'
import pointApi from '../../../api/pointApi'

// SCSS
import resultStyle from '../../../assets/scss/custom-module-scss/client-custom/result/result.module.scss'

// IMAGE PATH
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const LearningResult = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // Main Variable
    const [listClasses, setListClasses] = useState([])

    // Action Variabel
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // FETCH
    const handleFetchClasses = async () => {
        try {
            console.log(user.username)
            const resp = await classApi.getLearningResult(
                user.username !== null ? user.username : ''
            )

            if (resp.status === 200) {
                const dataResponse = resp.data
                console.log(dataResponse)

                const resultClass = []
                for (let i = 0; i < dataResponse.length; i++) {
                    const classes = dataResponse[i]

                    const pointData = await handleFetchPointAndQuizz(
                        user.username !== null ? user.username : '',
                        classes.classId
                    )

                    console.log(pointData)

                    const newClassesData = {
                        ...classes,
                        averagePoint:
                            pointData !== undefined
                                ? pointData.averagePoint
                                : 0,
                        attendancePoint:
                            pointData !== undefined
                                ? pointData.attendancePoint
                                : 0,
                        exercisePoint:
                            pointData !== undefined
                                ? pointData.exercisePoint
                                : 0,
                        quizzPoint:
                            pointData !== undefined ? pointData.quizzPoint : 0
                    }

                    resultClass.push(newClassesData)
                }

                console.log(resultClass)

                setListClasses(resultClass)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFetchPointAndQuizz = async (username, classId) => {
        setLoading(true)
        try {
            const resp = await pointApi.getPointByStudentAndClass(
                username,
                parseInt(classId)
            )
            console.log(resp.data[0])
            return resp.data[0]
        } catch (error) {
            console.log(error)
        }
    }

    // Filter
    const handleChangeSearchClass = (e) => {
        setSearchTerm(e.target.value)
    }

    let filteredClasses
    if (listClasses.length > 0) {
        filteredClasses = listClasses.filter((item) => {
            const className = item.className
            const status = item.status
            const teacherName = item.teacherName
            const startDate = moment(item.startDate).format('DD-MM-yyyy')
            const endDate = moment(item.endDate).format('DD-MM-yyyy')
            const lowerSearchTerm = searchTerm.toLowerCase()

            return (
                className.toLowerCase().includes(lowerSearchTerm) ||
                status.toLowerCase().includes(lowerSearchTerm) ||
                teacherName.toLowerCase().includes(lowerSearchTerm) ||
                startDate.includes(lowerSearchTerm) ||
                endDate.includes(lowerSearchTerm)
            )
        })
    } else {
        console.error('')
    }

    // POINT CONTENT
    const tableTheadContent = (
        <tr>
            <th>Điểm chuyên cần(10%)</th>
            <th>Điểm bài tập(50%)</th>
            <th>Điểm thi(40%)</th>
            <th>Điểm trung bình</th>
            <th>Xếp loại</th>
        </tr>
    )

    const tableTbodyContent = (
        attendancePoint,
        exercisePoint,
        quizzPoint,
        averagePoint
    ) => {
        return (
            <tr>
                <td>{attendancePoint}</td>
                <td>{exercisePoint}</td>
                <td>{quizzPoint}</td>
                <td>{averagePoint}</td>
                <td>
                    <Badge color={`${averagePoint > 5 ? 'green' : 'red'}`}>
                        {averagePoint > 5 ? 'Đạt' : 'Chưa đạt'}
                    </Badge>
                </td>
            </tr>
        )
    }

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                await handleFetchClasses()
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <Box p={rem('2rem')}>
            {/* Title */}
            <Title order={1} color="dark" mb={rem('2rem')}>
                Kết quả học tập
            </Title>

            {loading ? (
                <>
                    <Skeleton width="100%" height={30} mb={15} />
                    <Skeleton width="100%" height={200} mb={30} />
                    <Skeleton width="100%" height={200} mb={30} />
                    <Skeleton width="100%" height={200} mb={30} />
                </>
            ) : (
                <Box>
                    {/* Search tearn */}
                    <Box mb={20}>
                        <Group position="left">
                            <Input
                                id="search-input"
                                icon={<IconFilterSearch />}
                                size="md"
                                w={350}
                                placeholder="Tìm lớp học"
                                onChange={(e) => handleChangeSearchClass(e)}
                            />
                            <Button color="violet" size="md" ml={20}>
                                Tìm kiếm
                            </Button>
                        </Group>
                    </Box>
                    {listClasses.length === 0 ? (
                        <Center w="100%">
                            <Title
                                order={1}
                                maw={600}
                                color="dark"
                                fw={500}
                                mt={200}
                            >
                                Không có lớp học nào khả dụng !
                            </Title>
                        </Center>
                    ) : (
                        <Box>
                            {/* List Class */}
                            {filteredClasses.map((classes) => (
                                <Box
                                    w="100%"
                                    className={resultStyle.box}
                                    p={rem('1rem')}
                                    mb={50}
                                    key={classes.classId}
                                >
                                    <Stack>
                                        <Text color="dimmed" size="md">
                                            Tổng {classes.courseDuration} giờ -{' '}
                                            {classes.courseDuration / 2} buổi
                                            học
                                        </Text>
                                        <Title
                                            order={4}
                                            fw={500}
                                            color="dark"
                                            mb={10}
                                        >
                                            Lớp {classes.className}
                                            {' - '}Thời gian học từ{' '}
                                            {moment(classes.startDate).format(
                                                'DD-MM-yyyy'
                                            )}{' '}
                                            đến{' '}
                                            {moment(classes.endDate).format(
                                                'DD-MM-yyyy'
                                            ) !== 'Invalid date'
                                                ? moment(
                                                      classes.endDate
                                                  ).format('DD-MM-yyyy')
                                                : '"chưa có ngày khả dụng"'}
                                        </Title>
                                        <Box>
                                            <Title
                                                order={2}
                                                fw={500}
                                                color="dark"
                                                mb={5}
                                                // style={{
                                                //     textDecoration:
                                                //         'underline'
                                                // }}
                                            >
                                                Kết quả khóa học -{' '}
                                                {classes.courseName}
                                            </Title>
                                            <Table
                                                width="100%"
                                                highlightOnHover
                                                withBorder
                                                withColumnBorders
                                                striped
                                            >
                                                <thead>
                                                    {tableTheadContent}
                                                </thead>
                                                <tbody>
                                                    {tableTbodyContent(
                                                        classes.attendancePoint,
                                                        classes.exercisePoint,
                                                        classes.quizzPoint,
                                                        classes.averagePoint
                                                    )}
                                                </tbody>
                                            </Table>
                                        </Box>
                                        <Group position="left">
                                            <Text color="dark" size="lg">
                                                Trạng thái lớp học:{' '}
                                            </Text>
                                            <Badge color="violet" size="md">
                                                {classes.status}
                                            </Badge>
                                        </Group>
                                        <Group position="left">
                                            <Avatar
                                                src={`${PUBLIC_IMAGE}/avatars/teachers/${classes.teacherImage}`}
                                                alt={''}
                                                radius="xl"
                                            />
                                            <Group position="left">
                                                <Text color="dark" size="lg">
                                                    Giáo viên hướng dẫn:{' '}
                                                </Text>
                                                <Text color="dimmed" size="lg">
                                                    {classes.teacherName}
                                                    {' - '}{' '}
                                                    {classes.teacherImage}
                                                </Text>
                                            </Group>
                                        </Group>
                                    </Stack>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default LearningResult
