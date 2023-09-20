import { Box, FormGroup, IconButton } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import SubjectHeader from "components/Headers/SubjectHeader";
import MaterialReactTable from "material-react-table";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { IconEyeSearch, IconCheck } from "@tabler/icons-react";
import { Notification } from "@mantine/core";

// reactstrap components
import {
  Badge,
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

// Axios
import subjectApi from "../../api/subjectApi";
import subjectHistoryApi from "../../api/subjectHistoryApi";
import courseApi from "../../api/courseApi";

const Subjects = () => {
  // Main variable
  const [subjects, setSubjects] = useState([]);
  const [subjectHistories, setSubjectHistories] = useState([]);
  const [subjectArray, setSubjectArray] = useState([]);
  const [subjectHistoryPerSubject, setSubjectHistoryPerSubject] = useState([]);
  const [coursePerSubjectName, setCoursePerSubjectName] = useState([]);

  // Action variable
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [subjectHistoryShowing, setSubjectHistoryShowing] = useState(false);
  const [ModalHistory, setModalHistory] = useState(false);
  const [loadingPopupHistory, setLoadingPopupHistory] = useState(false);
  const [courseBySubject, setCourseBySubject] = useState(false);
  const [showNotification, setShowNotification] = useState({
    status: false,
    title: "",
    message: "",
    color: "",
  });
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectNameRecent, setSubjectNameRecent] = useState("");

  // Form variable
  const [errorInputSubject, setErrorInputSubject] = useState({
    status: false,
    message: "",
  });

  // Initial
  // const storedUser = JSON.parse(localStorage.getItem("user"));

  // *************** Subject AREA
  const [subject, setSubject] = useState({
    subjectId: "",
    adminId: "",
    subjectName: "",
    createDate: new Date(),
  });

  // Form action area
  const handleChangeInput = (e) => {
    setSubject((prevSubject) => ({
      ...prevSubject,
      [e.target.name]: e.target.value,
    }));
  };

  const reverseArray = (arr) => {
    return arr.reverse();
  };

  // API Area
  const fetchSubjects = async () => {
    try {
      setSubjectLoading(true);
      const resp = await subjectApi.getAllSubject();
      setSubjectArray(reverseArray(resp));
      setSubjects(reverseArray(resp));
      console.log(reverseArray(resp));
      console.log("restarted application");
      setSubjectLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubjectHistoryPerSubject = async (row) => {
    try {
      setLoadingPopupHistory(true);
      const resp = await subjectHistoryApi.getSubjectHistoryBySubjectId(
        row.subjectId
      );
      setSubjectHistoryPerSubject(reverseArray(resp));
      setLoadingPopupHistory(false);

      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourseBySubjectName = async (subjectName) => {
    try {
      console.log(subjectName.trim());
      setLoadingPopupHistory(true);
      const resp = await courseApi.getCourseBySubjectName(subjectName.trim());
      console.log(resp);
      setCoursePerSubjectName(resp);
      setLoadingPopupHistory(false);

    } catch (error) {
      console.log(error);
    }
  };

  // API_AREA > CRUD
  const handleCreateNewSubject = async () => {
    subject.adminId = "namnguyen";

    const lastSubject = subjects.slice(-1)[0];
    const lastSubjectId = lastSubject.subjectId;

    subject.subjectId = Number(lastSubjectId + 1);
    subjectArray.push(subject);

    setSubjectArray([...subjectArray]);
    console.log(subjectArray.slice(-1)[0]);

    subject.subjectId = "";
    const action = "add";
    if (validateForm()) {
      try {
        const body = subject;
        const resp = await subjectApi.createSubject(body);
        console.log(resp);
        notifycationAction(
          "Thêm mới môn học",
          "thêm mới môn học thành công!",
          "teal"
        );
        // Create SubjectHistory
        handleCreateNewSubjectHistory(subject, action);
      } catch (error) {
        console.log(error);
      }
      console.log("Add Success");
      fetchSubjects();
      setShowModal(false);
      resetForm();
    } else console.log("Error in validation");
  };

  const handleUpdateSubject = async () => {
    const newSubjects = [...subjects];

    const index = newSubjects.findIndex(
      (item) => item.subjectId === subject.subjectId
    );

    if (index !== -1) {
      newSubjects[index] = subject;
      setSubjectArray(newSubjects);
    }
    // **
    setSubject(newSubjects[index]);

    if (validateForm()) {
      try {
        subject.adminId = "namnguyen";
        const body = subject;
        const resp = await subjectApi.updateSubject(body, subject.subjectId);
        console.log(resp);
        notifycationAction(
          "Cập nhật môn học",
          "Cập nhật môn học thành công!",
          "indigo"
        );
        // Add subjectHistory
        // handleCreateNewSubjectHistory(subject, action);
      } catch (error) {
        console.log(error);
      }
    } else return "error in validate";

    //   console.log("Update success");
    setShowModal(false);
    setUpdate(false);

    fetchSubjects();
    resetForm();
  };

  const handleEditSubject = (row) => {
    setShowModal(true);
    setSubject({ ...row.original, adminId: row.original.adminName });
    setUpdate(true);
    setSubjectNameRecent(row.original.adminName);
  };

  const resetForm = () => {
    setSubject({
      subjectId: "",
      adminId: "namnguyen",
      subjectName: "",
      createDate: new Date(),
    });
  };

  const notifycationAction = (title, message, color) => {
    setShowNotification({
      status: true,
      title: title,
      message: message,
      color: color,
    });
  };

  // Validation area
  const validateForm = () => {
    if (subject.subjectName.length === 0) {
      setErrorInputSubject({
        status: true,
        message: "Vui lòng nhập vào tên môn học.",
      });
      return false;
    } else {
      setErrorInputSubject({
        status: false,
        message: "",
      });
    }

    if (subject.subjectName.trim() === subjectNameRecent.trim()) {
      return true;
    }

    if (isSubjectNameExists(subject.subjectName)) {
      setErrorInputSubject({
        status: true,
        message: "Tên môn học đã tồn tại.",
      });
      return false;
    } else {
      setErrorInputSubject({
        status: false,
        message: "",
      });
    }

    return true;
  };

  const isSubjectNameExists = (subjectName) => {
    const isExists = subjects.some(
      (subject) => subject.subjectName === subjectName
    );
    return isExists;
  };

  // React Data table area
  const columnSubject = useMemo(
    () => [
      {
        accessorKey: "subjectId",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 20,
      },
      {
        accessorKey: "adminName",
        header: "Tên người tạo",
        size: 80,
      },
      {
        accessorFn: (row) => displaySubjectName(row),
        header: "Tên Môn Học",
        size: 180,
      },
      // {
      //   accessorFn: (row) => displayTotalCourse(row.totalCoursePerSubject),
      //   header: "khóa học đã đăng ký",
      //   size: 40,
      // },
      {
        accessorFn: (row) =>
          moment(row.createDate).format("DD/MM/yyyy, h:mm:ss A"),
        header: "Ngày Tạo",
        size: 120,
      },
    ],
    []
  );

  const displaySubjectName = (row) => {
    return (
      <div
        onClick={() => {
          setCourseBySubject(true);
          setModalHistory(true);
          fetchCourseBySubjectName(row.subjectName);
        }}
        className="text-dark font-weight-600"
      >
        {row.subjectName}
      </div>
    );
  };

  const columnSubjectHistory = useMemo(
    () => [
      {
        accessorKey: "subjectName",
        header: "Tên Môn Học",
        size: 80,
      },
      {
        accessorFn: (row) =>
          moment(row.modifyDate).format("DD/MM/yyyy, h:mm:ss A"),
        header: "Ngày chỉnh sửa",
        size: 120,
      },
      {
        accessorKey: "adminName",
        header: "Tên người tạo",
        size: 80,
      },
      {
        accessorFn: (row) => displayActionHistory(row.action),
        Cell: ({ cell }) => {
          const row = cell.getValue();
          if (row === "Cập nhật") {
            return <Badge color="primary">Cập nhật</Badge>;
          } else {
            return <Badge color="success">Tạo mới </Badge>;
          }
        },
        header: "Hành động",
        size: 40,
      },
    ],
    []
  );

  const displayActionHistory = (action) => {
    return action === "CREATE" ? "Thêm mới" : "Cập nhật";
  };

  // *************** Header Button area
  const handleChangeSubjectListAndHistory = () => {
    setSubjectHistoryShowing(!subjectHistoryShowing);
  };

  // *************** Subject History AREA
  const [subjectHistory] = useState({
    subjectHistoryId: "",
    action: "",
    modifyDate: new Date(),
    adminId: "",
    subjectName: "",
    subjectId: "",
  });

  // API
  const fetchSubjectHistory = async () => {
    try {
      const resp = await subjectHistoryApi.getAllSubjectHistory();
      setSubjectHistories(reverseArray(resp));
      console.log("restarted subjectHistory application");
    } catch (error) {
      console.log(error);
    }
  };

  // API_AREA > CRUD
  const handleCreateNewSubjectHistory = async (subject, action) => {
    try {
      subjectHistory.subjectName = subject.subjectName;
      subjectHistory.subjectId = subject.subjectId;
      subjectHistory.action = action === "add" ? "CREATE" : "UPDATE";
      subjectHistory.adminId = subject.adminId;

      const body = subjectHistory;
      console.log(body);
      const resp = await subjectHistoryApi.createSubjectHistory(body);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
    fetchSubjectHistory();
  };

  // *************** Use effect area
  useEffect(() => {
    fetchSubjects();
    fetchSubjectHistory();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowNotification({
        status: false,
        title: "",
        message: "",
      });
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showNotification]);

  return (
    <>
      {/* HeaderSubject start */}
      <SubjectHeader />
      {/* HeaderSubject End */}

      {/* Page content */}
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          {/* Header */}
          <CardHeader className="bg-white border-0 d-flex justify-content-between">
            <h3 className="mb-0">
              {subjectHistoryShowing ? "Bảng lịch sử môn học" : "Bảng Môn học"}
            </h3>
            <Button
              color="default"
              type="button"
              onClick={() => handleChangeSubjectListAndHistory()}
            >
              {subjectHistoryShowing ? "Danh sách môn học" : "Lịch sử môn học"}
            </Button>
          </CardHeader>

          <CardBody>
            {/* Table view */}
            {/* Subject Table */}
            {!subjectHistoryShowing && (
              <MaterialReactTable
                muiTableBodyProps={{
                  sx: {
                    "& tr:nth-of-type(odd)": {
                      backgroundColor: "#f5f5f5",
                    },
                  },
                }}
                enableRowActions
                positionActionsColumn="last"
                enableRowNumbers
                state={{
                  isLoading: subjectLoading,
                }}
                displayColumnDefOptions={{
                  "mrt-row-actions": {
                    header: "Thao tác",
                    size: 40,
                  },
                  "mrt-row-numbers": {
                    size: 5,
                  },
                }}
                columns={columnSubject}
                data={subjectArray ?? []}
                // initialState={{
                //   columnVisibility: { subjectId: false },
                // }}
                initialState={{
                  columnVisibility: { subjectId: false },
                }}
                enableColumnOrdering
                enableStickyHeader
                enableStickyFooter
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10, 20, 50, 100],
                  showFirstButton: false,
                  showLastButton: false,
                }}
                renderRowActions={({ row }) => (
                  <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
                    <IconButton
                      color="secondary"
                      // outline
                      onClick={() => {
                        handleEditSubject(row);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setModalHistory(true);
                        fetchSubjectHistoryPerSubject(row.original);
                      }}
                    >
                      <IconEyeSearch />
                    </IconButton>
                  </Box>
                )}
                // Top Add new Subject button
                renderTopToolbarCustomActions={() => (
                  <Button
                    color="success"
                    onClick={() => setShowModal(true)}
                    variant="contained"
                    id="addSubjects"
                  >
                    <i className="bx bx-layer-plus mr-2"></i> Thêm môn học
                  </Button>
                )}
              />
            )}

            {/* History Table */}
            {subjectHistoryShowing && (
              <MaterialReactTable
                muiTableBodyProps={{
                  sx: {
                    "& tr:nth-of-type(odd)": {
                      backgroundColor: "#f5f5f5",
                    },
                  },
                }}
                enableRowNumbers
                displayColumnDefOptions={{
                  "mrt-row-numbers": {
                    size: 5,
                  },
                }}
                columns={columnSubjectHistory}
                data={subjectHistories}
                enableColumnOrdering
                enableStickyHeader
                enableStickyFooter
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10, 20, 50, 100],
                  showFirstButton: true,
                  showLastButton: true,
                }}
              />
            )}
          </CardBody>
        </Card>

        {/* Notifycation */}
        {showNotification.status && (
          <Notification
            icon={<IconCheck size="1.1rem" />}
            color={showNotification.color}
            title={showNotification.title}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: "2023",
              maxWidth: "400px",
            }}
          >
            {showNotification.message}
          </Notification>
        )}

        {/* Modal Add - Update Suject*/}
        <Modal
          className="modal-dialog-centered"
          isOpen={showModal}
          toggle={showModal}
          backdrop={"static"}
        >
          <div className="modal-header">
            <h3 className="modal-title" id="modal-title-default">
              {update ? "Cập nhật môn học" : "Thêm môn học mới"}
            </h3>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              <span
                aria-hidden={true}
                onClick={() => {
                  setUpdate(false);
                  resetForm();
                }}
              >
                ×
              </span>
            </button>
          </div>
          <div className="modal-body">
            <form method="post">
              {update && (
                <FormGroup className="mb-3">
                  <label className="form-control-label" htmlFor="id">
                    Mã môn học
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="id"
                    onChange={handleChangeInput}
                    disabled
                    name="subjectId"
                    value={subject.subjectId}
                  />
                </FormGroup>
              )}
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="adminId">
                  {update ? "Tên admin" : "Mã admin"}
                </label>
                <Input
                  className="form-control-alternative"
                  disabled
                  id="adminId"
                  onChange={handleChangeInput}
                  name="adminId"
                  value={subject.adminId}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="name">
                  Tên môn học
                </label>
                <Input
                  className={`${
                    errorInputSubject.status
                      ? "is-invalid"
                      : "form-control-alternative"
                  }`}
                  id="name"
                  onChange={handleChangeInput}
                  name="subjectName"
                  value={subject.subjectName}
                />
                <span className="text-danger">{errorInputSubject.message}</span>
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
                setUpdate(false);
                resetForm();
              }}
            >
              Trở lại
            </Button>
            <Button
              color={`${update ? "primary" : "success"}`}
              type="button"
              onClick={() => {
                update ? handleUpdateSubject() : handleCreateNewSubject();
                // toast("Cập nhật môn học thành công");
              }}
            >
              {update ? "Cập nhật" : "Thêm môn học"}
            </Button>
          </div>
        </Modal>

        {/* Modal show history per subject */}
        <Modal
          className="modal-dialog-centered"
          isOpen={ModalHistory}
          toggle={ModalHistory}
        >
          <div className="modal-header">
            <h3 className="modal-title" id="modal-title-default">
              {courseBySubject
                ? "Danh sách khóa học theo tên môn học"
                : "Lịch sử chỉnh sửa"}
            </h3>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setModalHistory(false)}
            >
              <span
                aria-hidden={true}
                onClick={() => {
                  setUpdate(false);
                  setCourseBySubject(false);
                }}
              >
                ×
              </span>
            </button>
          </div>
          <div className="modal-body">
            <Row className="container-xxl">
              {loadingPopupHistory ? (
                <h3 className="mx-auto">Vui lòng chờ trong giây lát...</h3>
              ) : (
                <>
                  {courseBySubject ? (
                    <>{
                      coursePerSubjectName.length === 0?(
                        <h3 className="mx-auto">
                          Môn học hiện không có khóa học nào.
                        </h3>
                      ):(<>
                        {
                          coursePerSubjectName.map(course=>(
                            <Col
                              key={course.courseId}
                              xl="12"
                              lg="12"
                              md="12"
                              sm="12"
                            > 
                                {course.courseId}
                            </Col>
                          ))
                        }
                      </>)
                      }
                    </>
                  ) : (
                    <>
                      {subjectHistoryPerSubject.length === 0 ? (
                        <h3 className="mx-auto">
                          Môn học hiện không có lịch sử chỉnh sửa nào.
                        </h3>
                      ) : (
                        <>
                          {subjectHistoryPerSubject.map((sb) => (
                            <Col
                              key={sb.subjectHistoryId}
                              xl="12"
                              lg="12"
                              md="12"
                              sm="12"
                            >
                              <h4>ID: {sb.subjectHistoryId}</h4>
                              <div>
                                <span className="text-muted">
                                  Ngày chỉnh sửa:
                                </span>
                                <strong className="ml-2">
                                  {moment(sb.modifyDate).format(
                                    "DD-MM-yyyy, h:mm:ss a"
                                  )}
                                </strong>
                                .
                              </div>
                              <Row>
                                <Col xl="12" lg="12" md="12" sm="12">
                                  <span className="text-muted">
                                    Tên môn học:
                                  </span>
                                  <strong className="ml-2">
                                    {sb.subjectName}
                                  </strong>
                                </Col>
                                <Col xl="12" lg="12" md="12" sm="12">
                                  <span className="text-muted">
                                    Mã môn học:
                                  </span>
                                  <strong className="ml-2">
                                    {sb.subjectId}
                                  </strong>
                                </Col>
                                <Col xl="12" lg="12" md="12" sm="12">
                                  <span className="text-muted">Hành động:</span>
                                  <strong className="ml-2">
                                    {sb.action === "CREATE"
                                      ? "thêm mới"
                                      : "cập nhật"}
                                  </strong>
                                </Col>
                                <Col xl="12" lg="12" md="12" sm="12">
                                  <span className="text-muted">
                                    Mã người tạo:
                                  </span>
                                  <strong className="ml-2">{sb.adminId}</strong>
                                </Col>
                              </Row>
                              <hr style={{ color: "#c6c6c6" }} />
                            </Col>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Row>
          </div>
          <div className="modal-footer">
            <Button
              color="default"
              data-dismiss="modal"
              type="button"
              onClick={() => {
                setModalHistory(false);
                setCourseBySubject(false);
              }}
            >
              Trở lại
            </Button>
          </div>
        </Modal>
      </Container>
      {/* Page content end */}
    </>
  );
};

export default Subjects;
