import { Box, FormGroup, Typography } from "@mui/material";
import QuestionHeader from "components/Headers/QuestionHeader";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";

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

//React Select
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const Questions = () => {
  // Main variable
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);

  // Action variable
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

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
  const fetchQuestions = async () => {
    try {
      const resp = await questionApi.getAllQuestion();
      setQuestions(resp);
      console.log("restarted application");
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

      fetchQuestions();
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
        accessorKey: "questionContent",
        header: "Câu hỏi",
        size: 80,
      },
      {
        accessorKey: "answer",
        header: "Tên Môn Học",
        size: 80,
      },
      {
        accessorKey: "level",
        header: "Cấp độ",
        size: 40,
      },
      {
        accessorKey: "courseName",
        header: "Tên khóa học",
        size: 120,
      },
      {
        accessorKey: "adminName",
        header: "Tên người tạo",
        size: 80,
      },
    ],
    []
  );

  // *************** Use effect area
  useEffect(() => {
    fetchQuestions();
    fetchCourse();
  }, []);

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
            <h3 className="mb-0">
              {/* {isSubjectHistoryShowing
                ? "Bảng lịch sử môn học"
                : "Bảng Môn học"} */}
              Bảng câu hỏi
            </h3>
            <Button
              color="default"
              type="button"
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
              data={questions}
              renderDetailPanel={({ row }) => (
                <Box
                  sx={{
                    display: 'grid',
                    margin: 'auto',
                    gridTemplateColumns: '1fr 1fr',
                    width: '100%',
                  }}
                >
                  <Typography>Address: </Typography>
                  <Typography>City</Typography>
                  <Typography>State</Typography>
                  <Typography>Country</Typography>
                </Box>
              )}
              // initialState={{ columnVisibility: { subjectId: false } }}
              positionActionsColumn="last"
              // editingMode="modal" //default
              enableColumnOrdering
              // enableRowOrdering
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
                  <Button
                    color="warning"
                    outline
                    onClick={() => {
                      // handleEditSubject(row);
                    }}
                  >
                    {/* {isSubjectHistoryShowing ? (
                      <i className="bx bx-revision"></i>
                    ) : (
                      
                    )} */}
                    <i className="bx bx-edit"></i>
                  </Button>
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
                <Select options={options} defaultInputValue={"Môn học"}/>
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  Khóa học
                </label>
                <Select options={options} defaultInputValue={"Khóa học"}/>
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="questionContent">
                  Thông tin câu hỏi
                </label>
                <Input
                  className="form-control-alternative"
                  disabled
                  id="questionContent"
                  onChange={handleChangeInput}
                  name="questionContent"
                  value={question.questionContent}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  câu trả lời
                </label>
                <Input
                  className="form-control-alternative"
                  disabled
                  id="answer"
                  onChange={handleChangeInput}
                  name="answer"
                  value={question.answer}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  câu trả lời
                </label>
                <Input
                  className="form-control-alternative"
                  disabled
                  id="level"
                  onChange={handleChangeInput}
                  name="level"
                  value={question.level}
                />
              </FormGroup>
              <FormGroup className="mb-3">
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
              </FormGroup>
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
