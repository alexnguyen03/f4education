import { FormGroup, IconButton } from "@mui/material";
import QuestionHeader from "components/Headers/QuestionHeader";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Modal,
  Row,
} from "reactstrap";

// Axios Custom API
import questionApi from "../../api/questionApi";
import courseApi from "../../api/courseApi";
import subjectApi from "../../api/subjectApi";

//React Mantine - route - moment
import { Blockquote, Select } from "@mantine/core";
import { Link } from "react-router-dom";
import moment from "moment/moment";

const QuestionData = [
  {
    questionId: 1,
    subjectName: "NextJS",
    courseName: "NextJS cơ bản cho người mới",
    questionTitle: "Làm thế nào để tạo mới nextjs project",
    createDate: "2023-09-11T13:45:55.371+00:00",
    answer: [
      {
        answerId: 1,
        text: "câu trả lời 1",
        isCorrect: false,
      },
      {
        answerId: 2,
        text: "câu trả lời 2",
        isCorrect: false,
      },
      {
        answerId: 3,
        text: "câu trả lời 3",
        isCorrect: true,
      },
      {
        answerId: 4,
        text: "câu trả lời 4",
        isCorrect: false,
      },
    ],
    adminName: "Nguyễn Hoài Nam",
  },
  {
    questionId: 2,
    subjectName: "Python",
    courseName: "Python web nâng cao P2",
    questionTitle: "in hello world ra console",
    createDate: "2023-09-11T13:45:55.374+00:00",
    answer: [
      {
        answerId: 5,
        text: "câu trả lời 1",
        isCorrect: false,
      },
      {
        answerId: 6,
        text: "câu trả lời 2",
        isCorrect: true,
      },
      {
        answerId: 7,
        text: "câu trả lời 3",
        isCorrect: false,
      },
    ],
    adminName: "Nguyễn Hoài Nam",
  },
  {
    questionId: 18,
    subjectName: "Java",
    courseName: "Java cơ bản cho người mới",
    questionTitle: "Làm sao để tạo project java mới?",
    createDate: "2023-09-11T13:45:55.371+00:00",
    answer: [
      {
        answerId: 17,
        text: "answer one",
        isCorrect: false,
      },
      {
        answerId: 18,
        text: "answer two",
        isCorrect: false,
      },
    ],
    adminName: "Nguyễn Hoài Nam",
  },
];

const Questions = () => {
  // ************* Main variable
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  // ************* Get LocalStorage
  const userDetail = JSON.parse(localStorage.getItem("user"));

  // ************* Action variable
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // ************* Form variable
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("Default Null");

  const [question, setQuestion] = useState({
    subjectId: selectedSubjectId,
    courseId: selectedCourseId,
    questionTitle: "",
    adminId: userDetail.username,
  });

  const [answers, setAnswers] = useState({
    text: "",
    isCorrect: "",
  });

  // *************** Api Area
  const fetchQuestions = async () => {
    try {
      setQuestionLoading(true);
      const resp = await questionApi.getAllQuestion();
      setQuestions(resp);
      setQuestionLoading(false);
      console.log("restarted application");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubject = async () => {
    try {
      const resp = await subjectApi.getAllSubject();
      setSubjects(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourse = async () => {
    try {
      const resp = await courseApi.getAll();
      setCourses(resp);
    } catch (error) {
      console.log(error);
    }
  };

  // API_AREA > CRUD
  const handleStoreQuestions = async () => {
    try {
      console.log(question);
      handleDataTranferAnswers();

      // const body = question;
      // const resp = await questionApi.createQuestion(body);
      // console.log(resp.status);
    } catch (error) {
      console.log(error);
    }

    setShowModal(false);
  };

  const handleStoreAnswers = async () => {
    try {
      const body = answers;
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  };

  // *************** Validation area

  // *************** Form action area
  const handleChangeInput = (e) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubject = (row) => {
    setShowModal(true);
    setQuestion({ ...row.original });
    setIsUpdate(true);
  };

  // Tranfer and fill data to ANSWERS STATE
  const handleDataTranferAnswers = () => {
    const newAnswers = groups.map((group) => ({
      isCorrect: group.radioValue,
      text: group.inputValue,
    }));
    console.log(newAnswers);
    setAnswers(newAnswers);
  };

  // *************** React Data table area
  function renderCellWithLink(row) {
    // console.log(row);
    const courseName = row.courseName;
    const id = row.questionId;
    return (
      <span key={id}>
        <Link to={`/admin/questionDetail/${courseName}`}>{row.courseName}</Link>
      </span>
    );
  }

  const columnQuestion = useMemo(
    () => [
      {
        accessorKey: "questionId",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "subjectName",
        header: "Tên môn học",
        size: 80,
      },
      {
        // accessorKey: "courseName",
        accessorFn: (row) => row.courseName,
        Cell: ({ cell }) => renderCellWithLink(cell.row.original),
        header: "Tên khóa học",
        size: 180,
      },
      {
        accessorFn: (row) =>
          moment(row.createDate).format("DD/MM/yyyy, h:mm:ss A"),
        header: "Ngày tạo",
        size: 80,
      },
      {
        accessorKey: "adminName",
        header: "Tên người tạo",
        size: 120,
      },
    ],
    []
  );

  // const [radioInputValues, setRadioInputValues] = useState([]);
  // Render Input buy number choosen
  // const handleNumInputsChange = (event) => {
  //   const newNumInputs = parseInt(event.target.value);

  //   if (newNumInputs < numberInputs) {
  //     const newInputValues = answerInputValues.slice(0, newNumInputs);
  //     const newRadioValues = radioInputValues.slice(0, newNumInputs);
  //     setAnswerInputValues(newInputValues);
  //     setRadioInputValues(newRadioValues);
  //   }

  //   setNumberInputs(newNumInputs);
  // };

  // const handleAddGroup = () => {
  //   setNumberInputs(numberInputs + 1);
  // };

  // const renderInputs = () => {
  //   const inputs = [];

  //   for (let i = 0; i < numberInputs; i++) {
  //     const handleChange = (e) => {
  //       const newValues = [...answerInputValues];
  //       newValues[i] = e.target.value;
  //       setAnswerInputValues(newValues);
  //     };

  //     const handleRadioChange = (e) => {
  //       const newRadioValues = [...radioInputValues];
  //       newRadioValues[i] = e.target.value;
  //       setRadioInputValues(newRadioValues);
  //     };

  //     inputs.push(
  // <Col xl={6} lg={6} md={6} sm={12}>
  //   <div key={i + 1}>
  //     <FormGroup className="mt-3">
  //       <label className="form-control-label">Câu trả lời {i + 1}</label>
  //       <div className="d-flex align-items-center">
  //         <div>
  //           <label>
  //             <input
  //               type="radio"
  //               value={`option${i}`}
  //               className="mt-2"
  //               name="answerCorrect"
  //               checked={radioInputValues[i] === `option${i}`}
  //               onChange={handleRadioChange}
  //             />
  //           </label>
  //         </div>
  //         <Input
  //           className="form-control-alternative ml-2"
  //           type="text"
  //           value={answerInputValues[i] || ""}
  //           onChange={handleChange}
  //         />
  //       </div>
  //     </FormGroup>
  //   </div>
  // </Col>
  //     );
  //   }

  //   return inputs;
  // };

  // *************** Render Input Answer AREA
  const [groups, setGroups] = useState([
    { radioValue: false, inputValue: "" },
    { radioValue: false, inputValue: "" },
  ]);

  const handleRadioChange = (index) => {
    const updatedGroups = groups.map((group, i) => {
      if (i === index) {
        return { ...group, radioValue: true };
      } else {
        return { ...group, radioValue: false };
      }
    });
    setGroups(updatedGroups);
  };

  const handleInputChange = (index, value) => {
    const updatedGroups = [...groups];
    updatedGroups[index].inputValue = value;
    setGroups(updatedGroups);
  };

  const handleAddGroup = () => {
    const newGroup = { radioValue: false, inputValue: "" };
    setGroups([...groups, newGroup]);
  };

  const renderInputs = () => {
    return groups.map((group, index) => (
      <Col xl={6} lg={6} md={6} sm={12} key={index + 1}>
        <FormGroup className="mt-3">
          <label className="form-control-label">Câu trả lời {index + 1}</label>
          <div className="d-flex align-items-center">
            <div>
              <label>
                <input
                  type="radio"
                  checked={group.radioValue}
                  onChange={() => handleRadioChange(index)}
                />
              </label>
            </div>
            <Input
              className="form-control-alternative ml-2"
              type="text"
              value={group.inputValue}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        </FormGroup>
      </Col>
    ));
  };

  // ************* Select Handle Logic AREA
  const subjectSelectValues = subjects.map((item) => ({
    value: item.subjectId,
    label: item.subjectName,
  }));

  const handleChangeSelectSubject = (value) => {
    setSelectedSubjectId(value);
    question.subjectId = value;
  };

  const courseSelectValues = courses.map((item) => ({
    value: item.courseId,
    label: item.courseName,
  }));

  const handleChangeSelectCourse = (value) => {
    setSelectedCourseId(value);
    question.courseId = value;
  };

  // *************** UseEffect area
  useEffect(() => {
    fetchQuestions();
    fetchSubject();
    // fetchCourse();
  }, []);

  useEffect(() => {
    console.log(userDetail);
  }, [userDetail]);

  return (
    <>
      {/* HeaderSubject start */}
      <QuestionHeader />
      {/* HeaderSubject End */}

      {/* Page content */}
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          {/* Header */}
          <CardHeader className="bg-white border-0 d-flex justify-content-between">
            <h3 className="mb-0">Bảng câu hỏi</h3>
            <Button
              color="default"
              type="button"
              disabled
              // onClick={() => handleChangeSubjectListAndHistory()}
            >
              {/* {isSubjectHistoryShowing
                ? "Danh sách môn học"
                : "Lịch sử môn học"} */}
              Lịch sử câu hỏi
            </Button>
          </CardHeader>
          <CardBody>
            {/* Table view */}
            <MaterialReactTable
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  header: "Thao tác",
                  size: 20,
                },
              }}
              columns={columnQuestion}
              // data={questions}
              data={questions ?? []}
              state={{
                isLoading: questionLoading,
              }}
              positionActionsColumn="last"
              // editingMode="modal" //default
              enableColumnOrdering
              enableEditing
              enableStickyHeader
              enableColumnResizing
              muiTablePaginationProps={{
                rowsPerPageOptions: [10, 20, 50, 100],
                showFirstButton: false,
                showLastButton: false,
              }}
              renderRowActions={({ row }) => (
                <div className="d-flex justify-content-start py-1">
                  <IconButton onClick={() => handleEditSubject(row)}>
                    <EditIcon />
                  </IconButton>
                </div>
              )}
              // Top Add new Subject button
              renderTopToolbarCustomActions={() => (
                <Button
                  color={isUpdate ? "primary" : "success"}
                  onClick={() => setShowModal(true)}
                  variant="contained"
                  id="addSubjects"
                  // disabled={isSubjectHistoryShowing}
                >
                  <i className="bx bx-layer-plus"></i> Thêm câu hỏi
                </Button>
              )}
            />
          </CardBody>
        </Card>

        {/* Toast */}
        {/* <ToastContainer /> */}

        {/* Modal Add - Update Question*/}
        <Modal
          className="modal-dialog-centered modal-lg"
          isOpen={showModal}
          // toggle={showModal}
          backdrop={"static"}
        >
          <div className="modal-header">
            <h3 className="modal-title" id="modal-title-default">
              {isUpdate ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
            </h3>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setShowModal(false)}
            >
              <span aria-hidden={true} onClick={() => setIsUpdate(false)}>
                ×
              </span>
            </button>
          </div>
          <div className="modal-body">
            <form method="post">
              <Row>
                {/* {isUpdate && (
                <FormGroup className="mb-3">
                  <label className="form-control-label" htmlFor="questionId">
                    Mã câu hỏi
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="questionId"
                    onChange={handleChangeInput}
                    disabled
                    name="questionId"
                    value={question.questionId}
                  />
                </FormGroup>
              )} */}
                <Col xl={6} lg={6} md={6} sm={12}>
                  <FormGroup className="mb-3 col-6 col-sm-12">
                    <label className="form-control-label" htmlFor="name">
                      Môn học
                    </label>
                    {/* <Select
                      // label="Your favorite framework/library"
                      placeholder="Chọn môn học"
                      searchable
                      clearable
                      value={value}
                      onChange={setValue}
                      nothingFound="No options"
                      data={subjectSelectValue}
                    /> */}
                    <Select
                      placeholder="Chọn môn học"
                      searchable
                      clearable
                      name="subject"
                      value={selectedSubjectId}
                      onChange={handleChangeSelectSubject}
                      nothingFound="No options"
                      data={subjectSelectValues}
                    />
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12}>
                  <FormGroup className="mb-3 col-6 col-sm-12">
                    <label className="form-control-label" htmlFor="name">
                      Khóa học
                    </label>
                    <Select
                      // label="Your favorite framework/library"
                      placeholder="Chọn khóa học"
                      searchable
                      clearable
                      nothingFound="No options"
                      data={[
                        "React & Hook co ban",
                        "Angular RestAPI",
                        "Java Spring Boot RestFull Api",
                        "VueJs co ban",
                      ]}
                    />
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12}>
                  <FormGroup className="mb-3 col-6 col-sm-12">
                    <label
                      className="form-control-label"
                      htmlFor="questionTitle"
                    >
                      Tiêu đề câu hỏi?
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="questionTitle"
                      onChange={handleChangeInput}
                      name="questionTitle"
                      value={question.questionTitle}
                    />
                  </FormGroup>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12}>
                  <hr />
                  <h5 className="font-weight-600">Câu trả lời</h5>
                  <Blockquote
                    cite="Chọn vào radio để đánh dấu câu trả lời đúng!"
                    icon={null}
                    className="mt--4 p-0"
                  ></Blockquote>
                  <div className="container">
                    <Row>
                      {/* <label className="form-control-label" htmlFor="name">
                        Số câu trả lời
                      </label>
                      <Input
                        // label="Your favorite framework/library"
                        type="number"
                        placeholder="0"
                        value={numberInputs}
                        onChange={handleNumInputsChange}
                        className="form-control-alternative"
                      /> */}
                      {renderInputs()}
                    </Row>
                  </div>
                </Col>
                <div className="container">
                  <Button
                    color="dark"
                    className="mt-3 float-left"
                    onClick={handleAddGroup}
                  >
                    <i className="bx bx-list-plus"></i> Thêm câu trả lời
                  </Button>
                </div>
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
                setShowModal(false);
                setIsUpdate(false);
              }}
            >
              Trở lại
            </Button>
            <Button
              color={isUpdate ? "primary" : "success"}
              type="button"
              onClick={() => {
                // isUpdate ? handleUpdateSubject() : handleCreateNewSubject();
                handleStoreQuestions();
              }}
            >
              {isUpdate ? "Cập nhật" : "Thêm môn học"}
            </Button>
          </div>
        </Modal>
      </Container>
      {/* Page content end */}
    </>
  );
};

export default Questions;
