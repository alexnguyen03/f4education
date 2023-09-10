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
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  ButtonGroup,
} from "reactstrap";
import Select from "react-select";
const Teachers = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  const [imgData, setImgData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [update, setUpdate] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [rSelected, setRSelected] = useState(null); //radio button
  const [selectedSubject, setSelectedSubject] = useState({
    value: "0",
    label: "",
  });
  const [options, setOptions] = useState([{ value: "0", label: "" }]);

  // const [selectedId, setSelectedId] = useState(-1);
  // const [subjects, setSubjects] = useState([]);
  // const [image, setImage] = useState(null);

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
    subjectId: 0,
    adminId: "",
    courseName: "",
    coursePrice: 0,
    courseDuration: "",
    courseDescription: "",
    numberSession: 0,
    image: "",
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

  // const handleOnChangeSelect = (e) => {
  // 	const selectedIndex = e.target.options.selectedIndex;
  // 	setSubjectId(e.target.options[selectedIndex].getAttribute('data-value'));
  // 	setCourseRequest((preCourse) => ({
  // 		...preCourse,
  // 		subjectId: parseInt(subjectId),
  // 	}));
  // };

  //Cập nhật hình ảnh
  // const onChangePicture = (e) => {
  // 	setImage(null);
  // 	if (e.target.files[0]) {
  // 		setImage(e.target.files[0]);
  // 		const reader = new FileReader();
  // 		reader.addEventListener('load', () => {
  // 			setImgData(reader.result);
  // 		});
  // 		reader.readAsDataURL(e.target.files[0]);
  // 		setCourse((preCourse) => ({
  // 			...preCourse,
  // 			image: e.target.files[0].name,
  // 		}));
  // 	}
  // };

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
      // {
      // 	accessorKey: 'coursePrice',
      // 	header: 'Giá (đ)',
      // 	size: 60,
      // },
      // {
      // 	accessorKey: 'subject.admin.adminId',
      // 	header: 'Mã người tạo',
      // 	size: 80,
      // },
    ],
    []
  );

  // const fetchCourses = async () => {
  // 	try {
  // 		const resp = await courseApi.getAll();
  // 		setCourses([...resp]);
  // 	} catch (error) {
  // 		console.log('failed to fetch data', error);
  // 	}
  // };

  // const fetchSubject = async () => {
  // 	try {
  // 		const resp = await subjectApi.getAllSubject();
  // 		setSubjects(resp);
  // 	} catch (error) {
  // 		console.log(error);
  // 	}
  // };

  // const convertToArray = () => {
  // 	const convertedArray = subjects.map((item) => ({
  // 		value: item.subjectId,
  // 		label: item.subjectName,
  // 	}));
  // 	console.log(options);
  // 	return convertedArray;
  // };

  const handleEditFrom = (row) => {
    setShowForm(true);
    const selectedTeacher = teachers.find(
      (teacher) => teacher.teacherId === row.original.teacherId
    );
    setUpdate((pre) => !pre);
    setTeacher({ ...selectedTeacher });
    console.log(
      "🚀 ~ file: Teachers.js:177 ~ handleEditFrom ~ selectedTeacher:",
      selectedTeacher
    );
  };

  const handleResetForm = () => {
    // hide form
    setShowForm((pre) => !pre);
    setImgData(null);
    // set course == null
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

  // const handleShowAddForm = () => {
  // 	setShowForm((pre) => !pre);
  // 	setUpdate(false);
  // 	handleSelect(options[0]);
  // 	console.log(courseRequest);
  // };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (update) {
      console.log("updated");
      // if (image) {
      // 	setCourse((preCourse) => ({
      // 		...preCourse,
      // 		image: image.name,
      // 	}));
      // }
      setUpdate(false);
      console.log(teacherRequest);
    } else {
      // console.log(subjectId);
      setTeacherRequest((preCourse) => ({
        ...preCourse,
        adminId: user.username,
        numberSession: 0,
      }));
      addTeacher();
    }
  };

  const addTeacher = async () => {
    const formData = new FormData();
    formData.append("teacherRequest", JSON.stringify(teacherRequest));
    // formData.append('file', image);
    console.log([...formData]);
    console.log({ ...teacherRequest });
    try {
      const resp = await teacherApi.addTeacher(formData);
      setTeacher([...resp]);
    } catch (error) {
      console.log("🚀 ~ file: Teachers.js:257 ~ addTeacher ~ error:", error);
    }
  };

  // function handleSelect(data) {
  // 	setSelectedSubject(data);
  // 	setCourseRequest((pre) => ({...pre, subjectId: parseInt(selectedSubject.value)}));
  // 	console.log(courseRequest);
  // }

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

  //load data lên ta
  useEffect(() => {
    if (teachers.length > 0) return;
    getAllTeacher();
  }, []);

  // useEffect(() => {
  // 	const {courseName, coursePrice, courseDuration, courseDescription, numberSession, image} = {...course};

  // 	setCourseRequest({courseName: courseName, coursePrice: coursePrice, courseDuration: courseDuration, courseDescription: courseDescription, numberSession: numberSession, image: image, subjectId: parseInt(selectedSubject.value), adminId: user.username});
  // }, [course, selectedSubject]);

  return (
    <>
      <TeacherHeader />
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          {/* Header */}
          <CardHeader className="bg-white border-0 d-flex justify-content-between">
            <h3 className="mb-0">BẢNG GIẢNG VIÊN</h3>
            <Button color="default" type="button">
              Lịch sử giáo viên
            </Button>
          </CardHeader>

          <CardBody>
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
              renderTopToolbarCustomActions={() => (
                <Button
                  // onClick={handleShowAddForm}
                  color="primary"
                  variant="contained"
                >
                  <i className="bx bx-layer-plus"></i>
                  Thêm giảng viên
                </Button>
              )}
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
                    color="error"
                    onClick={() => {
                      teachers.splice(row.index, 1);
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              )}
              muiTablePaginationProps={{
                rowsPerPageOptions: [10, 20, 50, 100],
                showFirstButton: true,
                showLastButton: true,
              }}
            />

            <Modal
              className="modal-dialog-centered  modal-lg "
              isOpen={showForm}
              backdrop="static"
              toggle={() => setShowForm((pre) => !pre)}
            >
              <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
                <div className="modal-header">
                  <h3 className="mb-0">Thông tin giảng viên</h3>
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
                        {/* <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Tên môn học
                          </label>
                          <Select
                            options={options}
                            placeholder="Select color"
                            value={selectedSubject}
                            onChange={handleSelect}
                            isSearchable={true}
                          />
                        </FormGroup> */}
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
                            {/* <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-first-name"
                              >
                                Giới tính
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-courseDuration"
                                placeholder="Thời lượng"
                                type="radio"
                                value={teacher.gender}
                                name="gender"
                                onChange={handelOnChangeInput}
                              />
                            </FormGroup> */}

                            <ButtonGroup>
                              <Button
                                color="primary"
                                outline
                                onClick={() => setRSelected(1)}
                                active={rSelected === 1}
                              >
                                Radio 1
                              </Button>
                              <Button
                                color="primary"
                                outline
                                onClick={() => setRSelected(2)}
                                active={rSelected === 2}
                              >
                                Radio 2
                              </Button>
                              <Button
                                color="primary"
                                outline
                                onClick={() => setRSelected(3)}
                                active={rSelected === 3}
                              >
                                Radio 3
                              </Button>
                            </ButtonGroup>
                          </Col>
                          <Col md={12}>
                            <FormGroup>
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
                            </FormGroup>
                          </Col>
                          {/* <Col md={12}>
                            <FormGroup>
                              <Label
                                htmlFor="exampleFile"
                                className="form-control-label"
                              >
                                Hình ảnh khóa học
                              </Label>
                              <div className="custom-file">
                                <input
                                  type="file"
                                  name="imageFile"
                                  accept="image/*"
                                  className="custom-file-input form-control-alternative"
                                  id="customFile"
                                  onChange={onChangePicture}
                                  // multiple={true}
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
                            <img
                              alt=""
                              width={120}
                              className="playerProfilePic_home_tile"
                              src={imgData}
                            />
                          </div> */}
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
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
export default memo(Teachers);
