import {
  Edit as EditIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  Search,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import teacherApi from "api/teacherApi";
import accountApi from "api/accountApi";
import moment from "moment";
import AccountHeader from "components/Headers/AccountHeader";
import { MaterialReactTable } from "material-react-table";
import { memo, useEffect, useMemo, useState } from "react";
import { Notifications } from "@mantine/notifications";
import { IconEyeSearch } from "@tabler/icons-react";
import { Typography } from "@material-ui/core";
import ReactLoading from "react-loading";
import { Timeline, Event } from "react-timeline-scribble";
import { Warning } from "@material-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  CardImg,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  ButtonGroup,
} from "reactstrap";
import Select from "react-select";
const IMG_URL = "/courses/";
const Teachers = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  const [imgData, setImgData] = useState(null);
  const [loadingHistoryInfo, setLoadingHistoryInfo] = useState(true);
  const [showHistoryInfo, setShowHistoryInfo] = useState(false);
  const [showForm_1, setShowForm_1] = useState(false);
  const [showForm_2, setShowForm_2] = useState(false);
  const [showForm_3, setShowForm_3] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingTeachersHistory, setLoadingTeachersHistory] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [rSelected, setRSelected] = useState(null); //radio button
  const [image, setImage] = useState(null);
  const [update, setUpdate] = useState(false);
  const [teacherHistories, setTeacherHistories] = useState([]);
  const [showHistoryTable, setShowHistoryTable] = useState(false);
  const [listHistoryById, setListHistoryById] = useState([]);
  const [errors, setErrors] = useState({});

  //Nhận data gửi lên từ server
  const [teacher, setTeacher] = useState({
    id: 0,
    username: "",
    password: "",
    email: "",
    roles: 0,
    status: false,
    teacher: {
      teacherId: 0,
      fullname: "",
      gender: true,
      dateOfBirth: "",
      citizenIdentification: "",
      levels: "",
      address: "",
      phone: "",
      image: "",
    },
  });

  const [admin, setAdmin] = useState({
    id: 0,
    username: "",
    password: "",
    email: "",
    roles: 3,
    admin: {
      adminId: "",
      fullname: "",
      gender: true,
      dateOfBirth: "",
      citizenIdentification: "",
      levels: "",
      address: "",
      phone: "",
      image: "",
    },
  });

  const [student, setStudent] = useState({
    id: 0,
    username: "",
    password: "",
    email: "",
    roles: 0,
    student: {
      studentId: 0,
      fullname: "",
      gender: true,
      address: "",
      phone: "",
      image: "img.png",
    },
  });

  // Dùng để gửi request về sever
  const [teacherRequest, setTeacherRequest] = useState({
    id: 0,
    username: "",
    password: "",
    email: "",
    roles: 0,
    teacher: {
      teacherId: 0,
      fullname: "",
      gender: true,
      dateOfBirth: "",
      citizenIdentification: "",
      levels: "",
      address: "",
      phone: "",
      image: "",
    },
    // acccountAdmin: 0,
  });

  const handelOnChangeInput_2 = (e) => {
    const { name, value } = e.target;
    setTeacher((prevTeacher) => ({
      ...prevTeacher,
      teacher: {
        ...prevTeacher.teacher,
        [name]: value,
      },
      numberSession: 0,
    }));
  };

  const handelOnChangeInput = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
      numberSession: 0,
    });
  };

  // Cập nhật hình ảnh
  const onChangePicture = (e) => {
    setImage(null);
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
      setTeacher((preTeacher) => ({
        ...preTeacher,
        image: e.target.files[0].name,
      }));
    }
  };

  const columns_student = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Tên tài khoản",
        size: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 75,
      },
      {
        accessorKey: "student.fullname",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          try {
            return <span>{row.student.fullname}</span>;
          } catch (error) {
            <span className="text-danger">Chưa có thông tin học viên</span>;
          }
        },
        header: "Tên người dùng",
        size: 70,
      },
    ],
    []
  );

  const columns_teacher = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Tên tài khoản",
        size: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 75,
      },
      {
        accessorKey: "teacher.fullname",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          try {
            return <span>{row.teacher.fullname}</span>;
          } catch (error) {
            return (
              <span className="text-danger">Chưa có thông tin giảng viên</span>
            );
          }
        },
        header: "Tên người dùng",
        size: 70,
      },
    ],
    []
  );

  const columns_admin = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Tên tài khoản",
        size: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 75,
      },
      {
        accessorKey: "teacher.fullname",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          try {
            return <span>{row.admins.fullname}</span>;
          } catch (error) {
            <span className="text-danger">
              Chưa có thông tin quản trị viên
            </span>;
          }
        },
        header: "Tên người dùng",
        size: 70,
      },
    ],
    []
  );

  const columnsTeacherHistory = useMemo(
    () => [
      {
        accessorKey: "fullname",
        header: "Tên giảng viên",
        size: 100,
      },
      {
        accessorKey: "gender",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          if (row.gender) {
            return <span>Nam</span>;
          } else {
            return <span>Nữ</span>;
          }
        },
        header: "Giới tính",
        size: 30,
      },
      {
        accessorFn: (row) => moment(row.dateOfBirth).format("DD/MM/yyyy"),
        header: "Ngày sinh",
        size: 60,
      },
      {
        accessorFn: (row) =>
          moment(row.modifyDate).format("DD/MM/yyyy, h:mm:ss a"),
        header: "Ngày thao tác",
        size: 60,
      },
      {
        accessorKey: "adminName",
        header: "Người thao tác",
        size: 80,
      },
      {
        accessorKey: "action",
        header: "Hành động",
        size: 80,
      },
    ],
    []
  );

  const handleEditFrom_2 = (row) => {
    setShowForm_2(true);
    setUpdate(true);
    const selectedTeacher = teachers.find(
      (teacher) => teacher.id === row.original.id
    );
    setImage(
      process.env.REACT_APP_IMAGE_URL + IMG_URL + selectedTeacher.teacher.image
    );

    setTeacher({ ...selectedTeacher });
    setRSelected(selectedTeacher.teacher.gender);
  };

  const handleResetForm_2 = async () => {
    // hide form
    setShowForm_2((pre) => !pre);
    setUpdate(false);
    setImgData(null);
    setTeacher({
      id: 0,
      username: "",
      password: "",
      email: "",
      roles: 0,
      teacher: {
        teacherId: 0,
        fullname: "",
        gender: true,
        dateOfBirth: "",
        citizenIdentification: "",
        levels: "",
        address: "",
        phone: "",
        image: "",
      },
    });
    setErrors({});
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (update) {
      updateTeacher();
    } else {
      createTeacher();
    }
    // if (image) {
    //   setTeacher((preTeacher) => ({
    //     ...preTeacher,
    //     teacher: {
    //       ...preTeacher.teacher,
    //       image: image.name,
    //     },
    //   }));
    // }
  };

  const validateForm = () => {
    let validationErrors = {};
    let test = 0;
    if (!teacher.fullname) {
      validationErrors.fullname = "Vui lòng nhập tên !!!";
      test++;
    } else {
      validationErrors.fullname = "";
    }

    if (!teacher.citizenIdentification) {
      validationErrors.citizenIdentification = "Vui lòng nhập CCCD!!!";
      test++;
    } else {
      if (teacher.citizenIdentification.length != 12) {
        validationErrors.citizenIdentification = "Số CCCD gồm 12 số!!!";
        test++;
      } else {
        validationErrors.citizenIdentification = "";
      }
    }

    if (!teacher.address) {
      validationErrors.address = "Vui lòng nhập địa chỉ!!!";
      test++;
    } else {
      validationErrors.address = "";
    }

    if (!teacher.levels) {
      validationErrors.levels = "Vui lòng nhập trình độ học vấn!!!";
      test++;
    } else {
      validationErrors.levels = "";
    }

    const isVNPhoneMobile =
      /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;

    if (!isVNPhoneMobile.test(teacher.phone)) {
      validationErrors.phone = "Không đúng định dạng số điện thoại!!!";
      test++;
    } else {
      validationErrors.phone = "";
    }

    if (test === 0) {
      return {};
    }
    return validationErrors;
  };

  const updateTeacher = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0 || true) {
      const formData = new FormData();
      formData.append("teacherRequest", JSON.stringify(teacherRequest));
      formData.append("file", image);
      // console.log("🚀 ~ file: Teachers.js:300 ~ updateTeacher ~ image:", image);
      try {
        const resp = await accountApi.updateAccount(formData);
        handleResetForm_2();
        getAllTeacher();
      } catch (error) {
        console.log("updateTeacher", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const createTeacher = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0 || true) {
      const formData = new FormData();
      formData.append("teacherRequest", JSON.stringify(teacherRequest));
      formData.append("file", image);
      // console.log("🚀 ~ file: Teachers.js:300 ~ updateTeacher ~ image:", image);
      try {
        const resp = await accountApi.addAccount(formData);
        handleResetForm_2();
        getAllTeacher();
      } catch (error) {
        console.log("updateTeacher", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  //gọi API lấy data
  const getAllTeacher = async () => {
    console.log("getAllTeacher ~ teachers:", teachers);

    // if (teachers.length > 0) {
    //   setLoadingTeachers(false);
    //   return;
    // }

    try {
      setLoadingTeachers(true);
      const resp = await accountApi.getAllAccountsByRole(2);
      console.log(resp);
      setTeachers(resp.reverse());
      setLoadingTeachers(false);
    } catch (error) {
      console.log("failed to load data", error);
    }
  };

  const getAllStudent = async () => {
    // if (students.length > 0) {
    //   setLoadingStudents(false);
    //   return;
    // }

    try {
      setLoadingStudents(true);
      const resp = await accountApi.getAllAccountsByRole(1);
      console.log(resp);
      setStudents(resp.reverse());
      setLoadingStudents(false);
    } catch (error) {
      console.log("failed to load data", error);
    }
  };

  const getAllAdmin = async () => {
    // if (admins.length > 0) {
    //   setLoadingAdmins(false);
    //   return;
    // }

    try {
      setLoadingAdmins(true);
      const resp = await accountApi.getAllAccountsByRole(3);
      console.log(resp);
      setAdmins(resp.reverse());
      setLoadingAdmins(false);
    } catch (error) {
      console.log("failed to load data", error);
    }
  };

  const setGender_2 = (gender) => {
    setTeacher((preTeacher) => ({
      ...preTeacher,
      teacher: {
        ...preTeacher.teacher,
        gender: gender,
      },
    }));
  };

  useEffect(() => {
    const {
      id,
      username,
      password,
      email,
      status,
      teacher: {
        teacherId,
        fullname,
        gender,
        dateOfBirth,
        citizenIdentification,
        levels,
        address,
        phone,
        image,
      },
    } = { ...teacher };
    setTeacherRequest({
      // acccountAdmin: user.id,
      id: id,
      username: username,
      password: password,
      email: email,
      status: status,
      roles: 2,
      teacher: {
        teacherId: teacherId,
        fullname: fullname,
        gender: gender,
        dateOfBirth: dateOfBirth,
        citizenIdentification: citizenIdentification,
        levels: levels,
        address: address,
        phone: phone,
        image: image,
      },
    });
  }, [teacher]);

  //load data lên table
  useEffect(() => {
    // if (teachers.length > 0) return;
    getAllStudent();
    getAllTeacher();
    getAllAdmin();
  }, []);

  return (
    <>
      <AccountHeader />
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          {/* Header */}
          <CardHeader className="bg-white border-0 d-flex justify-content-between">
            <h3 className="mb-0">
              {showHistoryTable
                ? "LỊCH SỬ CHỈNH SỬA GIÁO VIÊN"
                : "BẢNG TÀI KHOẢN"}
            </h3>
            <Button color="default" type="button" onClick={() => {}}>
              {showHistoryTable ? "Danh sách giáo viên" : "Lịch sử giảng viên "}
            </Button>
          </CardHeader>

          <CardBody>
            <Tabs
              defaultActiveKey="sinhVien"
              id="fill-tab-example"
              className="mb-3"
              fill
            >
              <Tab eventKey="sinhVien" title={<strong>Sinh viên</strong>}>
                <MaterialReactTable
                  enableColumnResizing
                  enableGrouping
                  enableStickyHeader
                  enableStickyFooter
                  enableRowNumbers
                  state={{ isLoading: loadingStudents }}
                  displayColumnDefOptions={{
                    "mrt-row-actions": {
                      header: "Thao tác",
                      size: 20,
                    },
                    "mrt-row-numbers": {
                      size: 5,
                    },
                  }}
                  positionActionsColumn="last"
                  columns={columns_student}
                  data={students}
                  renderTopToolbarCustomActions={() => (
                    <Button
                      onClick={() => {}}
                      color="success"
                      variant="contained"
                    >
                      <i className="bx bx-layer-plus"></i>
                      Thêm giảng viên
                    </Button>
                  )}
                  enableRowActions
                  renderRowActions={({ row, table }) => (
                    <Box
                      sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
                    >
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleEditFrom_2(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton
                        color="info"
                        onClick={() => {
                          // handelShowHistory(row.original.teacherId);
                        }}
                      >
                        <IconEyeSearch />
                      </IconButton> */}
                    </Box>
                  )}
                  muiTablePaginationProps={{
                    rowsPerPageOptions: [10, 20, 50, 100],
                    showFirstButton: true,
                    showLastButton: true,
                  }}
                />
              </Tab>

              <Tab
                eventKey="gaingVien"
                className="bold-title"
                title={<strong>Giảng viên</strong>}
              >
                <MaterialReactTable
                  enableColumnResizing
                  enableGrouping
                  enableStickyHeader
                  enableStickyFooter
                  enableRowNumbers
                  state={{ isLoading: loadingTeachers }}
                  displayColumnDefOptions={{
                    "mrt-row-actions": {
                      header: "Thao tác",
                      size: 20,
                    },
                    "mrt-row-numbers": {
                      size: 5,
                    },
                  }}
                  positionActionsColumn="last"
                  columns={columns_teacher}
                  data={teachers}
                  renderTopToolbarCustomActions={() => (
                    <Button
                      onClick={() => {
                        handleResetForm_2();
                      }}
                      color="success"
                      variant="contained"
                    >
                      <i className="bx bx-layer-plus"></i>
                      Thêm giảng viên
                    </Button>
                  )}
                  enableRowActions
                  renderRowActions={({ row, table }) => (
                    <Box
                      sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
                    >
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleEditFrom_2(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton
                        color="info"
                        onClick={() => {
                          console.log(row.original.teacherId);
                          // handelShowHistory(row.original.teacherId);
                        }}
                      >
                        <IconEyeSearch />
                      </IconButton> */}
                    </Box>
                  )}
                  muiTablePaginationProps={{
                    rowsPerPageOptions: [10, 20, 50, 100],
                    showFirstButton: true,
                    showLastButton: true,
                  }}
                />
              </Tab>

              <Tab eventKey="Admin" title={<strong>Quản trị</strong>}>
                <MaterialReactTable
                  enableColumnResizing
                  enableGrouping
                  enableStickyHeader
                  enableStickyFooter
                  enableRowNumbers
                  state={{ isLoading: loadingAdmins }}
                  displayColumnDefOptions={{
                    "mrt-row-actions": {
                      header: "Thao tác",
                      size: 20,
                      // Something else here
                    },
                    "mrt-row-numbers": {
                      size: 5,
                    },
                  }}
                  positionActionsColumn="last"
                  columns={columns_admin}
                  data={admins}
                  renderTopToolbarCustomActions={() => (
                    <Button
                      onClick={() => {}}
                      color="success"
                      variant="contained"
                    >
                      <i className="bx bx-layer-plus"></i>
                      Thêm giảng viên
                    </Button>
                  )}
                  enableRowActions
                  renderRowActions={({ row, table }) => (
                    <Box
                      sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
                    >
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleEditFrom_2(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton
                        color="info"
                        onClick={() => {
                          console.log(row.original.teacherId);
                          // handelShowHistory(row.original.teacherId);
                        }}
                      >
                        <IconEyeSearch />
                      </IconButton> */}
                    </Box>
                  )}
                  muiTablePaginationProps={{
                    rowsPerPageOptions: [10, 20, 50, 100],
                    showFirstButton: true,
                    showLastButton: true,
                  }}
                />
              </Tab>
            </Tabs>

            <Modal
              className="modal-dialog-centered  modal-lg "
              isOpen={showForm_2}
              backdrop="static"
              toggle={() => handleResetForm_2()}
            >
              <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
                <div className="modal-header">
                  <h3 className="mb-0">Thông tin tài khoản</h3>
                  <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={handleResetForm_2}
                  >
                    <span aria-hidden={true}>×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="px-lg-2">
                    <Row>
                      <Col sm={6}>
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email
                          </label>

                          <Input
                            className="form-control-alternative"
                            id="input-course-name"
                            placeholder="Email tài khoản"
                            type="text"
                            onChange={handelOnChangeInput_2}
                            name="fullname"
                            readOnly={update}
                            value={teacher.email}
                          />
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Password
                          </label>

                          <Input
                            className="form-control-alternative"
                            id="input-course-name"
                            placeholder="Password"
                            type="password"
                            onChange={handelOnChangeInput_2}
                            name="fullname"
                            readOnly={update}
                            value={teacher.password}
                          />
                          <br></br>
                          <Col md={12}>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Password
                            </label>
                            <br></br>
                            <ButtonGroup>
                              <Button
                                color="primary"
                                outline
                                onClick={() => setGender_2(true)}
                                active={teacher.teacher.gender === true}
                              >
                                Nam
                              </Button>
                              <Button
                                color="primary"
                                outline
                                name="gender"
                                onClick={() => setGender_2(false)}
                                active={teacher.teacher.gender === false}
                              >
                                Nữ
                              </Button>
                            </ButtonGroup>
                          </Col>

                          <br></br>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Tên giảng viên
                          </label>

                          <Input
                            className="form-control-alternative"
                            id="input-course-name"
                            placeholder="Tên giảng viên"
                            type="text"
                            onChange={handelOnChangeInput_2}
                            name="fullname"
                            value={teacher.teacher.fullname}
                          />
                          {errors.fullname && (
                            <div className="text-danger mt-1 font-italic font-weight-light">
                              {errors.fullname}
                            </div>
                          )}
                        </FormGroup>
                        <Row>
                          <Col md={12}>
                            <ButtonGroup>
                              <Button
                                color="primary"
                                outline
                                onClick={() => setGender_2(true)}
                                active={teacher.teacher.gender === true}
                              >
                                Nam
                              </Button>
                              <Button
                                color="primary"
                                outline
                                name="gender"
                                onClick={() => setGender_2(false)}
                                active={teacher.teacher.gender === false}
                              >
                                Nữ
                              </Button>
                            </ButtonGroup>
                          </Col>
                          <Col md={12}>
                            <FormGroup>
                              <br></br>
                              <label
                                className="form-control-label"
                                htmlFor="input-email"
                              >
                                Trình độ học vấn
                              </label>

                              <Input
                                className="form-control-alternative"
                                id="input-course-name"
                                placeholder="Trình độ học vấn"
                                type="text"
                                onChange={handelOnChangeInput_2}
                                name="levels"
                                value={teacher.teacher.levels}
                              />
                              {errors.levels && (
                                <div className="text-danger mt-1 font-italic font-weight-light">
                                  {errors.levels}
                                </div>
                              )}
                              <br></br>
                              <label
                                className="form-control-label"
                                htmlFor="input-email"
                              >
                                Số điện thoại
                              </label>

                              <Input
                                className="form-control-alternative"
                                id="input-course-name"
                                placeholder="Số điện thoại"
                                type="text"
                                onChange={handelOnChangeInput_2}
                                name="phone"
                                value={teacher.teacher.phone}
                              />
                              {errors.phone && (
                                <div className="text-danger mt-1 font-italic font-weight-light">
                                  {errors.phone}
                                </div>
                              )}
                              <br></br>
                              <label
                                className="form-control-label"
                                htmlFor="citizenIdentification"
                              >
                                Số CCCD
                              </label>

                              <Input
                                className="form-control-alternative"
                                id="citizenIdentification"
                                placeholder="Số CCCD"
                                type="text"
                                onChange={handelOnChangeInput_2}
                                name="citizenIdentification"
                                value={teacher.teacher.citizenIdentification}
                              />
                              {errors.citizenIdentification && (
                                <div className="text-danger mt-1 font-italic font-weight-light">
                                  {errors.citizenIdentification}
                                </div>
                              )}
                              <br></br>
                              <label
                                className="form-control-label"
                                htmlFor="input-last-name"
                              >
                                Ngày sinh
                              </label>

                              <Input
                                className="form-control-alternative"
                                // value={teacher.dateOfBirth}
                                value={moment(
                                  teacher.teacher.dateOfBirth
                                ).format("YYYY-MM-DD")}
                                // pattern="yyyy-MM-dd"
                                id="input-coursePrice"
                                type="date"
                                name="dateOfBirth"
                                onChange={handelOnChangeInput_2}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={6}>
                        <Row>
                          <Col md={12}>
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-last-name"
                              >
                                Địa chỉ
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-courseDescription"
                                name="address"
                                value={teacher.teacher.address}
                                type="textarea"
                                onChange={handelOnChangeInput_2}
                              />
                              {errors.address && (
                                <div className="text-danger mt-1 font-italic font-weight-light">
                                  {errors.address}
                                </div>
                              )}
                              <Label
                                htmlFor="exampleFile"
                                className="form-control-label"
                              >
                                Ảnh đại diện
                              </Label>
                              <div className="custom-file">
                                <input
                                  type="file"
                                  name="imageFile"
                                  accept="image/*"
                                  className="custom-file-input form-control-alternative"
                                  id="customFile"
                                  onChange={onChangePicture}
                                />
                                <label
                                  className="custom-file-label"
                                  htmlFor="customFile"
                                >
                                  Chọn hình ảnh
                                </label>
                              </div>
                            </FormGroup>
                          </Col>
                          <div className="previewProfilePic px-3">
                            {imgData && (
                              <img
                                alt=""
                                width={350}
                                className="playerProfilePic_home_tile"
                                src={imgData}
                              />
                            )}
                            {!imgData && (
                              <img
                                alt=""
                                width={350}
                                className=""
                                src={
                                  process.env.REACT_APP_IMAGE_URL +
                                  IMG_URL +
                                  teacher.teacher.image
                                }
                              />
                            )}
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                </div>
                <div className="modal-footer">
                  <Button
                    color="secondary"
                    data-dismiss="modal"
                    type="button"
                    onClick={handleResetForm_2}
                  >
                    Hủy
                  </Button>
                  <Button color="primary" type="submit" className="px-5">
                    Lưu
                  </Button>
                </div>
              </Form>
            </Modal>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
export default memo(Teachers);
