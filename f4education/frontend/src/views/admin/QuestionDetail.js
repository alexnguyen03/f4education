import { Alert, Badge, Blockquote, Select, Tabs } from "@mantine/core";
import QuestionDetailHeader from "components/Headers/QuestionDetailHeader";
import moment from "moment";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  Row,
} from "reactstrap";
import { IconButton } from "@mui/material";

const QuestionVSAnswerData = [
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
    questionId: 6,
    subjectName: "NextJS",
    courseName: "NextJS cơ bản cho người mới",
    questionTitle: "Làm thế nào để run project",
    createDate: "2023-09-11T13:45:55.371+00:00",
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

const AnswerData = [
  {
    answerId: 1,
    text: "câu trả lời 1",
    isCorrect: false,
    questionId: 1,
  },
  {
    answerId: 2,
    text: "câu trả lời 2",
    isCorrect: false,
    questionId: 1,
  },
  {
    answerId: 3,
    text: "câu trả lời 3",
    isCorrect: true,
    questionId: 1,
  },
  {
    answerId: 4,
    text: "câu trả lời 4",
    isCorrect: false,
    questionId: 1,
  },
  {
    answerId: 5,
    text: "câu trả lời 1",
    isCorrect: true,
    questionId: 6,
  },
  {
    answerId: 6,
    text: "câu trả lời 2",
    isCorrect: false,
    questionId: 6,
  },
];

const QuestionDetail = () => {
  // ************* ROute and Params
  const courseName = "NextJS cơ bản cho người mới";
  // const { courseName } = useParams();

  // const questionFromRoute = dataFake.find(
  //   (pj) => pj.courseName.trim() === courseName.trim()
  // );

  const questionByCourseNameRoute = QuestionVSAnswerData.find(
    (pj) => pj.courseName.trim() === courseName.trim()
  );

  // ************* Main variable
  const [questions, setQuestions] = useState(QuestionVSAnswerData);
  const [answers, setAnswers] = useState(AnswerData);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // const questionByCourNameFilter = answers.filter(
  //   (answer) =>
  //     answer.question.courseName === questionByCourseNameRoute.courseName
  // );

  // const [questionsByCourseName, setQuestionsByCourseName] = useState(
  //   questionByCourNameFilter
  // );

  // ************* Action variable
  const [editAnswer, setEditAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  // ************* Form variable
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("Default Null");

  const [answer, setAnswer] = useState({
    id: "",
    answerText: "",
    questionId: "",
  });
  const [question, setQuestion] = useState({
    subjectId: selectedSubjectId,
    courseId: selectedCourseId,
    questionTitle: "",
    adminId: "namnguyen",
  });

  // ************* API AREA

  // + API > CRUD
  // Lúc thêm question thì sẽ thêm luôn cái answers json sẽ giống với cái QuestionVsAnswerData;
  // Lúc cập nhật cũng giống như lúc thêm

  // *************** Validation area
  // Change span to input and get value
  const handlesetEditAbleInput = (prev) => {
    setEditAnswer(!prev);
  };

  //  function set Edit when click edit button
  const handleEditQuestion = (qs) => {
    // set action render UI
    answer.id = qs.answerId;
    answer.questionId = qs.questionId;

    handlesetEditAbleInput(editAnswer);
    setEditQuestionId(qs.questionId);
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

  // *************** Form action area
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

  // + Tranfer and fill data to ANSWERS STATE
  const handleDataTranferAnswers = () => {
    const newAnswers = groups.map((group) => ({
      isCorrect: group.radioValue,
      text: group.inputValue,
    }));
    console.log(newAnswers);
    // setAnswers(newAnswers);
  };

  // *************** render input in create new question modal
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
                  className="mt-3"
                  type="radio"
                  checked={group.radioValue}
                  onChange={() => handleRadioChange(index)}
                  style={{ width: "20px", height: "20px" }}
                />
              </label>
            </div>
            {/* <Input
              className="form-control-alternative ml-2"
              type="text"
              value={group.inputValue}
              onChange={(e) => handleInputChange(index, e.target.value)}
            /> */}
            {/* <InputGroup className="mb-4">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-fat-delete" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="trả lời"
                className="ml-2"
                type="text"
                value={group.inputValue}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </InputGroup> */}
            <InputGroup className="ml-2">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-fat-delete" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                className="pl-2"
                placeholder="câu trả lời"
                type="text"
                value={group.inputValue}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </InputGroup>
          </div>
        </FormGroup>
      </Col>
    ));
  };

  const handleChangeInput = (e) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [e.target.name]: e.target.value,
    }));
  };

  // ************* Select Handle Logic AREA create question modal
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

  // *************** Render question and answer AREA
  //  handle get valule of answerText in foooter Card select
  const getAnswerTextByQuestionId = (questionId) => {
    // console.log(selectedAnswers);
    return selectedAnswers[questionId] || null;
  };

  // render UI answers inside question card
  const renderAnswers = (question) => {
    return answers.map((answerDetail) => (
      <>
        {answerDetail.questionId === question.questionId ? (
          <Col lg={12} xl={12} md={12} sm={12} key={answerDetail.answerId}>
            <div className="d-flex gap-3">
              {editAnswer && question.questionId === editQuestionId ? (
                <div className="d-flex align-items-center mb-2 mr-4">
                  <label>
                    <input
                      type="radio"
                      name={`radio_${answerDetail.questionId}`}
                      // checked={answerDetail.isCorrect}
                      // onChange={(e) => handleChangeAnswers(e)}
                    />
                  </label>
                </div>
              ) : (
                <>
                  <div style={{ width: "40px", height: "40px" }}>
                    {answerDetail.isCorrect ? (
                      <i className="bx bx-check-circle text-success"></i>
                    ) : (
                      <i className="bx bx-x-circle text-danger"></i>
                    )}
                  </div>
                </>
              )}

              {editAnswer && question.questionId === editQuestionId ? (
                <input
                  className="answer-input w-100 text-dark ml--2 pl-2 mb-1"
                  // onChange={(e) => {
                  // handleChangeAnswers(e);
                  // }}
                  key={answerDetail.answerId}
                  name="text"
                  // value={answerDetail.text}
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
        ) : (
          <></>
        )}
      </>
    ));
  };

  const handleEditQuestionByQuestionId = (qs) => {
    handleEditQuestion(qs);
    handleFilterByQuestionIdAnswer();
  };

  // render UI questions
  const renderGroupsQuestion = () => {
    return QuestionVSAnswerData.map((qs, index) => (
      <>
        <Col lg={6} xl={6} md={12} sm={12} key={qs.questionId} className="mb-3">
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
                  {/* if answer.questionId === qs.questionId */}
                  {renderAnswers(qs)}
                </Row>
              </div>
            </CardBody>
            {/* Action Area */}
            <CardFooter>
              {/* Select true answer */}
              {/* <FormGroup>
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
              </FormGroup> */}

              {/* Update button */}
              {editAnswer && qs.questionId === editQuestionId ? (
                <Button
                  color="dark"
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
                    outline
                    disabled
                    role="button"
                    className="float-left"
                    onClick={handleUpdateQuestion}
                  >
                    Cập nhật
                  </Button>
                </>
              )}

              {/* Edit button */}
              <IconButton
                color="info"
                className="float-right"
                onClick={() => {
                  handleEditQuestionByQuestionId(qs);
                }}
              >
                <EditIcon />
              </IconButton>

              {/* Delete button */}
              {editAnswer && qs.questionId === editQuestionId ? (
                <IconButton className="float-right text-danger" disabled>
                  <DeleteIcon />
                </IconButton>
              ) : (
                <>
                  <IconButton className="float-right text-danger" onClick={()=>alert('deleted')}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </CardFooter>
          </Card>
        </Col>
      </>
    ));
  };

  // *************** Action question and answer AREA
  const [groupAnswer, setGroupAnswers] = useState(
    answers.map((answer) => ({
      answerId: answer.answerId,
      text: answer.text,
      isCorrect: answer.isCorrect,
      questionId: answer.questionId,
    }))
  );
  const [filterGroupAnswerByQuestionId, setFilterGroupAnswerByQuestionId] =
    useState([]);

  const handleFilterByQuestionIdAnswer = () => {
    // if (isEditing) {
    setFilterGroupAnswerByQuestionId(
      groupAnswer.filter((answer) => answer.questionId === editQuestionId)
    );
    // }
    console.log(filterGroupAnswerByQuestionId);
  };

  const handleOnchangeInputAnswersValue = (value, index) => {};

  // *************** UseEffect AREA
  // useEffect(() => {
  //   console.log(groupAnswer);
  // }, [groupAnswer]);

  useEffect(() => {
    handleFilterByQuestionIdAnswer();
  }, [editQuestionId]);

  return (
    <>
      {/* HeaderSubject start */}
      <QuestionDetailHeader />
      {/* HeaderSubject End */}

      {/* Top tollbar and title */}
      <div className="container">
        {/* BreadCum */}
        <Link to="/admin/questions" className="blockquote-footer mt-3 mb-5">
          Câu hỏi / Câu hỏi chi tiết
        </Link>
        {/* Header Title */}
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center ">
            <div>
              <img
                src="https://i.pinimg.com/originals/ec/04/8f/ec048fa1e083df7aeb49c06d7b75bcfc.jpg"
                alt=""
                className="rounded-circle overflow-hidden"
                width="70px"
                height="70px"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-muted">
                Môn học - {questionByCourseNameRoute.subjectName}
              </h3>
              <h1 className="text-dark mb-1">
                {questionByCourseNameRoute.courseName}
              </h1>
              <div className="d-flex align-items-center flex-wrap">
                <h6>{questionByCourseNameRoute.adminName}</h6>
                <span className="mx-1 font-weight-400 mt--1">
                  <i class="bx bx-minus"></i>
                </span>
                <h6>
                  {moment(questionByCourseNameRoute.createDate).format(
                    "DD-MM-yyyy, h:mm:ss a"
                  )}
                </h6>
              </div>
            </div>
          </div>
          <div>
            <Button
              color={isUpdate ? "primary" : "success"}
              onClick={() => setShowModal(true)}
              variant="contained"
              id="addSubjects"
              // disabled={isSubjectHistoryShowing}
            >
              <i className="bx bx-layer-plus"></i> Thêm câu hỏi
            </Button>
          </div>
        </div>
        {/* HR */}
        <hr className="text-muted" />
        {/* Tabs */}
        <div>
          <Tabs>
            {/* defaultValue="overview" */}
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
          {renderGroupsQuestion()}
        </Row>
      </main>

      {/* Modal */}
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
                  <label className="form-control-label" htmlFor="questionTitle">
                    Tiêu đề câu hỏi?
                  </label>
                  {/* <Input
                    className="form-control-alternative"
                    id="questionTitle"
                    onChange={handleChangeInput}
                    name="questionTitle"
                    value={question.questionTitle}
                  /> */}
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-books" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="câu hỏi?"
                      className="pl-2"
                      type="text"
                      id="questionTitle"
                      onChange={handleChangeInput}
                      name="questionTitle"
                      value={question.questionTitle}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12}>
                <hr />
                <h4 className="font-weight-600">Câu trả lời</h4>
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
    </>
  );
};

export default QuestionDetail;
