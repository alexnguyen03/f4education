import {
  Badge,
  Blockquote,
  Checkbox,
  Group,
  Select,
  Tabs,
  Textarea,
  Tooltip,
} from "@mantine/core";
import QuestionDetailHeader from "components/Headers/QuestionDetailHeader";
import moment from "moment";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const userDetail = localStorage.getItem("user");

  // ************* Main variable
  const [questions, setQuestions] = useState(QuestionVSAnswerData);
  const [answers, setAnswers] = useState(AnswerData);
  const [questionRequest, setQuestionRequest] = useState({
    questionId: "",
    questionTitle: "",
    subjectName: "",
    courseName: "",
    adminId: "namnguyen",
    createDate: "",
    answer: {
      answerId: "",
      text: "",
      isCorrect: "",
    },
  });
  const [answerRequest, setAnswerRequest] = useState([
    {
      answerId: "",
      text: "",
      isCorrect: false,
    },
  ]);

  // const questionByCourNameFilter = answers.filter(
  //   (answer) =>
  //     answer.question.courseName === questionByCourseNameRoute.courseName
  // );

  // const [questionsByCourseName, setQuestionsByCourseName] = useState(
  //   questionByCourNameFilter
  // );

  // ************* Action variable
  const [editAnswer, setEditAnswer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  // ************* Form variable
  // const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answer, setAnswer] = useState({
    id: "",
    answerText: "",
    questionId: "",
  });

  const [question, setQuestion] = useState({
    questionId: "",
    subjectName: "",
    courseName: "",
    createDate: "",
    questionTitle: "",
    adminId: "namnguyen",
    answers: [],
  });

  // ************* API AREA

  // + API > CRUD
  // Lúc thêm question thì sẽ thêm luôn cái answers json sẽ giống với cái QuestionVsAnswerData;
  // Lúc cập nhật cũng giống như lúc thêm

  // *************** Validation area

  // *************** Form action area
  const handleStoreQuestions = async () => {
    try {
      question.subjectName = questionByCourseNameRoute.subjectName;
      question.courseName = questionByCourseNameRoute.courseName;
      question.createDate = new Date();

      question.answers = handleDataTranferAnswers();
      console.log(question);

      // const body = question;
      // const resp = await questionApi.createQuestion(body);
      // console.log(resp.status);
    } catch (error) {
      console.log(error);
    }

    setShowModal(false);
  };

  // + Function update when click update
  const handleUpdateQuestion = () => {
    // Set change action render UI
    setEditQuestionId(null);
    setEditAnswer(false);
    // setIsEditing(false);

    questionRequest[0].answer = answerRequest;
    console.log("UPDATE REQUEST DATA");
    console.log(questionRequest[0]);

    // question.questionId = questionRequest.questionId;
    // question.questionTitle = questionRequest.questionTitle;
    // question.subjectName = questionRequest.subjectName;
    // question.courseName = questionRequest.courseName;
    // question.adminId = questionRequest.adminId;
    // question.createDate = questionRequest.createDate;
    // question.answers = answerRequest;

    // questionRequest[0].answer = answerRequest;
    // const lastAnswerIndex = (questionRequest[0].answer = answerRequest);
    // console.log(lastAnswerIndex[lastAnswerIndex.length - 1].answerId);
    // lastAnswerIndex[lastAnswerIndex.length - 1].answerId = "";\

    // console.log(question);
    // Handle Change Data
  };

  // + Tranfer and fill data to ANSWERS STATE
  const handleDataTranferAnswers = () => {
    const newAnswers = groups.map((group) => ({
      isCorrect: group.radioValue,
      text: group.inputValue,
    }));
    return newAnswers;
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
                <Checkbox
                  color="cyan"
                  className="mt-2"
                  onChange={() => handleRadioChange(index)}
                  style={{ width: "20px", height: "20px" }}
                  checked={group.radioValue}
                />
              </label>
            </div>
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

  // *************** Render question and answer AREA
  // + render UI answers inside question card
  const renderAnswers = (question) => {
    return answers.map((answerDetail) => (
      <>
        {answerDetail.questionId === question.questionId ? (
          <Col lg={12} xl={12} md={12} sm={12} key={answerDetail.answerId}>
            <div className="d-flex">
              {/* Radio button */}
              {editAnswer && question.questionId === editQuestionId ? (
                <div className="d-flex align-items-center mb-2 mr-4">
                  <label>
                    <input
                      type="radio"
                      name={`radio_${answerDetail.questionId}`}
                      checked={answerDetail.isCorrect}
                      onChange={() =>
                        handleOnChangeRadioAnswerValue(answerDetail.answerId)
                      }
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

              {/* Answer Input */}
              {editAnswer && question.questionId === editQuestionId ? (
                <input
                  className="answer-input w-100 text-dark ml--2 pl-2 mb-1"
                  onChange={(e) => {
                    handleOnchangeInputAnswersValue(
                      e.target.value,
                      answerDetail.answerId
                    );
                  }}
                  name="text"
                  value={answerDetail.text}
                />
              ) : (
                <p
                  className="text-dark 
                      d-flex align-items-center flex-wrap"
                >
                  {answerDetail.text}
                </p>
              )}
            </div>
          </Col>
        ) : (
          <></>
        )}
      </>
    ));
  };

  // + render UI questions
  const renderGroupsQuestion = () => {
    return questions.map((questionDetail, index) => (
      <>
        <Col lg={6} xl={6} md={12} sm={12} key={index} className="mb-3">
          <Card style={{ minWidth: "380px", minHeight: "365px" }}>
            <CardBody>
              {/* Title Question */}
              <h4
                className="p-2 d-flex align-items-center"
                style={{
                  background: "#f1f1f1",
                  borderRadius: "5px",
                  minHeight: "80px",
                  overflow: "auto",
                }}
              >
                {/* Display question title */}
                {editAnswer && questionDetail.questionId === editQuestionId ? (
                  <Textarea
                    label={`Câu hỏi: ${index + 1}`}
                    className="w-100"
                    autosize
                    minRows={2}
                    onChange={(e) =>
                      handleOnchangeInputQuestionTitle(
                        e.target.value,
                        questionDetail.questionId
                      )
                    }
                    value={questionDetail.questionTitle}
                  />
                ) : (
                  /* <Input
                      className="pl-2"
                      type="text"
                      onChange={(e) =>
                        handleOnchangeInputQuestionTitle(
                          e.target.value,
                          questionDetail.questionId
                        )
                      }
                      value={questionDetail.questionTitle}
                    /> */
                  <span className="text-dark font-weight-600">
                    <strong>Question {index + 1}: </strong>
                    <span className="text-muted">
                      {questionDetail.questionTitle}
                    </span>
                  </span>
                )}
              </h4>
              {/* Answer Display Area */}
              <div
                className="mt-3"
                style={{ height: "220px", overflowY: "auto" }}
              >
                <Row className="w-100">
                  {/* if answer.questionId === qs.questionId */}
                  {handleRenderAnswerByQuestionId(questionDetail)}
                </Row>
              </div>
            </CardBody>
            {/* Action Area */}
            <CardFooter>
              {/* Update button */}
              {editAnswer && questionDetail.questionId === editQuestionId ? (
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
              <Tooltip
                label="Thêm ? Chưa làm được bạn ơi, này hơi khó!"
                color="teal"
                withArrow
                arrowPosition="center"
              >
                <IconButton
                  color="success"
                  className="float-right"
                  onClick={() => {
                    handleAddNewAnswerForEachQuestion(questionDetail);
                    // handleEditQuestionByQuestionId(questionDetail);
                  }}
                >
                  <i className="bx bx-plus-circle"></i>
                </IconButton>
              </Tooltip>

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
                    handleEditQuestionByQuestionId(questionDetail);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              {/* Delete button */}

              {editAnswer && questionDetail.questionId === editQuestionId ? (
                <Tooltip
                  label="Xóa câu hỏi ?"
                  color="red"
                  withArrow
                  arrowPosition="center"
                >
                  <IconButton className="float-right text-gray" disabled>
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
                      onClick={() => alert("deleted")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </CardFooter>
          </Card>
        </Col>
      </>
    ));
  };

  // *************** ACTION QUESTION AND ANSWERS AREA
  // edit question when click
  const handleEditQuestionByQuestionId = (qs) => {
    handleEditQuestion(qs);
    handleFilterByQuestionIdAnswer();
  };

  // + function set Edit when click edit button
  const handleEditQuestion = (qs) => {
    // set action render UI
    answer.id = qs.answerId;
    answer.questionId = qs.questionId;

    handlesetEditAbleInput(editAnswer);
    setEditQuestionId(qs.questionId);
    // setIsEditngFunction(isEditing);
  };

  // +  Change span to input and get value
  const handlesetEditAbleInput = (prev) => {
    setEditAnswer(!prev);
  };

  // ++++++++++++++ ANSWER AREA ++++++++++++++++
  // Create a Group Answer base on answers State
  // const [groupAnswers, setGroupAnswers] = useState(
  //   answers.map((answer) => ({
  //     answerId: answer.answerId,
  //     text: answer.text,
  //     isCorrect: answer.isCorrect,
  //     questionId: answer.questionId,
  //   }))
  // );

  // Filter Answer variable
  const [filterGroupAnswerByQuestionId, setFilterGroupAnswerByQuestionId] =
    useState([]);

  // Filter Answer base on Question ID for display UI
  const handleFilterByQuestionIdAnswer = () => {
    setFilterGroupAnswerByQuestionId(
      groupsAnswerRender.filter(
        (answer) => answer.questionId === editQuestionId
      )
    );
  };

  // get value onchange Answer Input for update
  const handleOnchangeInputAnswersValue = (value, answerIdValue) => {
    const updatedGroupAnswer = groupsAnswerRender.map((answer) => {
      if (answer.answerId === answerIdValue) {
        const newAnswer = {
          ...answer,
          text: value,
        };

        return newAnswer;
      }
      return answer;
    });

    // *Notes: why using groupanswers instead use answersi
    // use group answer have advantage which can be restore when use click edit second time;
    // Set Answer For render UI
    // setGroupAnswers(updatedGroupAnswer);
    setAnswers(updatedGroupAnswer);
    setGroupAnswerRender(updatedGroupAnswer);

    // Set Answer for Update Request
    setAnswerRequest(
      updatedGroupAnswer.filter(
        (answer) => answer.questionId === editQuestionId
      )
    );
  };

  // get value onchange Answer radio for update
  const handleOnChangeRadioAnswerValue = (answerIdValue) => {
    const updatedGroupAnswer = groupsAnswerRender.map((answer) => {
      if (answer.answerId === answerIdValue) {
        const newAnswer = {
          ...answer,
          isCorrect: true,
        };

        return newAnswer;
      } else if (answer.questionId === editQuestionId) {
        return {
          ...answer,
          isCorrect: false,
        };
      }
      return answer;
    });

    // Set Answer For render UI
    // setGroupAnswers(updatedGroupAnswer);
    setAnswers(updatedGroupAnswer);
    setGroupAnswerRender(updatedGroupAnswer);

    // Set Answer for Update Request
    setAnswerRequest(
      updatedGroupAnswer.filter(
        (answer) => answer.questionId === editQuestionId
      )
    );
  };

  // ++++++++++++++ QUESTION AREA ++++++++++++++++
  // Create a Group Questions base on questions State
  const [groupQuestions, setGroupQuestions] = useState(
    questions.map((question) => ({
      questionId: question.questionId,
      questionTitle: question.questionTitle,
      subjectName: question.subjectName,
      courseName: question.courseName,
      adminId: question.adminName,
      createDate: question.createDate,
      answer: question.answer,
    }))
  );

  // Handle onchange quetsion title
  const handleOnchangeInputQuestionTitle = (value, questionIdValue) => {
    const updatedGroupQuestions = groupQuestions.map((question) => {
      if (question.questionId === questionIdValue) {
        const newQuestion = {
          ...question,
          questionTitle: value,
        };
        return newQuestion;
      }
      return question;
    });

    // *Notes: why using groupQuestins instead use questions
    // use group question has advantage which can be restore when use click edit second time;
    setGroupQuestions(updatedGroupQuestions);
    setQuestions(updatedGroupQuestions);

    // Set Question for Update Request
    // setQuestionRequest(
    //   updatedGroupQuestions.filter(
    //     (question) => question.questionId === editQuestionId
    //   )
    // );

    setQuestionRequest(
      updatedGroupQuestions.filter(
        (question) => question.questionId === editQuestionId
      )
    );
  };

  // Render new ANSWER
  const [groupsAnswerRender, setGroupAnswerRender] = useState(
    answers
      // .filter((answer) => answer.questionId === editQuestionId)
      .map((answer) => {
        return {
          answerId: answer.answerId,
          text: answer.text,
          isCorrect: answer.isCorrect,
          questionId: answer.questionId,
        };
      })
  );

  const handleRenderAnswerByQuestionId = (question) => {
    return groupsAnswerRender.map((answerDetail) => (
      <>
        {answerDetail.questionId === question.questionId ? (
          <Col lg={12} xl={12} md={12} sm={12} key={answerDetail.answerId}>
            <div className="d-flex">
              {/* Radio button */}
              {editAnswer && question.questionId === editQuestionId ? (
                <div className="d-flex align-items-center mb-2 mr-4">
                  <label>
                    {/* <input
                      type="radio"
                      name={`radio_${answerDetail.questionId}`}
                      checked={answerDetail.isCorrect}
                      onChange={() =>
                        handleOnChangeRadioAnswerValue(answerDetail.answerId)
                      }
                    /> */}
                    <Checkbox
                      color="cyan"
                      name={`radio_${answerDetail.questionId}`}
                      checked={answerDetail.isCorrect}
                      onChange={() =>
                        handleOnChangeRadioAnswerValue(answerDetail.answerId)
                      }
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

              {/* Answer Input */}
              {editAnswer && question.questionId === editQuestionId ? (
                // <input
                //   className="answer-input w-100 text-dark ml--2 pl-2 mb-1"
                //   onChange={(e) => {
                //     handleOnchangeInputAnswersValue(
                //       e.target.value,
                //       answerDetail.answerId
                //     );
                //   }}
                //   name="text"
                //   value={answerDetail.text}
                // />
                <Textarea
                  autosize
                  minRows={2}
                  onChange={(e) => {
                    handleOnchangeInputAnswersValue(
                      e.target.value,
                      answerDetail.answerId
                    );
                  }}
                  className="w-100 mb-2"
                  name="text"
                  value={answerDetail.text}
                />
              ) : (
                <p
                  className="text-dark
                      d-flex align-items-center flex-wrap"
                >
                  {answerDetail.text}
                </p>
              )}
            </div>
          </Col>
        ) : (
          <></>
        )}
      </>
    ));
  };

  const handleAddNewAnswer = (question) => {
    const newAnswerId =
      Math.max(...groupsAnswerRender.map((answer) => answer.answerId)) + 1;

    if (question.questionId === editQuestionId) {
      const newGroup = {
        answerId: newAnswerId,
        text: "new answer",
        isCorrect: false,
        questionId: question.questionId,
      };

      setGroupAnswerRender([...groupsAnswerRender, newGroup]);
      console.log(groupsAnswerRender);
    }
  };

  const handleAddNewAnswerForEachQuestion = (questionDetail) => {
    setEditQuestionId(questionDetail.questionId);
    handleAddNewAnswer(questionDetail);
  };

  // *************** UseEffect AREA
  useEffect(() => {
    handleFilterByQuestionIdAnswer();
  }, [editQuestionId]);

  useEffect(() => {
    setAnswer(groupsAnswerRender);
  }, [groupsAnswerRender]);

  return (
    <>
      {/* HeaderSubject start */}
      <QuestionDetailHeader />
      {/* HeaderSubject End */}

      {/* Top tollbar and title */}
      <div className="container-fluid">
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
                className="course-image rounded-circle overflow-hidden"
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
                  <i className="bx bx-minus"></i>
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
      <main className="container-fluid">
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
              <Col xl={6} lg={6} md={6} sm={12}>
                <FormGroup className="mb-3 col-12">
                  <label className="form-control-label" htmlFor="name">
                    Môn học
                  </label>
                  <Select
                    className="w-100"
                    disabled
                    value={questionByCourseNameRoute.subjectName}
                    data={[`${questionByCourseNameRoute.subjectName}`]}
                  />
                </FormGroup>
              </Col>
              <Col xl={6} lg={6} md={6} sm={12}>
                <FormGroup className="mb-3 col-12">
                  <label className="form-control-label" htmlFor="name">
                    Khóa học
                  </label>
                  <Select
                    disabled
                    value={questionByCourseNameRoute.courseName}
                    data={[`${questionByCourseNameRoute.courseName}`]}
                  />
                </FormGroup>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12}>
                {/* <FormGroup className="mb-3 col-12">
                  <label className="form-control-label" htmlFor="questionTitle">
                    Tiêu đề câu hỏi?
                  </label>
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
                      onChange={handleChangeInput}
                      name="questionTitle"
                      value={question.questionTitle}
                    />
                  </InputGroup>
                </FormGroup> */}
                <Textarea
                  placeholder="Câu hỏi?"
                  label="Tiêu đề câu hỏi"
                  className="w-100"
                  withAsterisk
                  onChange={handleChangeInput}
                  name="questionTitle"
                  value={question.questionTitle}
                />
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
                  <Row>{renderInputs()}</Row>
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
            color="success"
            type="button"
            onClick={() => {
              handleStoreQuestions();
            }}
          >
            Thêm môn học
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default QuestionDetail;
