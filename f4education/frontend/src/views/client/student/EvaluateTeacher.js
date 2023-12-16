import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Container,
    Group,
    Image,
    Paper,
    Radio,
    Text,
    Title
} from '@mantine/core'
import { IconAlertCircle, IconNotes } from '@tabler/icons-react'
import evaluateApi from '../../../api/evaluateApi'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import classApi from 'api/classApi'

const EvaluateTeacher = () => {
    let { classIdParam } = useParams()
    const [evaluationInfo, setEvaluationInfo] = useState({
        className: '',
        teacherName: ''
    })
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)

    const [evaluations, setEvaluations] = useState([])
    const data = [
        {
            title: 'Thời gian giảng dạy của giảng viên',
            options: [
                {
                    value: 0,
                    label: ' Rất hay trễ giờ'
                },
                {
                    value: 1,
                    label: 'Nhiều lần trễ giờ'
                },
                {
                    value: 2,
                    label: 'Trễ giờ 1 vài lần'
                },
                {
                    value: 3,
                    label: 'Luôn đi đúng giờ'
                }
            ]
        },
        {
            title: 'Nội dung và phương pháp giảng dạy',
            options: [
                {
                    value: 0,
                    label: 'Rất không tốt'
                },
                {
                    value: 1,
                    label: 'Không tốt'
                },
                {
                    value: 2,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    label: 'Tốt'
                },
                {
                    value: 4,
                    label: 'Xuất sắc'
                }
            ]
        },
        {
            title: 'Sự công bằng của giảng viên trong kiểm tra đánh giá quá trình và đánh giá kết quả học tập',
            options: [
                {
                    value: 0,
                    label: 'Rất không công bằng'
                },
                {
                    value: 1,
                    label: 'Đôi lúc còn thiên vị'
                },
                {
                    value: 2,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    label: 'Rất công bằng'
                }
            ]
        },
        {
            title: 'Giảng viên có khuyến khích sáng tạo và tư duy độc lập từ học viên',
            options: [
                {
                    value: 0,
                    label: 'Không có, không bao giờ nhắc đến'
                },
                {
                    value: 1,
                    label: 'Có, rất khuyết khích'
                }
            ]
        }
    ]

    const handleSetEvaluates = (title, value) => {
        const index = evaluations.findIndex((item) => item.title === title)

        if (index !== -1) {
            // Nếu title đã tồn tại, cập nhật giá trị của nó
            setEvaluations((prevState) => {
                const updatedEvaluations = [...prevState]
                updatedEvaluations[index] = { title: title, value: value }
                return updatedEvaluations
            })
        } else {
            // Nếu title chưa tồn tại, thêm một phần tử mới vào mảng
            setEvaluations((prevState) => [
                ...prevState,
                {
                    title: title,
                    value: value
                }
            ])
        }
    }
    const handleOnSubmit = async () => {
        if (evaluations.length < data.length) return
        const listEvaluationDetailInRequest = evaluations.map((item) => {
            return { title: item.title, value: item.value }
        })

        const evaluationRequest = {
            classId: parseInt(classIdParam),
            studentId: user.username,
            listEvaluationDetailInRequest: listEvaluationDetailInRequest
        }
        console.log(
            '🚀 ~ file: EvaluateTeacher.js:133 ~ handleOnSubmit ~ evaluationRequest:',

            evaluationRequest
        )

        setLoading(true)
        try {
            const resp = await evaluateApi.saveEvaluationTeacher(
                evaluationRequest
            )
            if (resp.status === 200) navigate('/evaluation/student/completed')
            console.log(
                '🚀 ~ file: EvaluateTeacher.js:145 ~ handleOnSubmit ~ resp:',
                resp
            )
        } catch (error) {
            console.log(
                '🚀 ~ file: EvaluateTeacher.js:145 ~ handleOnSubmit ~ error:',
                error
            )
            setLoading(false)
        }
        setLoading(false)

        console.log(evaluations)
    }

    const getClassByClassId = async () => {
        try {
            const resp = await classApi.getByClassId(classIdParam)
            console.log(
                '🚀 ~ file: ClassDetail.js:267 ~ getClassByClassId ~ resp:',
                resp
            )
            if (resp.status === 200) {
                const { className, teacher } = { ...resp.data }
                setEvaluationInfo({
                    className: className,
                    teacherName: teacher.fullname
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderEvaluationForm = () => {
        return (
            <>
                {data.map((item, index) => (
                    <Box key={index} my={'md'}>
                        <Alert
                            icon={<IconNotes size="1.2rem" />}
                            title={item.title}
                            color="gray"
                            variant="outline"
                        >
                            {item.options.map((option, optionIndex) => (
                                <Radio
                                    id={option.value}
                                    name={item.title}
                                    key={optionIndex}
                                    value={option.value}
                                    label={option.label}
                                    onClick={() =>
                                        handleSetEvaluates(
                                            item.title,
                                            option.value
                                        )
                                    }
                                />
                            ))}
                        </Alert>
                    </Box>
                ))}
                <Center>
                    <Button
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                        onClick={handleOnSubmit}
                        disabled={evaluations.length < data.length}
                        loading={loading}
                    >
                        Hoàn thành đánh giá
                    </Button>
                </Center>
            </>
        )
    }

    const renderCompleteCard = () => {
        return (
            <Paper shadow="xs" p="md" mt={'md'}>
                <Center mb={'md'}>
                    <Title order={3}>
                        Cảm ơn bạn đã hoàn thành đánh giá giảng viên!
                    </Title>{' '}
                </Center>
                <Center>
                    <Button
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                        onClick={() => {
                            navigate('/student/classes')
                        }}
                    >
                        Quay về lớp học
                    </Button>
                </Center>
            </Paper>
        )
    }

    useEffect(() => {
        getClassByClassId()
    }, [])
    return (
        <Container mt={'md'}>
            <Center>
                <Title order={2}>Thông tin nhận xét</Title>
            </Center>
            <Center>
                <Group mt={'md'}>
                    <Center>
                        <Badge
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'cyan' }}
                        >
                            Giáo viên: {evaluationInfo.teacherName}
                        </Badge>
                    </Center>
                    <Center>
                        <Badge
                            variant="gradient"
                            gradient={{ from: 'cyan', to: 'indigo' }}
                        >
                            Lớp: {evaluationInfo.className}
                        </Badge>
                    </Center>
                </Group>
            </Center>
            {completed ? renderCompleteCard() : renderEvaluationForm()}
        </Container>
    )
}

export default EvaluateTeacher
