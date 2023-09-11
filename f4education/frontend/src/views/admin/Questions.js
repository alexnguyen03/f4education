import { Box, FormGroup, IconButton } from "@mui/material";
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
  Container,
  Input,
  Modal,
} from "reactstrap";

// Axios
import questionApi from "../../api/questionApi";
import courseApi from "../../api/courseApi";

//React Mantine
import { Select } from "@mantine/core";
import { Link } from "react-router-dom";

const dataFake = [
  {
    questionId: "1",
    subjectName: "Angular",
    courseName: "Angular cơ bản cho người mới",
    questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
    adminName: "adminName",
    avgQuestion: 5,
  },
  {
    questionId: "2",
    subjectName: "ReactJs",
    courseName: "React & React Hook ",
    questionTitle: "Làm thế nào để deploy project lên mạng",
    adminName: "adminName2",
    avgQuestion: 10,
  },
];

const QuestionData = [
  {
    questionId: 1,
    subjectName: "NextJS",
    courseName: "NextJS cơ bản cho người mới",
    questionTitle: "Làm thế nào để tạo mới nextjs project",
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
  // Main variable
  const [questions, setQuestions] = useState(QuestionData);
  const [courses, setCourses] = useState([]);

  // Action variable
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [numberInputs, setNumberInputs] = useState(0); // Num input user choosen
  const [answerInputValues, setAnswerInputValues] = useState([]);

  // Form variable
  const [errorInputAddSubject, setErrorInputAddSubject] = useState({
    status: false,
    message: "",
  });

  const [errorInputUpdateSubject, setErrorInputUpdateSubject] = useState({
    status: false,
    message: "",
  });

  // Get LocalStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ************* Question Area
  const [question, setQuestion] = useState({
    questionId: "",
    questionContent: [],
    answer: "",
    level: "",
    courseId: "",
    adminId: "",
  });

  // Api Area
  // const fetchQuestions = async () => {
  //   try {
  //     const resp = await questionApi.getAllQuestion();
  //     setQuestions(resp);
  //     console.log("restarted application");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchCourse = async () => {
  //   try {
  //     const resp = await courseApi.getAll();
  //     setCourses(resp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // API_AREA > CRUD
  const handleCreateNewSubject = async () => {
    question.questionId = "";
    const questionContent = [
      {
        id: 1,
        question: [{}],
      },
    ];

    const action = "add";
    if (validateForm(action)) {
      try {
        const body = question;
        console.log(body);
        // const resp = await questionApi.createSubject(body);
        // console.log(resp);
      } catch (error) {
        console.log(error);
      }
      console.log("Add Success");

      // fetchQuestions();
      setShowModal(false);
    } else console.log("Error in validation");
  };

  // Validation area
  const validateForm = (action) => {
    if (question.questionContent.length === 0) {
      if (action === "add") {
        setErrorInputAddSubject({
          status: true,
          message: "Vui lòng nhập vào tên môn học",
        });
      } else {
        setErrorInputUpdateSubject({
          status: true,
          message: "Vui lòng nhập vào tên môn học",
        });
      }
      return false;
    } else {
      setErrorInputAddSubject({
        status: false,
        message: "",
      });
      setErrorInputUpdateSubject({
        status: false,
        message: "",
      });
    }
    return true;
  };

  // Form action area
  const handleChangeInput = (e) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [e.target.name]: e.target.value,
    }));
  };

  // React Data table area
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
        accessorKey: "avgQuestion",
        header: "Tổng câu hỏi ",
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

  // *************** Use effect area
  // useEffect(() => {
  //   fetchQuestions();
  //   fetchCourse();
  // }, []);

  // Render Input buy number choosen
  const handleNumInputsChange = (event) => {
    const newNumInputs = parseInt(event.target.value);

    if (newNumInputs < numberInputs) {
      const newInputValues = answerInputValues.slice(0, newNumInputs);
      setAnswerInputValues(newInputValues);
    }

    setNumberInputs(newNumInputs);
  };

  const renderInputs = () => {
    const inputs = [];

    for (let i = 0; i < numberInputs; i++) {
      const handleChange = (e) => {
        const newValues = [...answerInputValues];
        newValues[i] = e.target.value;
        setAnswerInputValues(newValues);
      };

      inputs.push(
        <FormGroup className="mt-3">
          <label className="form-control-label">Câu trả lời {i + 1}</label>
          <Input
            className="form-control-alternative"
            key={i}
            type="text"
            value={answerInputValues[i] || ""}
            onChange={handleChange}
          />
        </FormGroup>
      );
    }

    return inputs;
  };

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
              data={questions}
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
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </div>
              )}
              // Top Add new Subject button
              renderTopToolbarCustomActions={() => (
                <Button
                  color="primary"
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
          className="modal-dialog-centered"
          isOpen={showModal}
          toggle={showModal}
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
              {isUpdate && (
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
              )}
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  Môn học
                </label>
                {/* <Select options={options} defaultInputValue={"Môn học"}/> */}
                <Select
                  // label="Your favorite framework/library"
                  placeholder="Chon mon hoc"
                  searchable
                  clearable
                  nothingFound="No options"
                  data={["React", "Angular", "Java", "Vue"]}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  Khóa học
                </label>
                <Select
                  // label="Your favorite framework/library"
                  placeholder="Chon khoa hoc"
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
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="questionTitle">
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
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  câu trả lời
                </label>
                <Input
                  className="form-control-alternative"
                  id="answer"
                  onChange={handleChangeInput}
                  name="answer"
                  value={question.answer}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  Cấp độ
                </label>
                <Input
                  className="form-control-alternative"
                  id="level"
                  onChange={handleChangeInput}
                  name="level"
                  value={question.level}
                />
              </FormGroup>
              {/* <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  Tên người tạo
                </label>
                <Input
                  className="form-control-alternative"
                  disabled
                  id="adminId"
                  onChange={handleChangeInput}
                  name="adminId"
                  value={question.adminId}
                />
              </FormGroup> */}
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
              color="primary"
              type="button"
              onClick={() => {
                // isUpdate ? handleUpdateSubject() : handleCreateNewSubject();
                // toast("Cập nhật môn học thành công");
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
