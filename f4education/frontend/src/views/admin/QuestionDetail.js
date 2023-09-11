import { Alert, Badge, Select, Tabs } from "@mantine/core";
import QuestionDetailHeader from "components/Headers/QuestionDetailHeader";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Input,
  Modal,
  Row,
} from "reactstrap";

// const dataFake = [
//   {
//     questionId: "1",
//     subjectName: "Angular",
//     courseName: "Angular cơ bản cho người mới",
//     questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
//     adminName: "adminName",
//     correctAnswerId: "3",
//   },
//   {
//     questionId: "2",
//     subjectName: "ReactJs",
//     courseName: "React & React Hook ",
//     questionTitle: "Làm thế nào để deploy project lên mạng",
//     adminName: "abc123admin",
//     correctAnswerId: "6",
//   },
// ];

const answerFake = [
  {
    answerId: "1",
    questionId: "1",
    correctAnswerId: "3",
    questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
    answer: [
      {
        id: "1",
        answerText: "Answer 1",
        questionId: "1",
      },
      {
        id: "2",
        answerText: "Answer 2",
        questionId: "1",
      },
      {
        id: "3",
        answerText: "Answer 3",
        questionId: "1",
      },
      {
        id: "4",
        answerText: "Answer 4",
        questionId: "1",
      },
    ],
  },
  {
    answerId: "2",
    questionId: "2",
    correctAnswerId: "6",
    questionTitle: "State & Hook in angular ",
    answer: [
      {
        id: "5",
        answerText: "Answer 1",
        questionId: "2",
      },
      {
        id: "6",
        answerText: "Answer 2",
        questionId: "2",
      },
      {
        id: "7",
        answerText: "Answer 3",
        questionId: "2",
      },
      {
        id: "8",
        answerText: "Answer 4",
        questionId: "2",
      },
    ],
  },
];

const questionData = [
  {
    questionId: "1",
    subjectName: "Angular",
    courseName: "Angular cơ bản cho người mới",
    adminName: "adminName",
    totalQuestion: 5,
    correctAnswerId: 3,
  },
  {
    questionId: "2",
    subjectName: "ReactJs",
    courseName: "React & React Hook ",
    adminName: "adminName123",
    totalQuestion: 10,
    correctAnswerId: 7,
  },
];

const answerData = [
  {
    answerId: "1",
    text: "answer one",
    question: {
      questionId: "1",
      subjectName: "Angular",
      courseName: "Angular cơ bản cho người mới",
      questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
      adminName: "adminName",
      totalQuestion: 5,
      correctAnswerId: 1,
    },
  },
  {
    answerId: "2",
    text: "answer two",
    question: {
      questionId: "1",
      subjectName: "Angular",
      courseName: "Angular cơ bản cho người mới",
      questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
      adminName: "adminName",
      totalQuestion: 5,
      correctAnswerId: 1,
    },
  },
  {
    answerId: "3",
    text: "answer one",
    question: {
      questionId: "2",
      subjectName: "ReactJs",
      courseName: "React & React Hook ",
      questionTitle: "Làm thế nào để deploy project lên mạng",
      adminName: "adminName123",
      totalQuestion: 10,
      correctAnswerId: 3,
    },
  },
  {
    answerId: "4",
    text: "answer two",
    question: {
      questionId: "2",
      subjectName: "ReactJs",
      courseName: "React & React Hook ",
      questionTitle: "Làm thế nào để deploy project lên mạng",
      adminName: "adminName123",
      totalQuestion: 10,
      correctAnswerId: 3,
    },
  },
];

const questionDataTest = [
  {
    questionId: "1",
    subjectName: "Angular",
    courseName: "Angular cơ bản cho người mới",
    questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
    adminName: "adminName",
    totalQuestion: 5,
    correctAnswerId: 1,
    answers: [
      { answerId: "1", text: "answer one" },
      { answerId: "2", text: "answer two" },
      { answerId: "3", text: "answer three" },
      { answerId: "4", text: "answer four" },
    ],
  },
  {
    questionId: "2",
    subjectName: "ReactJs",
    courseName: "React & React Hook",
    questionTitle: "Làm thế nào để deploy project lên mạng",
    adminName: "adminName123",
    totalQuestion: 10,
    correctAnswerId: 3,
    answers: [
      { answerId: "5", text: "answer five" },
      { answerId: "6", text: "answer six" },
      { answerId: "7", text: "answer seven" },
      { answerId: "8", text: "answer eight" },
    ],
  },
];

const QuestionComponent = ({ question }) => {
  return (
    <div>
      <h3>{question.questionTitle}</h3>
      <p>Subject: {question.subjectName}</p>
      <p>Course: {question.courseName}</p>
      {/* Hiển thị các câu trả lời */}
      <ul>
        {question.answers.map((answer) => (
          <li key={answer.answerId}>{answer.text}</li>
        ))}
      </ul>
    </div>
  );
};

const CourseComponent = ({ courseName, questions }) => {
  return (
    <div>
      <h2>{courseName}</h2>
      {questions.map((question) => (
        <QuestionComponent key={question.questionId} question={question} />
      ))}
    </div>
  );
};

const QuestionDetail = () => {
  // Route and Params
  const { courseName } = useParams();

  // const questionFromRoute = dataFake.find(
  //   (pj) => pj.courseName.trim() === courseName.trim()
  // );

  const questionByCourseNameRoute = questionData.find(
    (pj) => pj.courseName.trim() === courseName.trim()
  );

  console.log(questionByCourseNameRoute);

  // Main variable
  const [questions, setQuestions] = useState(answerFake);
  // const [answers, setAnswers] = useState(questions.map((item) => item.answer));
  const [answers, setAnswers] = useState(answerData);

  const questionByCourNameFilter = answers.filter(
    (answer) =>
      answer.question.courseName === questionByCourseNameRoute.courseName
  );

  const [questionsByCourseName, setQuestionsByCourseName] = useState(
    questionByCourNameFilter
  );

  const [numberInputs, setNumberInputs] = useState(0); // Num input user choosen
  const [answerInputValues, setAnswerInputValues] = useState([]);

  // Action variable
  const [editAnswer, setEditAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  // const [deleteQuestion, setDeleteQuestion] = useState(false);

  // Form Variable
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answer, setAnswer] = useState({
    id: "",
    answerText: "",
    questionId: "",
  });

  // Lấy danh sách các câu hỏi theo courseName
  const getQuestionsByCourseName = (courseName) => {
    return answerData
      .filter((answer) => answer.question.courseName === courseName)
      .map((answer) => answer.question);
  };

  // Lấy các câu trả lời cho một câu hỏi dựa trên questionId
  const getAnswersByQuestionId = (questionId) => {
    return answerData.filter(
      (answer) => answer.question.questionId === questionId
    );
  };

  // Lấy danh sách các khóa học duy nhất
  const getUniqueCourses = () => {
    const uniqueCourses = [
      ...new Set(answerData.map((answer) => answer.question.courseName)),
    ];
    return uniqueCourses;
  };

  // Question GRID AREA
  // input footer Card
  const handleOnchangeInputAnswer = (e) => {
    setAnswer({ ...answer, answerText: e.target.value });
  };

  // Change span to input and get value
  const handlesetEditAbleInput = (prev) => {
    setEditAnswer(!prev);
  };

  const handleSetIsEditngFunction = (prev) => {
    setIsEditing(!prev);
  };

  //  function set Edit when click edit button
  const handleEditQuestion = (as) => {
    // set action render UI
    answer.id = as.answerId;
    answer.questionId = as.questionId;
    handlesetEditAbleInput(editAnswer);
    setEditQuestionId(as.questionId);
    // Action change data

    // setIsEditngFunction(isEditing);
  };

  // Function update when click update
  const handleUpdateQuestion = () => {
    // Set change action render UI
    setEditQuestionId(null);
    setEditAnswer(false);
    setIsEditing(false);

    // Handle Change Data
  };

  // Render Input buy number choosen are
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

  const handleStoreNewQuestion = () => {
    // Lưu giá trị vào mảng hoặc thực hiện các xử lý khác
    console.log(answerInputValues);
  };

  //  handle get valule of answerText in foooter Card select
  const getAnswerTextByQuestionId = (questionId) => {
    console.log(selectedAnswers);
    return selectedAnswers[questionId] || null;
  };

  return (
    <>
      {/* HeaderSubject start */}
      <QuestionDetailHeader />
      {/* HeaderSubject End */}

      {/* Top tollbar and title */}
      <div className="container">
        {/* BreadCum */}
        <Link to="/admin/questions" className="blockquote-footer my-3">
          Câu hỏi / Câu hỏi chi tiết
        </Link>
        {/* Header Title */}
        <h1 className="mb-3">
          Môn học | {questionByCourseNameRoute.subjectName}
        </h1>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center ">
            <div>
              <img
                src="https://i.pinimg.com/originals/ec/04/8f/ec048fa1e083df7aeb49c06d7b75bcfc.jpg"
                alt=""
                className="rounded-circle overflow-hidden"
                width="50px"
                height="50px"
              />
            </div>
            <div className="ml-3">
              <h2 className="text-primary mb-0">
                {questionByCourseNameRoute.courseName}
              </h2>
              <div className="d-flex align-items-center flex-wrap">
                <h6>{questionByCourseNameRoute.adminName}</h6>
                <span className="mx-3 font-weight-400 mt--1">
                  <i className="bx bx-x text-gray"></i>
                </span>
                <h6>{moment(new Date()).format("DD-MM-yyyy, h:mm:ss a")}</h6>
              </div>
            </div>
          </div>
          <div>
            <Button
              color="primary"
              onClick={() => setShowModal(true)}
              className="mt-3 mt-lg-0 mt-xl-0"
            >
              Thêm câu hỏi mới
            </Button>
          </div>
        </div>
        {/* HR */}
        <hr className="text-muted" />
        {/* Tabs */}
        <div>
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab
                rightSection={
                  <Badge
                    w={16}
                    h={16}
                    sx={{ pointerEvents: "none" }}
                    variant="filled"
                    size="xs"
                    p={0}
                  >
                    6
                  </Badge>
                }
                value="overview"
              >
                Tổng quan
              </Tabs.Tab>
              <Tabs.Tab value="settings">Gì đó</Tabs.Tab>
              <Tabs.Tab value="money">Gì đó</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
      <div>
        <h1>Khóa học</h1>
        {getUniqueCourses().map((courseName) => (
          <CourseComponent
            key={courseName}
            courseName={courseName}
            questions={getQuestionsByCourseName(courseName)}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="container">
        <Row className="mt-3">
          {/* Item */}
          {questionsByCourseName.map((qs, index) => (
            <Col
              lg={6}
              xl={6}
              md={12}
              sm={12}
              key={qs.answerId}
              className="mb-3"
            >
              <Card style={{ minWidth: "400px", minHeight: "365px" }}>
                <CardBody>
                  {/* Title Question */}
                  <h4 className="bg-secondary p-2">
                    <span className="text-dark font-weight-600">
                      Question {index + 1}: {qs.question.questionTitle}
                    </span>
                  </h4>
                  {/* Answer Display Area */}
                  <Row>
                    {/* {as.answer.map((answerDetail) => (
                      <>
                        <Col
                          lg={12}
                          xl={12}
                          md={12}
                          sm={12}
                          key={answerDetail.id}
                        >
                          <div className="d-flex gap-3">
                            <div style={{ width: "40px", height: "40px" }}>
                              {as.correctAnswerId === answerDetail.id ? (
                                <i className="bx bx-check-circle text-success"></i>
                              ) : (
                                <i className="bx bx-x-circle text-danger"></i>
                              )}
                            </div>

                            {editAnswer && as.questionId === editQuestionId ? (
                              <input
                                className="answer-input text-dark ml--2 mb-1"
                                onChange={(e) => handleOnchangeInputAnswer(e)}
                                key={answerDetail.id}
                                name="answerText"
                                value={answerDetail.answerText}
                              />
                            ) : (
                              <span
                                className="text-dark ml--2 mb-1"
                                key={answerDetail.id}
                              >
                                {answerDetail.answerText}
                              </span>
                            )}
                          </div>
                        </Col>
                      </>
                    ))} */}
                  </Row>
                </CardBody>
                {/* Action Area */}
                {/* <CardFooter>
                  <FormGroup>
                    <Select
                      // label="Chọn câu trả lời đúng"
                      placeholder="Chọn câu trả lời đúng"
                      searchable
                      clearable
                      nothingFound="Vui lòng nhập câu trả lời khác"
                      value={getAnswerTextByQuestionId(as.questionId)}
                      onChange={(value) =>
                        setSelectedAnswers((prevSelectedAnswers) => ({
                          ...prevSelectedAnswers,
                          [as.questionId]: value, // Update selected answer for the specific questionId
                        }))
                      }
                      data={as.answer.map((answerDetail) => ({
                        value: answerDetail.id,
                        label: answerDetail.answerText,
                      }))}
                    />
                  </FormGroup>
                  {editAnswer && as.questionId === editQuestionId ? (
                    <Button
                      color="warning"
                      role="button"
                      className="float-left"
                      onClick={handleUpdateQuestion}
                    >
                      Cập nhật
                    </Button>
                  ) : (
                    <></>
                  )}

                  <Button
                    color="primary"
                    outline
                    role="button"
                    className="float-right"
                    onClick={() => handleEditQuestion(as)}
                  >
                    <i className="bx bx-edit"></i>
                  </Button>

                  {!isEditing && as.questionId !== editQuestionId ? (
                    <Button
                      color="danger"
                      className="float-right mr-2"
                      onClick={() => alert("xóa rồi bạn ơi bớt click đi!")}
                    >
                      <i className="bx bx-trash"></i>
                    </Button>
                  ) : (
                    <></>
                  )}
                </CardFooter> */}
              </Card>
            </Col>
          ))}
        </Row>
      </main>

      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={showModal}
        toggle={showModal}
        backdrop={"static"}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title-default">
            Thêm câu hỏi
          </h3>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setShowModal(false)}
          >
            <span aria-hidden={true} onClick={() => setShowModal(false)}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <form method="post">
            <FormGroup className="mb-3">
              <label className="form-control-label" htmlFor="name">
                Môn học
              </label>
              {/* <Select options={options} defaultInputValue={"Môn học"}/> */}
              <Select
                // label="Your favorite framework/library"
                placeholder="Chon mon hoc"
                disabled
                searchable
                clearable
                defaultValue="React"
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
                disabled
                searchable
                clearable
                defaultValue="React & Hook co ban"
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
                // onChange={handleChangeInput}
                name="questionTitle"
                // value={question.questionTitle}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <label className="form-control-label" htmlFor="name">
                Số câu trả lời
              </label>
              <Input
                // label="Your favorite framework/library"
                type="number"
                placeholder="0"
                value={numberInputs}
                onChange={handleNumInputsChange}
                className="form-control-alternative"
              />

              {/* {numberInputs > 0 ? (
                <>
                  {Array.from({ length: numberInputs }, (_, index) => (
                    <FormGroup className="mt-3">
                      <label className="form-control-label" htmlFor="name">
                        Câu trả lời <strong>{index + 1}</strong>
                      </label>
                      <Input
                        key={index}
                        className="form-control-alternative"
                        type="text"
                        value={answerInputValues[index]}
                        onChange={(event) => handleInputChange(event, index)}
                      />
                    </FormGroup>
                  ))}
                </>
              ) : (
                <></>
              )} */}

              <div>{renderInputs()}</div>
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
            }}
          >
            Trở lại
          </Button>
          <Button
            color="success"
            type="button"
            onClick={() => {
              handleStoreNewQuestion();
            }}
          >
            Thêm câu hỏi mới
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default QuestionDetail;
