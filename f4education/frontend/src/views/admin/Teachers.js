import {
  Edit as EditIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  Search,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import teacherApi from "api/teacherApi";
import moment from "moment";
import TeacherHeader from "components/Headers/TeacherHeader";
import { MaterialReactTable } from "material-react-table";
import { memo, useEffect, useMemo, useState } from "react";
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
  const [showForm, setShowForm] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingTeachersHistory, setLoadingTeachersHistory] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [rSelected, setRSelected] = useState(null); //radio button
  const [image, setImage] = useState(null);
  const [teacherHistories, setTeacherHistories] = useState([]);
  const [showHistoryTable, setShowHistoryTable] = useState(false);
  const [listHistoryById, setListHistoryById] = useState([]);

  //Nhận data gửi lên từ server
  const [teacher, setTeacher] = useState({
    teacherId: "",
    fullname: "",
    gender: true,
    dateOfBirth: "",
    citizenIdentification: "",
    address: "",
    levels: "",
    phone: "",
    image: "",
    acccountID: 0,
  });

  // Dùng để gửi request về sever
  const [teacherRequest, setTeacherRequest] = useState({
    teacherId: "",
    fullname: "",
    gender: true,
    dateOfBirth: "",
    citizenIdentification: "",
    address: "",
    levels: "",
    phone: "",
    image: "",
    acccountID: 0,
    // acccountAdmin: 0,
  });

  const handelOnChangeInput = (e) => {
    //Còn đang xử lý
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
      numberSession: 0,
    });
    console.log(
      "🚀 ~ file: Teachers.js:74 ~ handelOnChangeInput ~ teacher:",
      e.target.value
    );
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

  const handelShowHistory = async (id) => {
    setShowHistoryInfo(true);
    setLoadingHistoryInfo(true);
    try {
      const resp = await teacherApi.getTeacherHistoryByCourseid(id);
      setListHistoryById(resp.reverse());
      setLoadingHistoryInfo(false);
    } catch (error) {
      console.log("failed to fetch data", error);
    }
  };

  const columns = useMemo(
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
        accessorKey: "phone",
        header: "Số điện thoại",
        size: 75,
      },
      {
        accessorKey: "address",
        header: "Địa chỉ",
        size: 75,
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

  const handleEditFrom = (row) => {
    setShowForm(true);
    const selectedTeacher = teachers.find(
      (teacher) => teacher.teacherId === row.original.teacherId
    );
    // setImage(process.env.REACT_APP_IMAGE_URL + IMG_URL + selectedTeacher.image);
    setTeacher({ ...selectedTeacher });
    setRSelected(selectedTeacher.gender);
  };

  const handleResetForm = () => {
    // hide form
    setShowForm((pre) => !pre);
    setImgData(null);
    setTeacher({
      // subjectName: '',
      teacherId: "",
      fullname: "",
      gender: true,
      dateOfBirth: "",
      citizenIdentification: "",
      address: "",
      levels: "",
      phone: "",
      image: "",
      acccountID: 0,
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    updateTeacher();
    // console.log(teacher);
    if (image) {
      setTeacher((preTeacher) => ({
        ...preTeacher,
        image: image.name,
      }));
    }
  };

  const updateTeacher = async () => {
    const formData = new FormData();
    formData.append("teacherRequest", JSON.stringify(teacherRequest));
    formData.append("file", image);
    try {
      const resp = await teacherApi.updateTeacher(formData);
      setTeacher([...resp]);
    } catch (error) {
      console.log("🚀 ~ file: Teachers.js:257 ~ updateTeacher ~ error:", error);
    }
  };

  //gọi API lấy data
  const getAllTeacher = async () => {
    if (teachers.length > 0) {
      setLoadingTeachers(false);
      return;
    }

    try {
      setLoadingTeachers(true);
      const resp = await teacherApi.getAllTeachers();
      console.log(resp);
      setTeachers(resp.reverse());
      setLoadingTeachers(false);
    } catch (error) {
      console.log("failed to load data", error);
    }
  };

  const setGender = (gender) => {
    setTeacher((preTeacher) => ({
      ...preTeacher,
      gender: gender,
    }));
  };

  const handleShowAllHistory = () => {
    if (teacherHistories.length === 0) {
      getAllCourseHistory();
    }
    setShowHistoryTable((pre) => !pre);
  };

  const getAllCourseHistory = async () => {
    try {
      setLoadingTeachersHistory(true);
      const resp = await teacherApi.getAllTeachersHistory();
      setTeacherHistories(resp.reverse());
      setLoadingTeachersHistory(false);
      console.log(setTeacherHistories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setListHistoryById([...listHistoryById]);
  }, [loadingHistoryInfo]);

  useEffect(() => {
    const {
      teacherId,
      fullname,
      gender,
      dateOfBirth,
      citizenIdentification,
      address,
      levels,
      phone,
      image,
      acccountID,
    } = { ...teacher };

    setTeacherRequest({
      // acccountAdmin: user.id,
      teacherId: teacherId,
      fullname: fullname,
      gender: gender,
      dateOfBirth: dateOfBirth,
      citizenIdentification: citizenIdentification,
      address: address,
      levels: levels,
      phone: phone,
      image: image,
      acccountID: acccountID,
    });
  }, [teacher]);

  //load data lên ta
  useEffect(() => {
    if (teachers.length > 0) return;
    getAllTeacher();
  }, []);

  return (
    <>
      <TeacherHeader />
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          {/* Header */}
          <CardHeader className="bg-white border-0 d-flex justify-content-between">
            <h3 className="mb-0">
              {showHistoryTable
                ? "LỊCH SỬ CHỈNH SỬA GIÁO VIÊN"
                : "BẢNG GIẢNG VIÊN"}
            </h3>
            <Button
              color="default"
              type="button"
              onClick={handleShowAllHistory}
            >
              {showHistoryTable ? "Danh sách giáo viên" : "Lịch sử giảng viên "}
            </Button>
          </CardHeader>

          <CardBody>
            {!showHistoryTable && (
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
                    // Something else here
                  },
                  "mrt-row-numbers": {
                    size: 5,
                  },
                }}
                positionActionsColumn="last"
                columns={columns}
                data={teachers}
                enableRowActions
                renderRowActions={({ row, table }) => (
                  <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        handleEditFrom(row);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => {
                        console.log(row.original.teacherId);
                        handelShowHistory(row.original.teacherId);
                      }}
                    >
                      <IconEyeSearch />
                    </IconButton>
                  </Box>
                )}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10, 20, 50, 100],
                  showFirstButton: true,
                  showLastButton: true,
                }}
              />
            )}

            {showHistoryTable && (
              <MaterialReactTable
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                enableRowNumbers
                state={{ isLoading: loadingTeachersHistory }}
                displayColumnDefOptions={{
                  // 'mrt-row-actions': {
                  // 	header: 'Thao tác',
                  // 	size: 20,
                  // 	// Something else here
                  // },
                  "mrt-row-numbers": {
                    size: 5,
                  },
                }}
                columns={columnsTeacherHistory}
                data={teacherHistories}
                renderDetailPanel={({ row }) => (
                  <Box
                    sx={{
                      display: "grid",
                      margin: "auto",
                      gridTemplateColumns: "1fr 1fr",
                      width: "100%",
                    }}
                  >
                    <Typography>
                      Số CCCD: {row.original.citizenIdentification}
                    </Typography>
                    <Typography>Địa chỉ: {row.original.address}</Typography>
                    <Typography>Trình độ: {row.original.levels}</Typography>
                    <Typography>Số điện thoại: {row.original.phone}</Typography>
                    <Typography>Ảnh đại diện:</Typography>
                    <Typography>
                      <div className="previewProfilePic px-3">
                        <img
                          alt=""
                          width={200}
                          className=""
                          src={
                            process.env.REACT_APP_IMAGE_URL +
                            IMG_URL +
                            row.original.image
                          }
                        />
                      </div>
                    </Typography>
                  </Box>
                )}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10, 20, 50, 100],
                  showFirstButton: true,
                  showLastButton: true,
                }}
              />
            )}

            <Modal
              className="modal-dialog-centered  modal-lg "
              isOpen={showForm}
              backdrop="static"
              toggle={() => setShowForm((pre) => !pre)}
            >
              <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
                <div className="modal-header">
                  <h3 className="mb-0">
                    Thông tin giảng viên '{teacher.teacherId}'
                  </h3>
                  <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={handleResetForm}
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
                            Tên giảng viên
                          </label>

                          <Input
                            className="form-control-alternative"
                            id="input-course-name"
                            placeholder="Tên giảng viên"
                            type="text"
                            onChange={handelOnChangeInput}
                            name="fullname"
                            value={teacher.fullname}
                          />
                        </FormGroup>
                        <Row>
                          <Col md={12}>
                            <ButtonGroup>
                              <Button
                                color="primary"
                                outline
                                onClick={() => setGender(true)}
                                active={teacher.gender === true}
                              >
                                Nam
                              </Button>
                              <Button
                                color="primary"
                                outline
                                name="gender"
                                onClick={() => setGender(false)}
                                active={teacher.gender === false}
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
                                onChange={handelOnChangeInput}
                                name="levels"
                                value={teacher.levels}
                              />
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
                                onChange={handelOnChangeInput}
                                name="phone"
                                value={teacher.phone}
                              />
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
                                onChange={handelOnChangeInput}
                                name="citizenIdentification"
                                value={teacher.citizenIdentification}
                              />
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
                                value={moment(teacher.dateOfBirth).format(
                                  "YYYY-MM-DD"
                                )}
                                // pattern="yyyy-MM-dd"
                                id="input-coursePrice"
                                type="date"
                                name="dateOfBirth"
                                onChange={handelOnChangeInput}
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
                                value={teacher.address}
                                type="textarea"
                                onChange={handelOnChangeInput}
                              />
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
                                  teacher.image
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
                    onClick={handleResetForm}
                  >
                    Hủy
                  </Button>
                  <Button color="primary" type="submit" className="px-5">
                    Lưu
                  </Button>
                </div>
              </Form>
            </Modal>

            <Modal
              className="modal-dialog-centered  modal-lg"
              isOpen={showHistoryInfo}
              toggle={() => setShowHistoryInfo((pre) => !pre)}
            >
              <div className="modal-header">
                <h3 className="mb-0">Lịch sử chỉnh sửa của giảng viên </h3>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => {
                    setShowHistoryInfo(false);
                  }}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="text-center  mb-3">
                  HIỆN TẠI - {moment(new Date()).format("DD/MM/yyyy, h:mm A")}
                </div>

                {loadingHistoryInfo ? (
                  <div className="d-flex justify-content-center">
                    <ReactLoading type={"cylon"} color="#357edd" />
                  </div>
                ) : (
                  listHistoryById.map((item) => (
                    <Timeline key={item.courseHistoryId}>
                      <Event
                        interval={
                          <span className="fw-bold fs-3">
                            {moment(item.modifyDate).format(
                              "DD/MM/yyyy, h:mm A"
                            )}
                          </span>
                        }
                        title={
                          <span
                            className={`alert alert-${
                              item.action === "UPDATE" ? "primary" : "success"
                            } px-3 mb-3`}
                          >
                            {" "}
                            {item.action === "UPDATE"
                              ? "Cập nhật"
                              : "Thêm mới"}{" "}
                          </span>
                        }
                      >
                        <Card>
                          {/* <br></br> */}
                          <Row>
                            <Col className="text-left">
                              <strong>
                                {" "}
                                <h4>{item.adminName}</h4>{" "}
                              </strong>
                            </Col>
                          </Row>
                          {/* <br></br> */}

                          <CardImg
                            alt="Card image cap"
                            src={
                              process.env.REACT_APP_IMAGE_URL +
                              IMG_URL +
                              item.image
                            }
                            width={300}
                          />
                          <CardBody>
                            <Row>
                              <Col className="text-left font-weight-normal">
                                <br></br>
                                <strong>Tên giảng viên:</strong> {item.fullname}{" "}
                                <br></br>
                                <strong>Ngày sinh:</strong>{" "}
                                {moment(item.dateOfBirth).format("DD/MM/yyyy")}
                                <br></br>
                                <strong>Ngày sinh:</strong>{" "}
                                {moment(item.dateOfBirth).format("DD/MM/yyyy")}
                                <br></br>
                                <strong>Số CCCD:</strong>{" "}
                                {item.citizenIdentification}
                                <br></br>
                                <strong>Địa chỉ:</strong> {item.address}
                                <br></br>
                                <strong>Trình độ học vấn:</strong> {item.levels}
                                <br></br>
                                <strong>Số điện thoại:</strong> {item.phone}
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Event>
                    </Timeline>
                  ))
                )}

                {listHistoryById.length === 0 && !loadingHistoryInfo && (
                  <div className="text-warning text-center my-5 py-5">
                    <Warning /> Không tìm thấy lịch sử{" "}
                  </div>
                )}
                <div className="text-center">NƠI MỌI THỨ BẮT ĐẦU</div>
              </div>

              <div className="modal-footer">
                <Button
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => {
                    setShowHistoryInfo(false);
                  }}
                >
                  Đóng
                </Button>
              </div>
            </Modal>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
export default memo(Teachers);
