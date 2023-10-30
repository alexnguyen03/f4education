import {
    Loader,
    Breadcrumbs,
    Anchor,
    Text,
    Radio,
    Button,
    Checkbox,
    Container
} from '@mantine/core'
import React, { useState, useEffect } from 'react'
import QuizIcon from '@mui/icons-material/Quiz'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import moment from 'moment/moment'

import questionDetailApi from 'api/questionDetailApi'
import quizzResultApi from 'api/quizzResultApi'
const user = JSON.parse(localStorage.getItem('user'))

function QuizzClient() {
    const [time, setTime] = useState(10 * 60)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isFinished, setIsFinished] = useState(true)
    const useReverseTimer = () => {
        useEffect(() => {
            let intervalId

            if (time > 0 && !isFinished) {
                intervalId = setInterval(() => {
                    setTime((prevTime) => prevTime - 1)
                    setElapsedTime((prevElapsedTime) => prevElapsedTime + 1)
                }, 1000)
            }

            return () => {
                clearInterval(intervalId)
            }
        }, [time, isFinished])

        return time
    }
    const timeRemaining = useReverseTimer()
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

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
            courseName: '',
            classId: 0,
            className: ''
        }
    ])

    const getQuestionDetailsByStudentId = async () => {
        try {
            const resp = await questionDetailApi.getQuestionDetailsByStudentId(
                'loinvpc04549'
            )
            if (resp.status === 200) {
                setQuestionDetail(resp.data)
                console.log(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [score, setScore] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const handleAnswerSelect = (questionId, answerId, isCorrect) => {
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

    const [showQuestion, setShowQuestion] = useState(false)

    const [quizzResultRequest, setQuizResultRequest] = useState({
        quizzId: 0,
        score: 0,
        duration: '',
        quizzDate: '',
        courseId: 0,
        classId: 0,
        studentId: ''
    })

    const startTimer = () => {
        setShowQuestion(true)
        setIsFinished(false)
        setElapsedTime(0)
    }

    const handleFinish = () => {
        setIsFinished(true)
        const minutes = Math.floor(elapsedTime / 60)
        const seconds = elapsedTime % 60
        let formattedTime = ''
        if (minutes === 0) {
            formattedTime = `${seconds} giây`
        } else {
            formattedTime = `${minutes} phút ${
                seconds < 10 ? '0' : ''
            }${seconds} giây`
        }

        console.log(selectedAnswers)

        addQuizzResult(formattedTime, score)
    }

    const addQuizzResult = async (formattedTime, score) => {
        const courseId = questionDetail[0].courseId
        const classId = questionDetail[0].classId
        const quizzResultRequest = {
            score: score,
            duration: formattedTime,
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
                alert('Thêm thành công')
            }
        } catch (error) {
            console.log('failed to fetch data', error)
        }
    }

    useEffect(() => {
        getQuestionDetailsByStudentId()
    }, [])

    return (
        <>
            <Container>
                {/* BreadCums */}
                <Breadcrumbs
                    className="my-5 p-3"
                    style={{ backgroundColor: '#ebebeb' }}
                >
                    {itemsBreadcum}
                </Breadcrumbs>
                {showQuestion ? (
                    ''
                ) : (
                    <div
                        className="rounded shadow p-3"
                        style={{
                            width: 450
                        }}
                    >
                        <h2 className="text-primary text-center pt-2">
                            {questionDetail[0].courseId} -{' '}
                            {questionDetail[0].courseName}
                        </h2>
                        <hr className="m-0" />
                        <br />
                        <span className="h3 ml-1">Mã số: {user.username}</span>
                        <span className="float-right h3">
                            Ngày thi: {moment(new Date()).format('DD/MM/yyyy')}
                        </span>
                        <br />
                        <br />
                        <span className="h3 ml-1">Họ tên: {user.fullName}</span>
                        <span className="float-right h3">
                            Lớp học: {questionDetail[0].className}
                        </span>
                        <Button
                            className="my-4"
                            fullWidth
                            onClick={() => {
                                startTimer()
                            }}
                        >
                            BẮT ĐẦU LÀM BÀI
                        </Button>
                    </div>
                )}
                {showQuestion && (
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
                                            marginLeft: 200,
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <p className="text-center text-success p-2">
                                            <span className="display-4">
                                                Thời gian còn lại
                                            </span>
                                            <br />
                                            <span className="display-2">
                                                {seconds > 10
                                                    ? `0${minutes}`
                                                    : minutes}
                                            </span>
                                            <span className="display-2">
                                                :
                                                {seconds < 10
                                                    ? `0${seconds}`
                                                    : seconds}
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
                                        {questionDetail.map(
                                            (question, indexQuestion) => (
                                                <div
                                                    className="col-lg-12"
                                                    key={
                                                        question.questionDetailId
                                                    }
                                                >
                                                    <div class="d-flex bd-highlight">
                                                        <div class="p-2 w-100">
                                                            <h2 className="text-dark mt-3">
                                                                Câu hỏi{' '}
                                                                {indexQuestion +
                                                                    1}
                                                            </h2>
                                                            <p className="h2 text-muted">
                                                                {
                                                                    question.questionTitle
                                                                }
                                                            </p>
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
                                                                        )
                                                                            .length ===
                                                                        2 ? (
                                                                            <Checkbox
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
                                                                                        answer.isCorrect
                                                                                    )
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Radio
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
                                                                                        answer.isCorrect
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
                                        className="float-right mb-5"
                                        variant="gradient"
                                        gradient={{
                                            from: 'blue',
                                            to: 'violet',
                                            deg: 90
                                        }}
                                        w={200}
                                        size="md"
                                        fw={'bold'}
                                        fz={'lg'}
                                        onClick={handleFinish}
                                    >
                                        Nộp bài
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </>
    )
}

export default QuizzClient
