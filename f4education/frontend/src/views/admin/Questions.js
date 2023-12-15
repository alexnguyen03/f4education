import { Edit as EditIcon } from '@mui/icons-material'
import { Box, FormGroup, IconButton } from '@mui/material'
import QuestionHeader from 'components/Headers/QuestionHeader'
import { MaterialReactTable } from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Modal,
    Row
} from 'reactstrap'

import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'

// Axios Custom API
import courseApi from '../../api/courseApi'
import questionApi from '../../api/questionApi'
import subjectApi from '../../api/subjectApi'

//React Mantine - route - moment
import { Select } from '@mantine/core'
import moment from 'moment/moment'
import { Link } from 'react-router-dom'
import { IconRefresh } from '@tabler/icons-react'

// ************* Get LocalStorage

const Questions = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // ************* Main variable
    const [questions, setQuestions] = useState([])
    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [questionLoading, setQuestionLoading] = useState(false)

    // ************* Action variable
    const [showModal, setShowModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    // ************* Form variable
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [selectedCourseId, setSelectedCourseId] = useState(null)
    const [msgForm, setMsgForm] = useState({})

    const [question] = useState({
        subjectId: selectedSubjectId,
        courseId: selectedCourseId,
        adminId: user.username
    })

    // *************** Api Area
    const fetchQuestions = async () => {
        try {
            setQuestionLoading(true)
            const resp = await questionApi.getAllQuestion()

            if (resp.status === 200 && resp.data.length > 0) {
                setQuestions(resp.data)
                console.log(resp.data)
            }
            setQuestionLoading(false)
            console.log('restarted application')
        } catch (error) {
            setQuestionLoading(false)
            console.log(error)
        }
    }

    const fetchSubject = async () => {
        try {
            const resp = await subjectApi.getAllSubject()
            if (resp.status === 200 && resp.data.length > 0) {
                setSubjects(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCourse = async () => {
        try {
            const resp = await courseApi.getAll()
            if (resp.status === 200 && resp.data.length > 0) {
                setCourses(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // + API_AREA > CRUD
    const handleStoreQuestions = async () => {
        let id = null
        if (validateForm()) {
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                setQuestionLoading(true)
                const resp = await questionApi.createQuestion(question)
                console.log(
                    '🚀 ~ file: Questions.js:107 ~ handleStoreQuestions ~ resp:',
                    resp
                )
                if (resp.status === 200 && resp.data.length > 0) {
                    toast.update(id, Notify.options.createSuccess())
                }
            } catch (error) {
                toast.update(id, Notify.options.createError())
                console.log(error)
            } finally {
                setQuestionLoading(false)
                setShowModal(false)
                fetchQuestions()
                handleClearForm()
                toast.update(id, Notify.options.createError())
            }
        } else {
            toast.update(id, Notify.options.createError())
            console.log('error in validate')
        }
    }

    const handleClearForm = () => {
        setSelectedCourseId(null)
        setSelectedSubjectId(null)
    }

    // *************** Validation area
    const validateForm = () => {
        if (selectedSubjectId === null) {
            setMsgForm((preErr) => ({
                ...preErr,
                subjectNameError: 'Vui lòng chọn môn học'
            }))
        } else {
            setMsgForm((preErr) => ({ ...preErr, subjectNameError: '' }))
        }

        if (selectedCourseId === null) {
            setMsgForm((preErr) => ({
                ...preErr,
                courseNameErr: 'Vui lòng chọn khóa học'
            }))
        } else {
            setMsgForm((preErr) => ({ ...preErr, courseNameErr: '' }))
        }

        if (msgForm.courseNameErr !== '' || msgForm.subjectNameError !== '') {
            return false
        }
        return true
    }

    // *************** React Data table area
    function renderCellWithLink(row) {
        const questionId = row.questionId
        return (
            <span>
                <Link to={`/admin/question-detail/${questionId}`}>
                    {row.courseName}
                </Link>
            </span>
        )
    }

    const columnQuestion = useMemo(
        () => [
            {
                accessorKey: 'questionId',
                header: 'ID',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 40
            },
            {
                accessorKey: 'subjectName',
                header: 'Tên môn học',
                size: 80
            },
            {
                // accessorKey: "courseName",
                accessorFn: (row) => row.courseName,
                Cell: ({ cell }) => renderCellWithLink(cell.row.original),
                header: 'Tên khóa học',
                size: 180
            },
            {
                accessorFn: (row) =>
                    moment(row.createDate).format('DD/MM/yyyy, h:mm:ss A'),
                header: 'Ngày tạo',
                size: 80
            },
            {
                accessorKey: 'adminName',
                header: 'Tên người tạo',
                size: 120
            }
        ],
        []
    )

    // ************* Select Handle Logic AREA
    const subjectSelectValues = subjects.map((item) => ({
        value: item.subjectId,
        label: item.subjectName
    }))

    const handleChangeSelectSubject = (value) => {
        setSelectedSubjectId(value)
        question.subjectId = value
    }

    const filteredCourse = courses
        .filter((item) => {
            const subjectId = item.subject.subjectId

            if (selectedSubjectId === null) {
                return false
            }
            const selectedSubjectIdValue = parseInt(selectedSubjectId) || null

            return subjectId
                .toString()
                .includes(selectedSubjectIdValue.toString())
        })
        .filter((course) => {
            return !questions.some(
                (question) => question.courseName === course.courseName
            )
        })

    const courseSelectValues = filteredCourse.map((item) => ({
        value: item.courseId,
        label: item.courseName
    }))

    const handleChangeSelectCourses = (value) => {
        setSelectedCourseId(value)
        question.courseId = value
    }

    // *************** UseEffect area
    useEffect(() => {
        fetchQuestions()
        fetchSubject()
        fetchCourse()
    }, [])

    return (
        <>
            <ToastContainer />

            {/* HeaderSubject start */}
            <QuestionHeader />
            {/* HeaderSubject End */}

            {/* Page content */}
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">Bảng câu hỏi</h3>
                        <Button color="default" type="button" disabled>
                            Lịch sử câu hỏi
                        </Button>
                    </CardHeader>
                    <CardBody>
                        {/* Table view */}
                        <MaterialReactTable
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Thao tác',
                                    size: 20
                                },
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
                            muiTableBodyProps={{
                                sx: {
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                            initialState={{
                                columnVisibility: { questionId: false }
                            }}
                            columns={columnQuestion}
                            data={questions ?? []}
                            state={{
                                isLoading: questionLoading
                            }}
                            enableRowActions
                            positionActionsColumn="last"
                            enableRowNumbers
                            enableColumnOrdering
                            enableEditing
                            enableStickyHeader
                            enableColumnResizing
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100]
                            }}
                            renderRowActions={({ row }) => (
                                <div className="d-flex justify-content-start py-1">
                                    <Link
                                        to={`/admin/question-detail/${row.original.questionId}`}
                                    >
                                        <IconButton color="secondary">
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                </div>
                            )}
                            // Top Add new Subject button
                            renderTopToolbarCustomActions={() => (
                                <Box>
                                    <Button
                                        color={isUpdate ? 'primary' : 'success'}
                                        onClick={() => setShowModal(true)}
                                        variant="contained"
                                        id="addSubjects"
                                        // disabled={isSubjectHistoryShowing}
                                    >
                                        <i className="bx bx-layer-plus"></i>{' '}
                                        Thêm câu hỏi
                                    </Button>
                                    <Button
                                        color="default"
                                        onClick={() => fetchQuestions()}
                                        variant="contained"
                                    >
                                        <IconRefresh />
                                    </Button>
                                </Box>
                            )}
                        />
                    </CardBody>
                </Card>

                {/* Modal Add - Update Question*/}
                <Modal
                    className="modal-dialog-centered modal-lg"
                    isOpen={showModal}
                    backdrop={'static'}
                >
                    <div className="modal-header">
                        <h3 className="modal-title" id="modal-title-default">
                            Thêm bộ câu hỏi
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                                handleClearForm()
                            }}
                        >
                            <span
                                aria-hidden={true}
                                onClick={() => {
                                    setIsUpdate(false)
                                    handleClearForm()
                                }}
                            >
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form method="post">
                            <Row>
                                <Col xl={6} lg={6} md={6} sm={12}>
                                    <FormGroup className="mb-3 col-6 col-sm-12">
                                        <label
                                            className="form-control-label"
                                            htmlFor="name"
                                        >
                                            Môn học
                                        </label>
                                        <Select
                                            placeholder="Chọn môn học"
                                            searchable
                                            clearable
                                            name="subject"
                                            value={selectedSubjectId}
                                            onChange={handleChangeSelectSubject}
                                            nothingFound="No options"
                                            data={subjectSelectValues}
                                            error={msgForm.subjectNameError}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={12}>
                                    <FormGroup className="mb-3 col-6 col-sm-12">
                                        <label
                                            className="form-control-label"
                                            htmlFor="name"
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>Khóa học</span>
                                                <span className="badge badge-success">
                                                    {filteredCourse.length > 0
                                                        ? filteredCourse.length
                                                        : 0}{' '}
                                                    khóa học
                                                </span>
                                            </div>
                                        </label>
                                        <Select
                                            placeholder="Chọn khóa học"
                                            searchable
                                            clearable
                                            disabled={
                                                filteredCourse.length === 0
                                            }
                                            name="course"
                                            value={selectedCourseId}
                                            onChange={handleChangeSelectCourses}
                                            nothingFound="No options"
                                            data={courseSelectValues}
                                            error={msgForm.courseNameErr}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
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
                                handleClearForm()
                            }}
                        >
                            Trở lại
                        </Button>
                        <Button
                            color="success"
                            type="button"
                            onClick={() => {
                                handleStoreQuestions()
                            }}
                        >
                            Thêm câu hỏi
                        </Button>
                    </div>
                </Modal>
            </Container>
            {/* Page content end */}
        </>
    )
}

export default Questions
