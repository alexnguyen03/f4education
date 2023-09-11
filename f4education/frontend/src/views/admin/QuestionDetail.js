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

const QuestionVSAnswerDate = [
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
    questionId: 6,
    subjectName: "NextJS",
    courseName: "NextJS cơ bản cho người mới",
    questionTitle: "Làm thế nào để run project",
    answer: [
      {
        answerId: 10,
        text: "câu trả lời 1",
        isCorrect: true,
      },
      {
        answerId: 11,
        text: "câu trả lời 2",
        isCorrect: false,
      },
    ],
    adminName: "Nguyễn Hoài Nam",
  },
];

const QuestionDetail = () => {
  // Route and Params
  const courseName = "NextJS cơ bản cho người mới";
  // const { courseName } = useParams();

  // const questionFromRoute = dataFake.find(
  //   (pj) => pj.courseName.trim() === courseName.trim()
  // );

  const questionByCourseNameRoute = QuestionVSAnswerDate.find(
    (pj) => pj.courseName.trim() === courseName.trim()
  );

  console.log(questionByCourseNameRoute);

  // Main variable
  const [questions, setQuestions] = useState(QuestionVSAnswerDate);
  // const [answers, setAnswers] = useState(questions.map((item) => item.answer));
  // const [answers, setAnswers] = useState(answerData);

  // const questionByCourNameFilter = answers.filter(
  //   (answer) =>
  //     answer.question.courseName === questionByCourseNameRoute.courseName
  // );

  // const [questionsByCourseName, setQuestionsByCourseName] = useState(
  //   questionByCourNameFilter
  // );

  // Number of render Input for answer
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
  // const getQuestionsByCourseName = (courseName) => {
  //   return answerData
  //     .filter((answer) => answer.question.courseName === courseName)
  //     .map((answer) => answer.question);
  // };

  // Lấy các câu trả lời cho một câu hỏi dựa trên questionId
  // const getAnswersByQuestionId = (questionId) => {
  //   return answerData.filter(
  //     (answer) => answer.question.questionId === questionId
  //   );
  // };

  // Lấy danh sách các khóa học duy nhất
  // const getUniqueCourses = () => {
  //   const uniqueCourses = [
  //     ...new Set(answerData.map((answer) => answer.question.courseName)),
  //   ];
  //   return uniqueCourses;
  // };

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
          <div className="d-flex jusitfy-content-between align-items-center mb-3">
            <input className="mr-2" id={`answeradio${i}`} name="answerQuestion"  type="radio" />
            <label className="w-100" htmlFor={`answeradio${i}`}>
              <Input
                className="form-control-alternative"
                key={i}
                type="text"
                value={answerInputValues[i] || ""}
                onChange={handleChange}
              />
            </label>
          </div>
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
                    {questions.length}
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

      {/* Main content */}
      <main className="container">
        <Row className="mt-3">
          {/* Item */}
          {questions.map((qs, index) => (
            <Col
              lg={6}
              xl={6}
              md={12}
              sm={12}
              key={qs.questionId}
              className="mb-3"
            >
              <Card style={{ minWidth: "400px", minHeight: "365px" }}>
                <CardBody>
                  {/* Title Question */}
                  <h4
                    className="p-2"
                    style={{ background: "#f1f1f1", borderRadius: "3px" }}
                  >
                    <span className="text-dark font-weight-600">
                      Question {index + 1}: {qs.questionTitle}
                    </span>
                  </h4>
                  {/* Answer Display Area */}
                  <div style={{ height: "180px", overflowY: "auto" }}>
                    <Row>
                      {qs.answer.map((answerDetail) => (
                        <>
                          <Col
                            lg={12}
                            xl={12}
                            md={12}
                            sm={12}
                            key={answerDetail.answerId}
                          >
                            <div className="d-flex gap-3">
                              <div style={{ width: "40px", height: "40px" }}>
                                {answerDetail.isCorrect ? (
                                  <i className="bx bx-check-circle text-success"></i>
                                ) : (
                                  <i className="bx bx-x-circle text-danger"></i>
                                )}
                              </div>

                              {editAnswer &&
                              qs.questionId === editQuestionId ? (
                                <input
                                  className="answer-input text-dark ml--2 mb-1"
                                  onChange={(e) => handleOnchangeInputAnswer(e)}
                                  key={answerDetail.answerId}
                                  name="answerText"
                                  value={answerDetail.text}
                                />
                              ) : (
                                <span
                                  className="text-dark ml--2 mb-1"
                                  key={answerDetail.answerId}
                                >
                                  {answerDetail.text}
                                </span>
                              )}
                            </div>
                          </Col>
                        </>
                      ))}
                    </Row>
                  </div>
                </CardBody>
                {/* Action Area */}
                <CardFooter>
                  <FormGroup>
                    <Select
                      // label="Chọn câu trả lời đúng"
                      placeholder="Chọn câu trả lời đúng"
                      searchable
                      clearable
                      nothingFound="Vui lòng nhập câu trả lời khác"
                      value={getAnswerTextByQuestionId(qs.questionId)}
                      onChange={(value) =>
                        setSelectedAnswers((prevSelectedAnswers) => ({
                          ...prevSelectedAnswers,
                          [qs.questionId]: value, // Update selected answer for the specific questionId
                        }))
                      }
                      data={qs.answer.map((answerDetail) => ({
                        value: answerDetail.answerId,
                        label: answerDetail.text,
                      }))}
                    />
                  </FormGroup>
                  {editAnswer && qs.questionId === editQuestionId ? (
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
                    onClick={() => handleEditQuestion(qs)}
                  >
                    <i className="bx bx-edit"></i>
                  </Button>

                  {!isEditing && qs.questionId !== editQuestionId ? (
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
                </CardFooter>
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
              <label className="form-control-label">Môn học</label>
              <Input disabled value={questionByCourseNameRoute.subjectName} />
            </FormGroup>
            <FormGroup className="mb-3">
              <label className="form-control-label">Khóa học</label>
              <Input disabled value={questionByCourseNameRoute.courseName} />
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
