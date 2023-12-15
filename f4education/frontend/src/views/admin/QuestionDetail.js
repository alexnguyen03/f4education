import {
    Accordion,
    Blockquote,
    Center,
    Checkbox,
    Group,
    Loader,
    Pagination,
    rem,
    Skeleton,
    Text,
    Textarea,
    Tooltip,
    useMantineTheme
} from '@mantine/core'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import QuestionDetailHeader from 'components/Headers/QuestionDetailHeader'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    FormGroup,
    Input,
    InputGroup,
    Modal,
    Row
} from 'reactstrap'

import { toast, ToastContainer } from 'react-toastify'
import Notify from '../../utils/Notify'

// API
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import {
    IconBookDownload,
    IconBookUpload,
    IconFile3d,
    IconRefresh,
    IconUpload,
    IconX
} from '@tabler/icons-react'
import answersApi from '../../api/answersApi'
import questionApi from '../../api/questionApi'

// IMAGE PATH
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const QuestionDetail = () => {
    // ************* Route and Params
    const params = useParams()
    const theme = useMantineTheme()

    // ************* Main variable
    const [questionPrev, setQuestionPrev] = useState({})
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)

    // ************* Action variable
    const [loading, setLoading] = useState(false)
    const [editQuestion, setEditQuestion] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editQuestionId, setEditQuestionId] = useState(null)
    const [isUpdate, setIsUpdate] = useState(false)
    const [upLoadExcel, setUploadExcel] = useState(false)
    const [loadingDropZone, setLoadingDropZone] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // ************* Form variable
    const [questionTitle, setQuestionTitle] = useState('')
    const [msgError, setMsgError] = useState({})
    const [questionRequest, setQuestionRequest] = useState({
        questionTitle: '',
        questionId: params.questionId,
        answers: []
    })
    const [answerRequest, setAnswerRequest] = useState([
        {
            answerId: '',
            answerContent: '',
            isCorrect: false,
            questionDetailId: ''
        }
    ])
    const [deleteAnsers, setDeleteAnswer] = useState([])

    // *************** PAGINATION AND SEARCH START
    const [currentPage, setCurrentPage] = useState(1)
    const [firstIndex, setFirstIndex] = useState(0)
    const [lastIndex, setLastIndex] = useState(0)
    const [currentItems, setCurrentItems] = useState([])
    const [totalPages, setTotalPage] = useState(0)
    const [filteredQuestion, setFilteredQuestion] = useState([])
    const itemsPerPage = 10

    useEffect(() => {
        const filteredQuestions = questions.filter((item) => {
            const questionTitle = item.questionTitle.toLowerCase()
            const lowerSearchTerm = searchTerm.toLowerCase()
            return questionTitle.includes(lowerSearchTerm)
        })

        setFilteredQuestion(filteredQuestions)
        setCurrentPage(1)
    }, [searchTerm, questions])

    useEffect(() => {
        setFirstIndex((currentPage - 1) * itemsPerPage)
        setLastIndex(
            Math.min(firstIndex + itemsPerPage, filteredQuestion.length)
        )
        setCurrentItems(filteredQuestion.slice(firstIndex, lastIndex))
        setTotalPage(Math.ceil(filteredQuestion.length / itemsPerPage))
    }, [currentPage, filteredQuestion, firstIndex, lastIndex])

    const handleChangeSearchQuestions = (e) => {
        setSearchTerm(e.target.value)
    }

    const handlePaginationChange = (page) => {
        setCurrentPage(page)
    }

    // *************** PAGINATION AND SEARCH END

    // ************* API - FETCH AREA
    const fetchQuestionDetail = async () => {
        try {
            setLoading(true)
            const resp = await questionApi.getQuestionDetailByQuestionId(
                params.questionId
            )

            if (resp.status === 200 || resp.data.length > 0) {
                setQuestions(resp.data)
                const newQuestion = resp.data

                const updatedQuestion = newQuestion.map((item) => {
                    const updatedAnswers = item.answers.map((answer) => {
                        return {
                            ...answer,
                            questionDetailId: item.questionDetailId
                        }
                    })
                    return {
                        ...item,
                        answers: updatedAnswers
                    }
                })
                setAnswers(updatedQuestion.map((item) => item.answers))
            } else {
                console.log('error fetch QuestionDetail')
            }

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchQuestionPrev = async () => {
        try {
            setLoading(true)
            const resp = await questionApi.getQuestionById(params.questionId)

            if (resp.status === 200 || resp.data.length > 0) {
                setQuestionPrev(resp.data)
                // console.log(resp.data)
            } else {
                console.log('error fetch QuestionDetail')
            }

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    // *************** FORM AREA ACTION - START
    // ====================== QUESTION ======================
    const handleStoreNewQuestions = async () => {
        if (validateForm()) {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                questionRequest.questionTitle = questionTitle
                questionRequest.answers = handleDataTranferAnswers()

                const body = questionRequest
                const resp = await questionApi.createQuestionDetail(body)
                console.log(resp.status)

                if (resp.status === 200) {
                    toast.update(id, Notify.options.createSuccess())
                } else {
                    toast.update(id, Notify.options.createError())
                }
            } catch (error) {
                console.log(error)
            } finally {
                handleClearForm()
                fetchQuestionDetail()
                setShowModal(false)
            }
        } else console.log('error in validate')
    }

    const handleExcelFileUpload = async () => {
        setLoadingDropZone(true)
        const id = toast(Notify.msg.loading, Notify.options.loading())

        const formData = new FormData()
        formData.append('excelFile', selectedFile)

        try {
            const resp = await questionApi.uploadExcel(
                formData,
                params.questionId
            )

            if (resp.status === 200) {
                console.log('File uploaded successfully.')
                setLoadingDropZone(false)
                setUploadExcel(false)
                setShowModal(false)
                toast.update(id, Notify.options.createSuccess())
                fetchQuestionDetail()
            } else {
                setLoadingDropZone(false)
                toast.update(id, Notify.options.createError())
            }
        } catch (error) {
            toast.update(id, Notify.options.createError())
            console.error('Failed to upload file.', error)
        } finally {
            handleClearForm()
        }
    }

    // Download excel file
    const handleDownloadExcel = async () => {
        try {
            const response = await questionApi.downloadExcel()

            // Convert the response data to a Blob
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })

            console.log(blob)

            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'example.xlsx'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading Excel file:', error)
        }
    }

    // + Function update when click update
    const handleUpdateQuestion = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

        // Set change action render UI
        setEditQuestionId(null)
        setEditQuestion(false)

        questionRequest.answers = answerRequest

        // Lấy list answer mới vừa tạo
        let newAnswers = []
        questionRequest.answers.map((answer) => {
            if (answer.isNew === true) {
                console.log(answer)
                const newAnswer = {
                    answerContent: answer.answerContent,
                    isCorrect: answer.isCorrect,
                    questionDetailId: answer.questionDetailId
                }
                newAnswers.push(newAnswer)
            }
            return answer
        })

        // Cập nhật lại request bỏ ra những item vừa tạo
        questionRequest.answers = questionRequest.answers.filter((answer) => {
            if (answer.isNew === true) {
                return false // Loại bỏ mục đã được push khỏi questionRequest.answers
            }
            return true // Giữ lại các mục không có thuộc tính isNew
        })

        console.log(questionRequest)
        console.log(questionRequest.answers)
        try {
            // UPDATE QUESTION
            const resp = await questionApi.updateQuestionDetail(
                editQuestionId,
                questionRequest
            )

            // CREATE NEW ANSWER
            if (newAnswers.length > 0) {
                const respAnswer = await answersApi.createAnswer(newAnswers)
                if (respAnswer.status === 200) {
                    console.log('ok')
                } else console.log('lỗi')
            } else {
                console.log('no new answer')
            }

            // UPDATE PREV ANSWER
            await Promise.all(
                questionRequest.answers.map(async (answer) => {
                    if (answer.answerId !== '') {
                        await answersApi.updateAnswer(answer.answerId, answer)
                    }
                })
            )

            // cập nhật lại list xóa bỏ ra những item vừa tạo
            // DELETE ANSWER
            if (deleteAnsers.length > 0) {
                const newDelete = deleteAnsers.filter((subArray) => {
                    const item = subArray[0]
                    if (item.isNew === true) {
                        return false
                    }
                    return true
                })

                newDelete.forEach((item) => {
                    handleDeleteSingleAnswer(parseInt(item[0].answerId))
                })
            } else {
                console.log('no delete')
            }

            if (resp.status === 200) {
                toast.update(id, Notify.options.updateSuccess())
            } else {
                toast.update(id, Notify.options.updateError())
            }
        } catch (error) {
            console.log(error)
        }
        newAnswers = []
        setDeleteAnswer([])
    }

    const handleDeleteQuestion = async (questionDetail) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

        const updateQuestions = [...questions]
        const indexToDelete = updateQuestions.findIndex(
            (qs) => qs.questionDetailId === questionDetail.questionDetailId
        )
        if (indexToDelete !== -1) {
            updateQuestions.splice(indexToDelete, 1)
        }
        setQuestions(updateQuestions)

        // Delete Question
        try {
            questionDetail.answers.forEach(async (as) => {
                const resp = await answersApi.deleteAnswer(as.answerId)

                if (resp.status === 204) {
                    console.log('Xóa answer rồi')
                }
            })

            const resp = await questionApi.deleteQuestionDetail(
                questionDetail.questionDetailId
            )

            if (resp.status === 204) {
                toast.update(id, Notify.options.deleteSuccess())
            } else {
                toast.update(id, Notify.options.deleteError())
            }
        } catch (error) {
            console.log(error)
        }
    }

    // + Tranfer Data from state to request
    const handleDataTranferAnswers = () => {
        const newAnswers = createNewAnswergroups.map((group) => ({
            isCorrect: group.checkBoxValue,
            answerContent: group.inputValue
        }))
        return newAnswers
    }

    const handleClearForm = () => {
        setQuestionRequest({
            questionTitle: '',
            questionId: params.questionId,
            answers: []
        })

        setCreateNewAnswergroups([
            { checkBoxValue: false, inputValue: '' },
            { checkBoxValue: false, inputValue: '' }
        ])
        setQuestionTitle('')
        setEditQuestionId(null)
    }

    // Handle onchange quetsion title
    const handleOnchangeInputQuestionTitle = (value, questionIdValue) => {
        setQuestionRequest((prev) => ({
            ...prev,
            questionTitle: value
        }))

        const updatedQuestionDetail = questions.map((questionDetail) => {
            if (questionDetail.questionDetailId === questionIdValue) {
                return {
                    ...questionDetail,
                    questionTitle: value
                }
            }
            return questionDetail
        })
        setQuestions(updatedQuestionDetail)
    }

    // ====================== ANSWER ======================
    const handleAddAnswer = () => {
        const maxAnswerId = getMaxAnswerId(answers)

        const newAnswer = {
            answerId: maxAnswerId + 1,
            answerContent: '',
            isCorrect: false,
            isNew: true,
            questionDetailId: editQuestionId
        }

        const updatedAnswers = [...answers]

        const matchingSubArray = updatedAnswers.find(
            (subArray) => subArray[0]?.questionDetailId === editQuestionId
        )

        if (matchingSubArray) {
            matchingSubArray.push(newAnswer)
        } else {
            updatedAnswers.push([
                { questionDetailId: editQuestionId },
                newAnswer
            ])
        }

        setAnswers(updatedAnswers)
    }

    const deleteAnswerById = (answerId) => {
        const updatedAnswers = answers.map((subArray) => {
            if (subArray[0].questionDetailId === editQuestionId) {
                const filteredSubArray = subArray.filter(
                    (answer) => answer.answerId !== answerId
                )

                if (filteredSubArray.length >= 2) {
                    const item = subArray.filter(
                        (answer) => answer.answerId === answerId
                    )
                    setDeleteAnswer((prevDeleteAnswers) => [
                        ...prevDeleteAnswers,
                        item
                    ])
                    return filteredSubArray
                }

                alert('Mỗi Câu hỏi phải có ít nhất 2 câu trả lời')
                return subArray
            }
            return subArray
        })
        setAnswers(updatedAnswers)
    }

    const getMaxAnswerId = (answers) => {
        let maxId = 0

        for (const subArray of answers) {
            const subArrayMaxId = subArray.reduce((subMaxId, answer) => {
                return Math.max(subMaxId, answer.answerId)
            }, 0)

            maxId = Math.max(maxId, subArrayMaxId)
        }
        return maxId
    }

    const handleDeleteSingleAnswer = async (answerId) => {
        try {
            const resp = await answersApi.deleteAnswer(answerId)
            resp.status === 204 ? console.log('ok') : console.log('error')
        } catch (error) {
            console.log(error)
        }
        fetchQuestionDetail()
    }

    // get value onchange Answer Input for update
    const handleOnchangeInputAnswersValue = (value, answerIdValue) => {
        // Update UI
        const updatedGroupAnswer = answers.map((answerArray) => {
            return answerArray.map((answer) => {
                if (answer.answerId === answerIdValue) {
                    return {
                        ...answer,
                        answerContent: value
                    }
                }
                return answer
            })
        })
        setAnswers(updatedGroupAnswer)

        // Update Data
        const updateRequest = updatedGroupAnswer.filter((answerArray) => {
            return answerArray.some((answer) => {
                return answer.questionDetailId === editQuestionId
            })
        })
        setAnswerRequest(updateRequest[0])
    }

    // get value onchange Answer radio for update
    const handleOnChangeCheckboxAnswerValue = (answerIdValue) => {
        // Update UI
        const updatedGroupAnswer = answers.map((answerArray) => {
            return answerArray.map((answer) => {
                if (answer.answerId === answerIdValue) {
                    return {
                        ...answer,
                        isCorrect: !answer.isCorrect
                    }
                }
                return answer
            })
        })
        setAnswers(updatedGroupAnswer)

        // Update Data
        const updateRequest = updatedGroupAnswer.filter((answerArray) => {
            return answerArray.some((answer) => {
                return answer.questionDetailId === editQuestionId
            })
        })
        setAnswerRequest(updateRequest[0])
    }

    // edit question when click
    const handleEditQuestionDetailByQuestionDetailId = (qs) => {
        setQuestionRequest(qs)
        setAnswerRequest([
            {
                answerId: '',
                answerContent: '',
                isCorrect: false,
                questionDetailId: ''
            }
        ])
        handleEditQuestion(qs)
        setDeleteAnswer([])
    }

    // + function set Edit when click edit button
    const handleEditQuestion = (qs) => {
        handlesetEditAbleInput(editQuestion)
        setEditQuestionId(qs.questionDetailId)
    }

    // +  Change span to input and get value
    const handlesetEditAbleInput = (prev) => {
        setEditQuestion(!prev)
    }

    const handleOnChangeInputAnswerInCreateNewQuestion = (e) => {
        setQuestionTitle(e.target.value)
    }

    const validateForm = () => {
        let isValid = true
        if (questionTitle === '') {
            setMsgError((preErr) => ({
                ...preErr,
                msg: 'Không để trống tên câu hỏi'
            }))
            isValid = false
        } else {
            setMsgError((prev) => ({ ...prev, msg: '' }))
        }

        createNewAnswergroups.forEach((group, index) => {
            if (group.inputValue === '') {
                isValid = false
                const updatedGroups = [...createNewAnswergroups]
                updatedGroups[index].error = 'Không được để trống câu trả lời'
                setCreateNewAnswergroups(updatedGroups)
            }
        })

        return isValid
    }
    // *************** FORM AREA ACTION - END

    // *************** CREATE NEW QUESTION - ANSWER - START
    const [createNewAnswergroups, setCreateNewAnswergroups] = useState([
        { checkBoxValue: false, inputValue: '', error: '' },
        { checkBoxValue: false, inputValue: '', error: '' }
    ])

    const handleCheckboxChange = (index) => {
        const updatedGroups = [...createNewAnswergroups]
        updatedGroups[index].checkBoxValue = !updatedGroups[index].checkBoxValue
        setCreateNewAnswergroups(updatedGroups)
    }

    const handleInputChange = (index, value) => {
        const updatedGroups = [...createNewAnswergroups]
        updatedGroups[index].inputValue = value

        if (value !== '') {
            updatedGroups[index].error = ''
        }

        setCreateNewAnswergroups(updatedGroups)
    }

    const handleAddGroup = () => {
        const newGroup = { checkBoxValue: false, inputValue: '' }
        setCreateNewAnswergroups([...createNewAnswergroups, newGroup])
    }

    const handleSliceDeleteFromGroup = (index) => {
        const newGroup = [...createNewAnswergroups]
        if (createNewAnswergroups.length > 2) {
            newGroup.splice(index, 1)
            setMsgError((prev) => ({ ...prev, msgAnswer: '' }))
        } else
            setMsgError((preErr) => ({
                ...preErr,
                msgAnswer: 'Phải có ít nhất 2 câu trả lời'
            }))
        setCreateNewAnswergroups(newGroup)
    }

    const renderInputs = () => {
        return createNewAnswergroups.map((group, index) => (
            <Col xl={6} lg={6} md={6} sm={12} key={index}>
                <FormGroup className="mt-3">
                    <label className="form-control-label w-100">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <span>Câu trả lời {index + 1}</span>
                            <Tooltip
                                label="Xóa câu trả lời"
                                color="red"
                                withArrow
                                arrowPosition="center"
                            >
                                <IconButton
                                    className="float-right text-danger"
                                    onClick={() =>
                                        handleSliceDeleteFromGroup(index)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </label>
                    <div className="d-flex align-items-center">
                        <div>
                            <label>
                                <Checkbox
                                    color="cyan"
                                    className="mt-2"
                                    onChange={() => handleCheckboxChange(index)}
                                    style={{ width: '20px', height: '20px' }}
                                    checked={group.checkBoxValue}
                                />
                            </label>
                        </div>
                        <InputGroup
                            className="ml-2"
                            // style={{
                            //     border: `${
                            //         group.error !== '' ? '1px solid red' : ''
                            //     }`
                            // }}
                        >
                            {/* <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i
                                        className="ni ni-fat-delete"
                                        // style={{
                                        //     color: `${
                                        //         group.inputValue === ''
                                        //             ? 'red'
                                        //             : ''
                                        //     }`
                                        // }}
                                    />
                                </InputGroupText>
                            </InputGroupAddon> */}
                            <Input
                                className="pl-2"
                                placeholder="câu trả lời"
                                type="text"
                                value={group.inputValue}
                                onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                }
                            />
                        </InputGroup>
                    </div>
                    {group.error !== '' && (
                        <span className="text-danger ml-4">{group.error}</span>
                    )}
                </FormGroup>
            </Col>
        ))
    }
    // *************** CREATE NEW QUESTION - ANSWER - END

    // *************** RENDER QUESTION AND ANSWER - START
    const [openItemIndex, setOpenItemIndex] = useState(null)

    const handleAccordionChange = (index) => {
        setOpenItemIndex(openItemIndex === index ? null : index)
    }

    // + render UI questions
    const renderGroupsQuestion = () => {
        return (
            <Accordion
                variant="separated"
                radius="xs"
                mb={10}
                w="100%"
                defaultValue="0"
                onChange={handleAccordionChange}
            >
                {currentItems.map((questionDetail, index) => (
                    <Accordion.Item
                        value={`${index}`}
                        opened={openItemIndex === index}
                    >
                        <Accordion.Control bg="#fff">
                            <h2 className="p-2 d-flex align-items-center">
                                <span className="text-primary font-weight-500">
                                    <strong>Câu hỏi số {index + 1} : </strong>
                                    <span className="text-dark">
                                        {questionDetail.questionTitle}
                                    </span>
                                </span>
                            </h2>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Card
                                style={{
                                    minWidth: '380px',
                                    minHeight: '400px'
                                }}
                            >
                                <CardBody>
                                    {/* Title Question */}
                                    <h4
                                        className="p-2 d-flex align-items-center"
                                        style={{
                                            textDecoration: editQuestion
                                                ? 'none'
                                                : 'underline'
                                        }}
                                    >
                                        {/* Display question title */}
                                        {editQuestion &&
                                        questionDetail.questionDetailId ===
                                            editQuestionId ? (
                                            <Textarea
                                                label={`Tiêu đề câu hỏi: `}
                                                className="w-100"
                                                autosize
                                                size="lg"
                                                minRows={2}
                                                onChange={(e) => {
                                                    questionRequest.questionTitle =
                                                        questionDetail.questionTitle
                                                    handleOnchangeInputQuestionTitle(
                                                        e.target.value,
                                                        questionDetail.questionDetailId
                                                    )
                                                }}
                                                value={
                                                    questionRequest.questionTitle
                                                }
                                            />
                                        ) : (
                                            <h2
                                                className="text-muted font-weight-500 p-2"
                                                style={{
                                                    background: '#f1f1f1'
                                                }}
                                            >
                                                <strong>
                                                    Tiêu đề câu hỏi :{' '}
                                                </strong>
                                                <span className="text-dark">
                                                    {
                                                        questionDetail.questionTitle
                                                    }
                                                </span>
                                            </h2>
                                        )}
                                    </h4>
                                    {/* Answer Display Area */}
                                    <div
                                        className="mt-3"
                                        style={{
                                            height: editQuestion
                                                ? 'auto'
                                                : '220px',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <Row className="w-100">
                                            {/* if answer.questionId === qs.questionId */}
                                            {/* {handleRenderAnswerByQuestionId(
                                        questionDetail
                                    )} */}
                                            {renderGroupAnswerIntoQuestion(
                                                questionDetail
                                            )}
                                            {editQuestion &&
                                            questionDetail.questionDetailId ===
                                                editQuestionId ? (
                                                <Button
                                                    color="dark"
                                                    outline
                                                    className="mt-2 ml-3"
                                                    onClick={() =>
                                                        handleAddAnswer(
                                                            questionDetail.answers
                                                        )
                                                    }
                                                >
                                                    <i className="bx bx-list-plus"></i>{' '}
                                                    Thêm câu trả lời
                                                </Button>
                                            ) : (
                                                <></>
                                            )}
                                        </Row>
                                    </div>
                                </CardBody>
                                {/* Action Area */}
                                <CardFooter>
                                    {/* Update button */}
                                    {editQuestion &&
                                    questionDetail.questionDetailId ===
                                        editQuestionId ? (
                                        <Button
                                            color="primary"
                                            role="button"
                                            className="float-left"
                                            onClick={handleUpdateQuestion}
                                        >
                                            Cập nhật
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                color="dark"
                                                disabled
                                                role="button"
                                                className="float-left"
                                                onClick={handleUpdateQuestion}
                                            >
                                                Cập nhật
                                            </Button>
                                        </>
                                    )}

                                    {/* Add button */}
                                    {/* <Tooltip
                                label="Thêm đáp án"
                                color="teal"
                                withArrow
                                arrowPosition="center"
                            >
                                <IconButton
                                    color="success"
                                    className="float-right"
                                    onClick={() => {
                                        handleAddNewAnswerForEachQuestion(
                                            questionDetail
                                        )
                                        // handleEditQuestionDetailByQuestionDetailId(questionDetail);
                                    }}
                                >
                                    <i className="bx bx-plus-circle"></i>
                                </IconButton>
                            </Tooltip> */}

                                    {/* Edit button */}
                                    <Tooltip
                                        label="Chỉnh sửa câu hỏi"
                                        color="grape"
                                        withArrow
                                        arrowPosition="center"
                                    >
                                        <IconButton
                                            color="secondary"
                                            className="float-right"
                                            onClick={() => {
                                                handleEditQuestionDetailByQuestionDetailId(
                                                    questionDetail
                                                )
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Delete button */}

                                    {editQuestion &&
                                    questionDetail.questionDetailId ===
                                        editQuestionId ? (
                                        <Tooltip
                                            label="Xóa câu hỏi"
                                            color="red"
                                            withArrow
                                            arrowPosition="center"
                                        >
                                            <IconButton
                                                className="float-right text-gray"
                                                disabled
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <>
                                            <Tooltip
                                                label="Xóa câu hỏi ?"
                                                color="red"
                                                withArrow
                                                arrowPosition="center"
                                            >
                                                <IconButton
                                                    className="float-right text-danger"
                                                    onClick={() =>
                                                        handleDeleteQuestion(
                                                            questionDetail
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        )
    }

    const renderGroupAnswerIntoQuestion = (questionDetail) => {
        return answers.map((subjectArray, index) => (
            <>
                {subjectArray.map((answer, index) => (
                    <>
                        {answer.questionDetailId ===
                        questionDetail.questionDetailId ? (
                            <Col lg={12} xl={12} md={12} sm={12} key={index}>
                                <div className="d-flex">
                                    {/* Checkbox button */}
                                    {editQuestion &&
                                    answer.questionDetailId ===
                                        editQuestionId ? (
                                        <div className="d-flex align-items-center mb-2 mr-4">
                                            <label>
                                                <Checkbox
                                                    color="cyan"
                                                    name={`radio_${answer.questionDetailId}`}
                                                    checked={answer.isCorrect}
                                                    onChange={() =>
                                                        handleOnChangeCheckboxAnswerValue(
                                                            answer.answerId
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    width: '40px',
                                                    height: '40px'
                                                }}
                                                onClick={() => {
                                                    console.log(
                                                        answer.questionDetailId
                                                    )
                                                    console.log(
                                                        questionDetail.questionDetailId
                                                    )
                                                }}
                                            >
                                                {answer.isCorrect ? (
                                                    <i className="bx bx-check-circle text-success"></i>
                                                ) : (
                                                    <i className="bx bx-x-circle text-danger"></i>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Answer Input */}
                                    {editQuestion &&
                                    answer.questionDetailId ===
                                        editQuestionId ? (
                                        <Textarea
                                            autosize
                                            minRows={2}
                                            onChange={(e) => {
                                                handleOnchangeInputAnswersValue(
                                                    e.target.value,
                                                    answer.answerId
                                                )
                                            }}
                                            size="lg"
                                            className="w-100 mb-2"
                                            name="text"
                                            value={answer.answerContent}
                                        />
                                    ) : (
                                        <h3 className="text-dark d-flex align-items-center flex-wrap">
                                            {answer.answerContent}
                                        </h3>
                                    )}

                                    {editQuestion &&
                                    answer.questionDetailId ===
                                        editQuestionId ? (
                                        <Tooltip
                                            label="Xóa câu trả lời ?"
                                            color="red"
                                            withArrow
                                            arrowPosition="center"
                                        >
                                            <IconButton
                                                className="float-right text-danger"
                                                onClick={() =>
                                                    // handleDeleteSingleAnswer(
                                                    //     answer.answerId
                                                    // )
                                                    deleteAnswerById(
                                                        answer.answerId
                                                    )
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </Col>
                        ) : (
                            <></>
                        )}
                    </>
                ))}
            </>
        ))
    }
    // *************** RENDER QUESTION AND ANSWER - END

    // *************** UseEffect AREA
    useEffect(() => {
        fetchQuestionDetail()
        fetchQuestionPrev()
    }, [])

    return (
        <>
            <ToastContainer />

            {/* HeaderSubject start */}
            <QuestionDetailHeader />
            {/* HeaderSubject End */}

            <div style={{ minHeight: '80vh' }}>
                {/* Top tollbar and title */}
                <div className="container-fluid mt-3">
                    <div className="bg-white p-2 mb-3">
                        <div className="d-flex justify-content-between">
                            <Link
                                to="/admin/questions"
                                className="blockquote-footer my-auto"
                            >
                                Câu hỏi / Câu hỏi chi tiết
                            </Link>
                            <div className="d-flex">
                                <Input
                                    placeholder="Tìm câu hỏi...."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleChangeSearchQuestions(e)
                                    }
                                    style={{ minWidth: '300px' }}
                                />
                                <Button color="default" className="ml-2 w-75">
                                    Tìm kiếm
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4">
                        {/* Header Title */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div className="d-flex align-items-center">
                                {loading ? (
                                    <>
                                        <Skeleton
                                            circle
                                            width={70}
                                            height={70}
                                        />
                                        <div className="ml-3">
                                            <Skeleton
                                                width={450}
                                                height={15}
                                                mb={8}
                                            />
                                            <Skeleton
                                                width={450}
                                                height={20}
                                                mb={8}
                                            />
                                            <Skeleton
                                                width={450}
                                                height={15}
                                                mb={8}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <img
                                                src={`${PUBLIC_IMAGE}/avatars/courses/${questionPrev.courseImage}`}
                                                alt={''}
                                                className="course-image rounded-circle overflow-hidden"
                                                width="70px"
                                                height="70px"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-muted">
                                                Môn học -{' '}
                                                {questionPrev.subjectName}
                                            </h3>
                                            <h2 className="text-dark">
                                                {questionPrev.courseName}
                                            </h2>
                                            <div className="d-flex align-items-center flex-wrap">
                                                <h5>
                                                    {questionPrev.adminName}
                                                </h5>
                                                <span className="mx-1 font-weight-400 mt--1">
                                                    <i className="bx bx-minus"></i>
                                                </span>
                                                <h5>
                                                    {moment(
                                                        questionPrev.createDate
                                                    ).format(
                                                        'DD-MM-yyyy, h:mm:ss A'
                                                    )}
                                                </h5>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {loading ? (
                                    <>
                                        <div>
                                            <Skeleton width={170} height={50} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            color="default"
                                            onClick={() => fetchQuestionDetail()}
                                            variant="contained"
                                        >
                                            <IconRefresh />
                                        </Button>
                                        <Button
                                            color={
                                                isUpdate ? 'primary' : 'success'
                                            }
                                            onClick={() => {
                                                handleClearForm()
                                                setShowModal(true)
                                            }}
                                            variant="contained"
                                            id="addSubjects"
                                        >
                                            <i className="bx bx-layer-plus"></i>{' '}
                                            Thêm câu hỏi
                                        </Button>
                                        <Button
                                            color="primary"
                                            onClick={() => {
                                                setUploadExcel(true)
                                                setShowModal(true)
                                            }}
                                        >
                                            <IconBookUpload /> Upload Excel
                                        </Button>
                                        <Button
                                            color="primary"
                                            outline
                                            onClick={() => {
                                                handleDownloadExcel()
                                            }}
                                        >
                                            <IconBookDownload /> Tải file excel
                                            mẫu
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content start */}
                <main className="container-fluid">
                    <Row className="mt-5">
                        {/* Item */}
                        {loading ? (
                            <>
                                <div className="w-100 text-center mt-6">
                                    <Loader
                                        color="rgba(46, 46, 46, 1)"
                                        size={50}
                                    />
                                    <h3 className="text-muted mt-3">
                                        Vui lòng chờ trong giây lát!
                                    </h3>
                                </div>
                            </>
                        ) : (
                            <>
                                {renderGroupsQuestion()}
                                {questions.length === 0 && (
                                    <h2 className="mx-auto">
                                        Chưa có câu hỏi nào được tạo!
                                    </h2>
                                )}

                                {totalPages > 1 && (
                                    <Center w="100%" mt={20} mx="auto">
                                        <Pagination
                                            mx="auto"
                                            total={totalPages}
                                            color="green"
                                            withEdges
                                            value={currentPage}
                                            onChange={handlePaginationChange}
                                            itemsPerPage={itemsPerPage}
                                        />
                                    </Center>
                                )}
                            </>
                        )}
                    </Row>
                </main>
                {/* Main content End*/}

                {/* Modal start*/}
                <Modal
                    className="modal-dialog-centered modal-lg"
                    isOpen={showModal}
                    backdrop={'static'}
                >
                    <div className="modal-header">
                        <h3 className="modal-title" id="modal-title-default">
                            Thêm câu hỏi mới
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setShowModal(false)}
                        >
                            <span
                                aria-hidden={true}
                                onClick={() => setIsUpdate(false)}
                            >
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {upLoadExcel ? (
                            <>
                                <Dropzone
                                    onDrop={(files) => {
                                        console.log('accepted files', files)
                                        setSelectedFile(files[0])
                                    }}
                                    onReject={(files) =>
                                        console.log('rejected files', files)
                                    }
                                    maxSize={3 * 1024 ** 2}
                                    accept={[MIME_TYPES.xls, MIME_TYPES.xlsx]}
                                    name="excelFile"
                                    loading={loadingDropZone}
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
                                                    theme.colors[
                                                        theme.primaryColor
                                                    ][
                                                        theme.colorScheme ===
                                                        'dark'
                                                            ? 4
                                                            : 6
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
                                                        theme.colorScheme ===
                                                        'dark'
                                                            ? 4
                                                            : 6
                                                    ]
                                                }
                                            />
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <IconFile3d
                                                size="3rem"
                                                stroke={1.5}
                                            />
                                        </Dropzone.Idle>

                                        <div>
                                            {selectedFile !== null ? (
                                                <Text
                                                    size="xl"
                                                    inline
                                                    color={'lime'}
                                                >
                                                    {selectedFile.name}
                                                </Text>
                                            ) : (
                                                <>
                                                    <Text size="xl" inline>
                                                        Thả files excel vào đây
                                                        hoặc click vào để chọn
                                                        files
                                                    </Text>
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                        inline
                                                        mt={7}
                                                    >
                                                        Thả mỗi lần một file,
                                                        lưu ý dung lượng file
                                                        phải dưới 5MB
                                                    </Text>
                                                </>
                                            )}
                                        </div>
                                    </Group>
                                </Dropzone>
                            </>
                        ) : (
                            <>
                                <form method="post" className="mt--4">
                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={12}>
                                            <Textarea
                                                placeholder="Câu hỏi?"
                                                label="Tiêu đề câu hỏi"
                                                className="w-100"
                                                withAsterisk
                                                autosize
                                                minRows={3}
                                                onChange={
                                                    handleOnChangeInputAnswerInCreateNewQuestion
                                                }
                                                name="questionTitle"
                                                value={questionTitle}
                                            />
                                            {msgError.msg ? (
                                                <span className="text-danger ml-1">
                                                    Không được để trống tiêu đề
                                                    câu hỏi
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </Col>
                                        <Col xl={12} lg={12} md={12} sm={12}>
                                            <hr />
                                            <h4 className="font-weight-600">
                                                Câu trả lời
                                            </h4>
                                            <Blockquote
                                                cite="Chọn vào checkbox để đánh dấu câu trả lời đúng!"
                                                icon={null}
                                                className="mt--3 p-0"
                                            ></Blockquote>
                                            <Blockquote
                                                icon={null}
                                                className="p-0"
                                            >
                                                <span className="text-danger">
                                                    {msgError.msgAnswer
                                                        ? msgError.msgAnswer
                                                        : ''}
                                                </span>
                                            </Blockquote>
                                            <div className="container">
                                                <Row>{renderInputs()}</Row>
                                            </div>
                                        </Col>
                                        <div className="container">
                                            <Button
                                                color="dark"
                                                className="mt-3 float-left"
                                                onClick={handleAddGroup}
                                            >
                                                <i className="bx bx-list-plus"></i>{' '}
                                                Thêm câu trả lời
                                            </Button>
                                        </div>
                                    </Row>
                                </form>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="default"
                            outline
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                                setIsUpdate(false)
                                setUploadExcel(false)
                            }}
                        >
                            Trở lại
                        </Button>
                        <Button
                            // color="success"
                            color={upLoadExcel ? 'primary' : 'success'}
                            type="button"
                            onClick={() => {
                                upLoadExcel
                                    ? handleExcelFileUpload()
                                    : handleStoreNewQuestions()
                            }}
                        >
                            Thêm câu hỏi
                        </Button>
                    </div>
                </Modal>
                {/* Modal End*/}
            </div>
        </>
    )
}

export default QuestionDetail
