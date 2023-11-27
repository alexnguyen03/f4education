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
import { Link, useSearchParams } from 'react-router-dom'

import questionDetailApi from 'api/questionDetailApi'
import quizzResultApi from 'api/quizzResultApi'

const user = JSON.parse(localStorage.getItem('user'))

function QuizzClient() {
    const [searchParams, setSearchParams] = useSearchParams()
    // const [time, setTime] = useState(10 * 60)
    // const [elapsedTime, setElapsedTime] = useState(0)
    // const [isFinished, setIsFinished] = useState(true)
    // const useReverseTimer = () => {
    //     useEffect(() => {
    //         let intervalId

    //         if (time > 0 && !isFinished) {
    //             intervalId = setInterval(() => {
    //                 setTime((prevTime) => prevTime - 1)
    //                 setElapsedTime((prevElapsedTime) => prevElapsedTime + 1)
    //             }, 1000)
    //         }

    //         return () => {
    //             clearInterval(intervalId)
    //         }
    //     }, [time, isFinished])

    //     return time
    // }
    // const timeRemaining = useReverseTimer()
    // const minutes = Math.floor(timeRemaining / 60)
    // const seconds = timeRemaining % 60

    const initialTime = 10 * 60 // 10 phút
    const [time, setTime] = useState(initialTime)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const storedTime = localStorage.getItem('quizTime')

        if (storedTime && !initialized) {
            setTime(parseInt(storedTime, 10))
            setInitialized(true)
        }

        const handleBeforeUnload = () => {
            localStorage.setItem('quizTime', time.toString())
        }

        const intervalId = setInterval(() => {
            setTime((prevTime) => {
                const newTime = prevTime - 1
                if (newTime <= 0) {
                    clearInterval(intervalId)
                    return 0
                }
                return newTime
            })
        }, 1000)

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            clearInterval(intervalId)
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [time, initialized])

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

    const getQuestionDetailsByClassId = async () => {
        try {
            const resp = await questionDetailApi.getQuestionDetailsByClassId(
                searchParams.get('classId')
            )
            if (resp.status === 200 && resp.data.length > 0) {
                setQuestionDetail(resp.data)
                startTimer()
            } else {
            }
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
        // setElapsedTime(0)
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
        addQuizzResult(2, totalScoreCheckbox + totalScoreRadio)
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
                                        {/* <span className="display-2">
                                            {seconds > 10
                                                ? `0${minutes}`
                                                : minutes}
                                        </span>
                                        <span className="display-2">
                                            :
                                            {seconds < 10
                                                ? `0${seconds}`
                                                : seconds}
                                        </span> */}
                                        <span className="display-2">
                                            {Math.floor(time / 60)
                                                .toString()
                                                .padStart(2, '0')}
                                        </span>
                                        <span className="display-2">
                                            :
                                            {(time % 60)
                                                .toString()
                                                .padStart(2, '0')}
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
                                        Quiz 1
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
                                                                ? `Chọn tối đa ${
                                                                      question.answer.filter(
                                                                          (
                                                                              answer
                                                                          ) =>
                                                                              answer.isCorrect ===
                                                                              true
                                                                      ).length
                                                                  } đáp án`
                                                                : ''}
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
                <Stack mt={250} mx="auto" align="center">
                    <Title order={2} color="dark">
                        <Loader color="rgba(46, 46, 46, 1)" />
                    </Title>
                    <Text c="dimmed" fz="lg">
                        Vui lòng chờ trong giây lát...
                    </Text>
                </Stack>
            )}
        </>
    )
}

export default QuizzClient

// const QuizzClient = () => {
//     const initialTime = 10 * 60 // 10 phút
//     const [time, setTime] = useState(initialTime)
//     const [initialized, setInitialized] = useState(false)

//     useEffect(() => {
//         const storedTime = localStorage.getItem('quizTime')

//         if (storedTime && !initialized) {
//             setTime(parseInt(storedTime, 10))
//             setInitialized(true)
//         }

//         const handleBeforeUnload = () => {
//             localStorage.setItem('quizTime', time.toString())
//         }

//         const intervalId = setInterval(() => {
//             setTime((prevTime) => {
//                 const newTime = prevTime - 1
//                 if (newTime <= 0) {
//                     clearInterval(intervalId)
//                     return 0
//                 }
//                 return newTime
//             })
//         }, 1000)

//         window.addEventListener('beforeunload', handleBeforeUnload)

//         return () => {
//             clearInterval(intervalId)
//             window.removeEventListener('beforeunload', handleBeforeUnload)
//         }
//     }, [time, initialized])

//     return (
//         <div>
//             <h1>
//                 Thời gian còn lại: {Math.floor(time / 60).toString().padStart(2, '0')}:
//                 {(time % 60).toString().padStart(2, '0')}
//             </h1>

//         </div>
//     )
// }

// export default QuizzClient
