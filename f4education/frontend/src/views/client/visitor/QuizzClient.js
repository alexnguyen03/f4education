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
    Modal
} from '@mantine/core'
import React, { useState, useEffect } from 'react'
import QuizIcon from '@mui/icons-material/Quiz'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

import questionDetailApi from 'api/questionDetailApi'
import quizzResultApi from 'api/quizzResultApi'

const user = JSON.parse(localStorage.getItem('user'))

function QuizzClient() {
    const [searchParams, setSearchParams] = useSearchParams()
    let navigate = useNavigate()

    const itemsBreadcum = [
        { title: 'Trang chủ', href: '/' },
        { title: 'Quizz', href: '/quizz' }
    ].map((item, index) => (
        <Anchor href={item.href} key={index} color="dimmed">
            <Text fs="italic">{item.title}</Text>
        </Anchor>
    ))

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

    const [selectedAnswers, setSelectedAnswers] = useState([])

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
        // setIsFinished(false)
        setElapsedTime(0)
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
                    totalScoreCheckbox += 0.5
                }
            } else {
                const foundQuestionDetail = findAnswer(
                    selectedAnswers.questionId,
                    selectedAnswers.answerId
                )
                console.log(foundQuestionDetail)

                if (foundQuestionDetail.isCorrect === true) {
                    totalScoreRadio += 0.5
                }
            }
        })

        console.log(`Tổng điểm số radio: ${totalScoreRadio}`)
        console.log(`Tổng điểm số checkbox: ${totalScoreCheckbox}`)
        addQuizzResult(elapsedTime, totalScoreCheckbox + totalScoreRadio)
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
            }
        } catch (error) {
            console.log('Thêm lỗi', error)
        }
    }

    const [open, setOpen] = useState(false)

    const openModal = () => {
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
    }

    useEffect(() => {
        getQuestionDetailsByClassId()
    }, [])

    const storedStartTime = localStorage.getItem('countdown_start_time')
    const storedSeconds = localStorage.getItem('countdown_seconds')
    const [elapsedTime, setElapsedTime] = useState(0)

    const [startTime, setStartTime] = useState(
        storedStartTime || Date.now().toString()
    )

    const [seconds, setSeconds] = useState(
        storedSeconds
            ? 124 - Math.floor((Date.now() - parseInt(storedStartTime)) / 1000)
            : 124
    )

    useEffect(() => {
        localStorage.setItem('countdown_start_time', startTime)
        localStorage.setItem('countdown_seconds', seconds.toString())
    }, [startTime, seconds])

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds <= 0) {
                    return 0
                } else {
                    setElapsedTime((prevSeconds) => prevSeconds + 1)
                }
                return prevSeconds - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (seconds === 0) {
            handleFinish()
            handleReset()
        }
    }, [seconds])

    const formatTime = (time) => (time < 10 ? `0${time}` : time)

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    const handleReset = () => {
        setStartTime(Date.now().toString())
        setSeconds(124)
    }

    return (
        <>
            {/* BreadCums */}
            <Breadcrumbs
                className="my-5 p-3"
                style={{ backgroundColor: '#ebebeb' }}
            >
                {itemsBreadcum}
            </Breadcrumbs>
            {showQuestion === true ? (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mx-auto rounded">
                            <div class="d-flex justify-content-between">
                                <QuizIcon
                                    className="rounded-circle p-3"
                                    style={{
                                        backgroundColor: 'white',
                                        fontSize: 100,
                                        color: '#34A633',
                                        marginLeft: 100
                                    }}
                                />
                                <div
                                    style={{
                                        width: 250,
                                        margin: 'auto',
                                        backgroundColor: 'white',
                                        marginLeft: 220,
                                        borderRadius: '10px'
                                    }}
                                >
                                    <p className="text-center text-success p-2">
                                        <span className="display-4">
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
                                <QuestionMarkIcon
                                    className="rounded-circle p-3"
                                    style={{
                                        backgroundColor: 'white',
                                        fontSize: 100,
                                        color: '#34A633',
                                        marginRight: 100
                                    }}
                                />
                            </div>
                            <div className="container">
                                <div
                                    className="row my-4"
                                    style={{
                                        minHeight: 300,
                                        backgroundColor: '#ebebeb',
                                        borderRadius: '10px',
                                        marginLeft: 2,
                                        marginRight: 2
                                    }}
                                >
                                    <h1 className="display-2 text-dark mx-auto mt-3">
                                        BÀI KIỂM TRA TRẮC NGHIỆM
                                    </h1>
                                    {questionDetail.map(
                                        (question, indexQuestion) => (
                                            <div
                                                className="col-lg-12"
                                                key={question.questionDetailId}
                                            >
                                                <div className="d-flex bd-highlight p-3">
                                                    <div className="p-2 w-100">
                                                        <h2 className="text-dark mt-3">
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
                                                <div className="container mt-2 mb-3">
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
                                                                            className="bg-white mb-3 p-2 pt-3 pl-3"
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
                                                                            onChange={() =>
                                                                                handleAnswerSelect(
                                                                                    question.questionDetailId,
                                                                                    answer.answerId,
                                                                                    'checkbox'
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Radio
                                                                            className="bg-white mb-3 p-2 pt-3 pl-3"
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
                                                                            onChange={() =>
                                                                                handleAnswerSelect(
                                                                                    question.questionDetailId,
                                                                                    answer.answerId,
                                                                                    'radio'
                                                                                )
                                                                            }
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
                                <Button
                                    variant="gradient"
                                    gradient={{
                                        from: 'blue',
                                        to: 'violet',
                                        deg: 90
                                    }}
                                    w={200}
                                    size="md"
                                    fw={'bold'}
                                    mb={50}
                                    fz={'lg'}
                                    onClick={openModal}
                                >
                                    Nộp bài
                                </Button>
                                <Modal
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
        </>
    )
}

export default QuizzClient
