import {
    Loader,
    Breadcrumbs,
    Anchor,
    Text,
    Radio,
    Button,
    Checkbox,
    Stack,
    Title,
    Modal,
    Center,
    Alert
} from '@mantine/core'
import React, { useState, useEffect, useRef } from 'react'
import QuizIcon from '@mui/icons-material/Quiz'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { IconInfoCircle } from '@tabler/icons-react'

import questionDetailApi from 'api/questionDetailApi'
import quizzResultApi from 'api/quizzResultApi'

const user = JSON.parse(localStorage.getItem('user'))
const totalTime = 30

function QuizzClient() {
    const icon = <IconInfoCircle />
    const [searchParams, setSearchParams] = useSearchParams()
    let navigate = useNavigate()

    const [questionDetail, setQuestionDetail] = useState([
        {
            questionDetailId: 0,
            questionTitle: '',
            createDate: '',
            levels: '',
            answer: [
                {
                    answerId: 0,
                    answerContent: '',
                    isCorrect: false
                }
            ],
            courseId: 0,
            classId: 0
        }
    ])

    const [isDoing, setIsDoing] = useState(false)

    const getQuestionDetailsByClassId = async () => {
        try {
            const resp = await questionDetailApi.getQuestionDetailsByClassId(
                searchParams.get('classId'),
                user.username
            )
            if (resp.status === 200 && resp.data.length > 0) {
                setQuestionDetail(resp.data)
                startTimer()
            } else {
                setIsDoing(true)
            }
            console.log(resp.data)
        } catch (error) {
            console.log(error)
        }
    }

    // const [selectedAnswers, setSelectedAnswers] = useState([])

    const storedAnswers =
        JSON.parse(localStorage.getItem('selectedAnswers')) || []
    const [selectedAnswers, setSelectedAnswers] = useState(storedAnswers)

    // Lưu trạng thái các đáp án đã chọn vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers))
    }, [selectedAnswers])

    const handleAnswerSelect = (questionId, answerId, type) => {
        if (type === 'checkbox') {
            const isSelected = selectedAnswers.find(
                (selectedAnswer) => selectedAnswer.questionId === questionId
            )

            if (isSelected === undefined) {
                const newAnswerSelected = {
                    questionId: questionId,
                    answerId: [answerId]
                }
                setSelectedAnswers((prev) => [...prev, newAnswerSelected])
            } else {
                const updatedQuestions = selectedAnswers.map((question) => {
                    if (question.questionId === questionId) {
                        const updatedAnswerId = question.answerId.includes(
                            answerId
                        )
                            ? question.answerId.filter((id) => id !== answerId)
                            : [...question.answerId, answerId]

                        return {
                            ...question,
                            answerId: updatedAnswerId
                        }
                    }
                    return question
                })

                setSelectedAnswers(updatedQuestions)
                console.log(updatedQuestions)
            }
        } else {
            const isSelected = selectedAnswers.find(
                (selectedAnswer) => selectedAnswer.questionId === questionId
            )

            if (isSelected === undefined) {
                const newAnswerSelected = {
                    questionId: questionId,
                    answerId: answerId
                }
                setSelectedAnswers((prev) => [...prev, newAnswerSelected])
            } else {
                const updatedQuestions = selectedAnswers.map((question) => {
                    if (question.questionId === questionId) {
                        // Cập nhật giá trị selectedAnswerId cho câu hỏi
                        return {
                            ...question,
                            answerId: answerId
                        }
                    }
                    return question
                })

                // Cập nhật danh sách câu hỏi với câu hỏi có đáp án đã chọn
                setSelectedAnswers([...updatedQuestions])
                console.log(updatedQuestions)
            }
        }
    }

    const [showQuestion, setShowQuestion] = useState(false)
    const startTimer = () => {
        setShowQuestion(true)
    }

    const handleFinish = () => {
        // setIsFinished(true)
        // const minutes = Math.floor(elapsedTime / 60)
        // const seconds = elapsedTime % 60
        // let formattedTime = ''
        // if (minutes === 0) {
        //     formattedTime = `${seconds} giây`
        // } else {
        //     formattedTime = `${minutes} phút ${
        //         seconds < 10 ? '0' : ''
        //     }${seconds} giây`
        // }

        console.log(selectedAnswers)

        let totalScoreRadio = 0
        let totalScoreCheckbox = 0
        selectedAnswers.map((selectedAnswers) => {
            if (Array.isArray(selectedAnswers.answerId)) {
                const selectedCorrectAnswers = selectedAnswers.answerId.filter(
                    (answerId) => {
                        const foundQuestionDetail = findAnswer(
                            selectedAnswers.questionId,
                            answerId
                        )
                        console.log(foundQuestionDetail)
                        return (
                            foundQuestionDetail && foundQuestionDetail.isCorrect
                        )
                    }
                )

                const filteredQuestionDetail = questionDetail.filter(
                    (detail) =>
                        detail.questionDetailId === selectedAnswers.questionId
                )

                const correctAnswers = filteredQuestionDetail[0].answer.filter(
                    (answer) => answer.isCorrect
                )

                if (
                    selectedCorrectAnswers.length === correctAnswers.length &&
                    selectedCorrectAnswers.length ===
                        selectedAnswers.answerId.length
                ) {
                    totalScoreCheckbox += 0.2
                }
            } else {
                const foundQuestionDetail = findAnswer(
                    selectedAnswers.questionId,
                    selectedAnswers.answerId
                )
                console.log(foundQuestionDetail)

                if (foundQuestionDetail.isCorrect === true) {
                    totalScoreRadio += 0.2
                }
            }
        })

        console.log(`Tổng điểm số radio: ${totalScoreRadio}`)
        console.log(`Tổng điểm số checkbox: ${totalScoreCheckbox}`)

        const currentTime = Date.now()
        const storedStartTime = localStorage.getItem('countdown_start_time')
        const timeDifference = currentTime - storedStartTime

        addQuizzResult(
            Math.round(timeDifference / 1000),
            totalScoreCheckbox + totalScoreRadio
        )
    }

    const findAnswer = (questionDetailId, answerId) => {
        const question = questionDetail.find(
            (detail) => detail.questionDetailId === questionDetailId
        )

        if (question) {
            return question.answer.find(
                (answer) => answer.answerId === answerId
            )
        }

        return null
    }

    const addQuizzResult = async (elapsedTime, score) => {
        const courseId = questionDetail[0].courseId
        const classId = questionDetail[0].classId
        const quizzResultRequest = {
            score: score,
            duration: elapsedTime,
            quizzDate: new Date(),
            courseId: courseId,
            classId: classId,
            studentId: 'loinvpc04549'
        }
        console.log(quizzResultRequest)
        try {
            const resp = await quizzResultApi.createQuizzResult(
                quizzResultRequest
            )
            if (resp.status === 200) {
                navigate({
                    pathname: '/student/classes'
                })
                finishQuiz()
                localStorage.removeItem('countdown_start_time')
                localStorage.removeItem('selectedAnswers')
            }
        } catch (error) {
            console.log('Thêm lỗi', error)
        }
    }

    const [open, setOpen] = useState(false)
    const [openNotification, setOpenNotification] = useState(false)

    const openModal = () => {
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
    }

    const openModalNotification = () => {
        setOpenNotification(true)
    }

    const closeModalNotification = () => {
        setOpenNotification(false)
    }

    useEffect(() => {
        getQuestionDetailsByClassId()
    }, [])

    const [notificationCount, setNotificationCount] = useState(0)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                openModalNotification()
                setNotificationCount((prevCount) => prevCount + 1)
            }
        }
        const handleUnload = () => {
            setNotificationCount((prevCount) => prevCount + 1)
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('beforeunload', handleUnload)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
            window.removeEventListener('beforeunload', handleUnload)
        }
    }, [])

    const startQuiz = () => {
        document.documentElement.requestFullscreen().catch((err) => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`)
        })
    }

    const storedStartTime = localStorage.getItem('countdown_start_time')

    const [startTime, setStartTime] = useState(
        storedStartTime !== null ? storedStartTime : Date.now().toString()
    )

    const [seconds, setSeconds] = useState(
        storedStartTime !== null
            ? totalTime -
                  Math.floor((Date.now() - parseInt(storedStartTime)) / 1000)
            : totalTime
    )

    useEffect(() => {
        localStorage.setItem('countdown_start_time', startTime)
    }, [startTime])

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds <= 0) {
                    return 0
                } else {
                    return prevSeconds - 1
                }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (seconds === 0) {
            handleFinish()
        }
    }, [seconds])

    useEffect(() => {
        if (notificationCount >= 2) {
            handleFinish()
        }
    }, [notificationCount])

    const finishQuiz = () => {
        document.exitFullscreen().catch((err) => {
            console.log(`Error attempting to exit fullscreen: ${err.message}`)
        })
    }

    const formatTime = (time) => (time < 10 ? `0${time}` : time)

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return (
        <>
            {showQuestion === true ? (
                <div
                    className="container-fluid"
                    style={{
                        backgroundColor: '#ebebeb'
                    }}
                >
                    <div className="row">
                        <div className="col-lg-12 mx-auto">
                            <div class="d-flex justify-content-center mt-5">
                                <p
                                    className="text-center p-2"
                                    style={{
                                        color: '#00B14F',
                                        fontWeight: 600
                                    }}
                                >
                                    <span className="display-3">
                                        Thời gian còn lại
                                    </span>
                                    <br />
                                    <span className="display-2">
                                        {formatTime(minutes)}
                                    </span>
                                    <span className="display-2">
                                        :{formatTime(remainingSeconds)}
                                    </span>
                                </p>
                            </div>
                            <div
                                className="container mb-5"
                                style={{
                                    backgroundColor: 'white'
                                }}
                            >
                                <div className="row">
                                    <h1
                                        className="display-2 mx-auto mt-5 mb-5"
                                        style={{
                                            color: '#00B14F',
                                            fontWeight: 600
                                        }}
                                    >
                                        Bài thi trắc nghiệm cuối khóa học
                                    </h1>
                                    {questionDetail.map(
                                        (question, indexQuestion) => (
                                            <div
                                                className="col-lg-12"
                                                key={question.questionDetailId}
                                            >
                                                <div className="d-flex bd-highlight pl-3">
                                                    <div className="p-2 w-100">
                                                        <h2
                                                            className="text-dark mt-3"
                                                            style={{
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {indexQuestion + 1}.{' '}
                                                            {
                                                                question.questionTitle
                                                            }
                                                            ?
                                                        </h2>
                                                        <h4 className="text-muted mt-3">
                                                            {question.answer.filter(
                                                                (answer) =>
                                                                    answer.isCorrect ===
                                                                    true
                                                            ).length >= 2
                                                                ? 'Chọn ít nhất 2 đáp án'
                                                                : 'Chọn ít nhất 1 đáp án'}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="container">
                                                    <div className="row">
                                                        {question.answer.map(
                                                            (
                                                                answer,
                                                                indexAnswer
                                                            ) => (
                                                                <div
                                                                    className="col-md-6"
                                                                    key={
                                                                        indexAnswer
                                                                    }
                                                                >
                                                                    {question.answer.filter(
                                                                        (
                                                                            answer
                                                                        ) =>
                                                                            answer.isCorrect ===
                                                                            true
                                                                    ).length >=
                                                                    2 ? (
                                                                        <Checkbox
                                                                            className="bg-white p-2 pl-3"
                                                                            id={
                                                                                answer.answerId
                                                                            }
                                                                            name={
                                                                                question.questionDetailId
                                                                            }
                                                                            value={
                                                                                answer.answerContent
                                                                            }
                                                                            label={
                                                                                answer.answerContent
                                                                            }
                                                                            onChange={() => {
                                                                                handleAnswerSelect(
                                                                                    question.questionDetailId,
                                                                                    answer.answerId,
                                                                                    'checkbox'
                                                                                )
                                                                            }}
                                                                            checked={selectedAnswers.some(
                                                                                (
                                                                                    answerObj
                                                                                ) =>
                                                                                    answerObj.questionId ===
                                                                                        question.questionDetailId &&
                                                                                    answerObj.answerId.includes(
                                                                                        answer.answerId
                                                                                    )
                                                                            )}
                                                                        />
                                                                    ) : (
                                                                        <Radio
                                                                            className="bg-white p-2 pl-3"
                                                                            id={
                                                                                answer.answerId
                                                                            }
                                                                            name={
                                                                                question.questionDetailId
                                                                            }
                                                                            value={
                                                                                answer.answerContent
                                                                            }
                                                                            label={
                                                                                answer.answerContent
                                                                            }
                                                                            onChange={() => {
                                                                                handleAnswerSelect(
                                                                                    question.questionDetailId,
                                                                                    answer.answerId,
                                                                                    'radio'
                                                                                )
                                                                            }}
                                                                            checked={selectedAnswers.some(
                                                                                (
                                                                                    answerObj
                                                                                ) =>
                                                                                    answerObj.questionId ===
                                                                                        question.questionDetailId &&
                                                                                    answerObj.answerId ===
                                                                                        answer.answerId
                                                                            )}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <Center>
                                    <Button
                                        variant="filled"
                                        color="green"
                                        w={200}
                                        size="md"
                                        fw={'bolder'}
                                        mb={50}
                                        mt={70}
                                        fz={'lg'}
                                        onClick={openModal}
                                    >
                                        Nộp bài
                                    </Button>
                                </Center>
                                <Modal
                                    size="sm"
                                    opened={open}
                                    onClose={closeModal}
                                    title="Thông báo"
                                >
                                    <Text size="lg">
                                        Bạn có chắc chắn muốn nộp bài ???
                                    </Text>
                                    <Link to="/student/classes">
                                        <Button
                                            onClick={() => {
                                                closeModal()
                                                handleFinish()
                                            }}
                                            className="float-right"
                                            mt={30}
                                        >
                                            Nộp bài
                                        </Button>
                                    </Link>
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
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}

            {showQuestion === false && isDoing === false && (
                <Stack mt={250} mx="auto" align="center">
                    <Title order={2} color="dark">
                        <Loader color="rgba(46, 46, 46, 1)" />
                    </Title>
                    <Text c="dimmed" fz="lg">
                        Vui lòng chờ trong giây lát...
                    </Text>
                </Stack>
            )}

            {isDoing == true && (
                <Stack mt={250} mx="auto" align="center">
                    <Title order={2} color="dark">
                        Bạn đã làm bài kiểm tra rồi!!!
                    </Title>
                </Stack>
            )}
            <Modal
                size="xl"
                radius="lg"
                opened={openNotification}
                onClose={() => {
                    closeModalNotification()
                    startQuiz()
                }}
            >
                <Center>
                    <Title order={2}>Thông báo</Title>
                </Center>
                <Text size="xl" mt={10} ta="center">
                    Chúng tôi đã phát hiện bạn có hành vi gian lận?
                </Text>
                <Center>
                    <Alert
                        mt={20}
                        radius="lg"
                        variant="filled"
                        color="red"
                        title="Cảnh báo"
                        w={650}
                        icon={icon}
                    >
                        <Text size="lg">
                            - Bạn không được phép làm những điều sau trong lúc
                            làm bài thi:
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;1. Mở tab mới
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;2. Chuyển tab
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;3. Dùng phím tắt để thoát
                            chế độ toàn màn hình hay mở tab mới
                            <br />- Nếu bạn còn quy phạm <b>một lần</b> nữa thì{' '}
                            <b>hệ thống sẽ tự động nộp bài!</b>
                        </Text>
                    </Alert>
                </Center>
                <Center>
                    <Button
                        size="lg"
                        radius="xl"
                        onClick={() => {
                            closeModalNotification()
                            startQuiz()
                        }}
                        mt={30}
                        mb={30}
                        w={200}
                    >
                        Xác nhận
                    </Button>
                </Center>
            </Modal>
        </>
    )
}

export default QuizzClient
