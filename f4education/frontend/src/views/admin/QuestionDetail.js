import { Badge, Tabs } from "@mantine/core";
import QuestionDetailHeader from "components/Headers/QuestionDetailHeader";
import moment from "moment";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardBody, Col, Row } from "reactstrap";

const dataFake = [
  {
    questionId: "1",
    subjectName: "Angular",
    courseName: "Angular cơ bản cho người mới",
    questionTitle: "Làm thế nào để tích hợp route vào dự án angular",
    level: "dễ",
    adminName: "adminName",
  },
  {
    questionId: "2",
    subjectName: "ReactJs",
    courseName: "React & React Hook ",
    questionTitle: "Làm thế nào để devploy project lên mạng",
    level: "vừa",
    adminName: "adminName2",
  },
];

const QuestionDetail = () => {
  // Main variable

  // Action variable
  const [editAnswer, setEditAnswer] = useState(false);

  const { id } = useParams();

  const question = dataFake.find((pj) => pj.questionId.toString() === id);

  const setEditAbleInput = (prev) => {
    setEditAnswer(!prev);
  };

  return (
    <>
      {/* HeaderSubject start */}
      <QuestionDetailHeader />
      {/* HeaderSubject End */}

      <div className="container">
        <h1 className="mb-3">Môn học: {question.subjectName}</h1>
        <div className="d-flex align-items-center">
          <div>
            <img
              src="https://i.pinimg.com/originals/ec/04/8f/ec048fa1e083df7aeb49c06d7b75bcfc.jpg"
              alt=""
              className="rounded-circle overflow-hidden"
              width={"50px"}
              height={"50px"}
            />
          </div>
          <div className="ml-3">
            <h2 className="text-primary mb-0">{question.courseName}</h2>
            <div className="d-flex align-items-center">
              <h6>{question.adminName}</h6>
              <span className="mx-3 font-weight-400 mt--1">
                <i className="bx bx-x text-gray"></i>
              </span>
              <h6>Độ khó: {question.level}</h6>
              <span className="mx-3 font-weight-400 mt--1">
                <i className="bx bx-x text-gray"></i>
              </span>
              <h6>{moment(new Date()).format("DD-MM-yyyy, h:mm:ss a")}</h6>
            </div>
          </div>
        </div>
        <hr className="text-muted" />
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

      {/* Main content */}
      <main className="container">
        <Row>
          {/* Item */}
          <Col lg={6} xl={6} md={12} sm={12}>
            <Card style={{ minWidth: "400px" }}>
              <CardBody>
                <h4 className="bg-secondary p-2">
                  <span className="text-dark font-weight-600">
                    Question 1: {question.questionTitle}
                  </span>
                </h4>
                <Row>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i className="bx bx-check-circle text-success"></i>
                      </div>
                      {editAnswer ? (
                        <span
                          className="text-dark bg- p-1 bg-info ml--2"
                          contenteditable="true"
                          style={{
                            transform: "tranlate(-50%,-50%)",
                          }}
                        >
                          This is answer 1 edit able
                        </span>
                      ) : (
                        <span
                          className="text-dark ml--2"
                          // contenteditable="true"
                          // style={{ background }}
                        >
                          This is answer 1
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i className="bx bx-check-circle text-success"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i class="bx bx-x-circle text-danger"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i class="bx bx-x-circle text-danger"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <Button
                      color="primary"
                      outline
                      role="button"
                      className="float-right"
                      onClick={() => setEditAbleInput(editAnswer)}
                    >
                      <i class="bx bx-edit"></i>
                    </Button>
                    <Button color="danger" className="float-right mr-2">
                      <i class="bx bx-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          {/* Item */}
          <Col lg={6} xl={6} md={12} sm={12}>
            <Card style={{ minWidth: "400px" }}>
              <CardBody>
                <h4 className="bg-secondary p-2">
                  <span className="text-dark font-weight-600">
                    Question 1: {question.questionTitle}
                  </span>
                </h4>
                <Row>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i className="bx bx-check-circle text-success"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i className="bx bx-check-circle text-success"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i className="bx bx-check-circle text-success"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <div className="d-flex gap-3">
                      <div style={{ width: "40px", height: "40px" }}>
                        <i className="bx bx-check-circle text-success"></i>
                      </div>
                      <span className="text-dark ml--2">This is answer 1</span>
                    </div>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={12}>
                    <Button
                      color="primary"
                      outline
                      role="button"
                      className="float-right"
                    >
                      <i class="bx bx-edit"></i>
                    </Button>
                    <Button color="danger" className="float-right mr-2">
                      <i class="bx bx-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </main>
    </>
  );
};

export default QuestionDetail;
