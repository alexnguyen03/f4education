import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  ButtonGroup,
} from "reactstrap";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import cartEmptyimage from "../../assets/img/user.png";

import teacherApi from "api/teacherApi";
const IMG_URL = "/courses/";

const Information = () => {
  const [imgData, setImgData] = useState(null);
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rSelected, setRSelected] = useState(null); //radio button
  const [errors, setErrors] = useState({});
  const toastId = React.useRef(null);

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
  });

  //Reset form edit
  const handleResetForm = () => {
    // hide form
    setShowForm((pre) => !pre);
    setImgData(null);
    setErrors({});
  };

  //Show form edit thông tin giáo viên
  const handleEditFrom = (row) => {
    setShowForm(true);
  };

  // Thay đổi giá trị trên ô input
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

  const setGender = (gender) => {
    setTeacher((preTeacher) => ({
      ...preTeacher,
      gender: gender,
    }));
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

  const getTeacher = async () => {
    try {
      const resp = await teacherApi.getTeacher("johnpc03517");
      if (resp.status === 200) {
        setTeacher(resp.data);
        setRSelected(resp.data.gender);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    updateTeacher();
  };

  const validateForm = () => {
    let validationErrors = {};
    let test = 0;
    if (!teacher.fullname) {
      validationErrors.fullname = "Vui lòng nhập tên giảng viên !!!";
      test++;
    } else {
      validationErrors.fullname = "";
    }

    if (!teacher.citizenIdentification) {
      validationErrors.citizenIdentification =
        "Vui lòng nhập CCCD của giảng viên!!!";
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
      validationErrors.address = "Vui lòng nhập địa chỉ của giảng viên!!!";
      test++;
    } else {
      validationErrors.address = "";
    }

    if (!teacher.levels) {
      validationErrors.levels =
        "Vui lòng nhập trình độ học vấn của giảng viên!!!";
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

  // notification loading
  const notifi_loading = () => {
    toastId.current = toast("Đang cập nhật dữ liệu...", {
      type: toast.TYPE.LOADING,
      autoClose: false,
      isLoading: true,
      closeButton: false,
      closeOnClick: true,
    });
  };

  //notifications fail
  const update_fail = () => {
    toast.update(toastId.current, {
      type: toast.TYPE.ERROR,
      render: "Lỗi kết nối server",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      closeButton: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      isLoading: false,
    });
  };

  //notifications success
  const update_success = () => {
    toast.update(toastId.current, {
      type: toast.TYPE.SUCCESS,
      render: "Cập nhật dữ liệu thành công",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      closeButton: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      isLoading: false,
    });
  };

  const updateTeacher = async () => {
    const validationErrors = validateForm();
    console.log(Object.keys(validationErrors).length);

    if (Object.keys(validationErrors).length === 0) {
      notifi_loading();
      const formData = new FormData();
      formData.append("teacherRequest", JSON.stringify(teacherRequest));
      formData.append("file", image);
      try {
        const resp = await teacherApi.updateTeacher(formData);
        console.log("🚀 ~ file: Teachers.js:391 ~ updateTeacher ~ resp:", resp);
        if (resp.status === 200) {
          handleResetForm();
          update_success();
        } else {
          update_fail();
        }
      } catch (error) {
        update_fail();
      }
    } else {
      setErrors(validationErrors);
    }
  };

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

  useEffect(() => {
    getTeacher();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 bg-gradient-success ml-5 mt-4">
            <div class="text-center mb-3">
              <img
                src={process.env.REACT_APP_IMAGE_URL + IMG_URL + teacher.image}
                className="rounded-circle w-100 p-3"
                width={240}
                height={240}
              />
              <h1 className="mt-2 text-dark">{teacher.fullname}</h1>
              <span class="text-dark h3">
                {teacher.gender ? "Nam" : "Nữ"} |{" "}
              </span>
              <span class="text-dark h3">
                {moment(teacher.dateOfBirth).format("DD/MM/yyyy")}
              </span>
            </div>
          </div>
          <div className="col-lg-7 ml-4">
            <div className="py-4 ml-4">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 mb-4">
                    <h1 className="text-dark">HỒ SƠ CỦA TÔI</h1>
                  </div>
                  <div className="col-lg-5">
                    <h3>ĐỊA CHỈ</h3>
                    <h3>EMAIL</h3>
                    <h3>SỐ ĐIỆN THOẠI</h3>
                    <h3>CĂN CƯỚC CÔNG DÂN</h3>
                    <h3>CẤP ĐỘ</h3>
                  </div>
                  <div className="col-lg-6">
                    <h3 class="text-muted">{teacher.address}</h3>
                    <h3 class="text-muted">{teacher.teacherId}@gmail.com</h3>
                    <h3 class="text-muted">{teacher.phone}</h3>
                    <h3 class="text-muted">{teacher.citizenIdentification}</h3>
                    <h3 class="text-muted">{teacher.levels}</h3>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-dark float-right rounded-pill mt-5"
              style={{ width: 250, marginRight: 100 }}
              onClick={() => {
                handleEditFrom();
              }}
            >
              Thay đổi thông tin
            </button>
          </div>
        </div>
      </div>

      <Modal
        className="modal-dialog-centered  modal-lg "
        isOpen={showForm}
        backdrop="static"
        toggle={() => setShowForm((pre) => !pre)}
      >
        <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
          <div className="modal-header">
            <h3 className="mb-0">Thông tin giảng viên '{teacher.fullname}'</h3>
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
                    <label className="form-control-label" htmlFor="input-email">
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
                    {/* {errors.fullname && (
                      <div className="text-danger mt-1 font-italic font-weight-light">
                        {errors.fullname}
                      </div>
                    )} */}
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
                        {/* {errors.levels && (
                          <div className="text-danger mt-1 font-italic font-weight-light">
                            {errors.levels}
                          </div>
                        )} */}
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
                        {/* {errors.phone && (
                          <div className="text-danger mt-1 font-italic font-weight-light">
                            {errors.phone}
                          </div>
                        )} */}
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
                        {/* {errors.citizenIdentification && (
                          <div className="text-danger mt-1 font-italic font-weight-light">
                            {errors.citizenIdentification}
                          </div>
                        )} */}
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
                        {/* {errors.address && (
                          <div className="text-danger mt-1 font-italic font-weight-light">
                            {errors.address}
                          </div>
                        )} */}
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
                          width={350}
                          height={330}
                          className="playerProfilePic_home_tile"
                          src={imgData}
                        />
                      )}
                      {!imgData && (
                        <img
                          width={350}
                          height={330}
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
              Đóng
            </Button>
            <Button color="primary" type="submit" className="px-5">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Information;
