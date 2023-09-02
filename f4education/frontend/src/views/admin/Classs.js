import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Modal,
} from "reactstrap";
import ClasssHeader from "components/Headers/ClasssHeader";
import { useState, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import moment from "moment";

// gọi API từ classApi
import classApi from "api/classApi";

// gọi API từ classHistoryApi
import classHistoryApi from "api/classHistoryApi";

const Classs = () => {
  const [classses, setClassses] = useState([]);
  const [classHistories, setClassHistories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [update, setUpdate] = useState(true);
  const [isClassHistoryShowing, setIsClassHistoryShowing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // khởi tạo Class
  const [classs, setClasss] = useState({
    classId: "",
    className: "",
    startDate: "",
    endDate: "",
    maximumQuantity: 0,
    status: "Đang chờ",
  });

  // thay đổi giá trị của biến
  const handleChangeClassListAndHistory = () => {
    setIsClassHistoryShowing(!isClassHistoryShowing);
  };

  // xử lý status
  const renderSelect = (status) => {
    switch (status) {
      case "Đang chờ":
        return (
          <>
            <option data-value="Đang chờ" value="Đang chờ">
              Đang chờ
            </option>
            <option data-value="Đang diễn ra" value="Đang diễn ra">
              Đang diễn ra
            </option>
          </>
        );
        break;
      case "Đang diễn ra":
        return (
          <>
            <option data-value="Đang diễn ra" value="Đang diễn ra">
              Đang diễn ra
            </option>
            <option data-value="Kết thúc" value="Kết thúc">
              Kết thúc
            </option>
          </>
        );
        break;
      case "Kết thúc":
        return (
          <>
            <option data-value="Đang diễn ra" value="Đang diễn ra">
              Đang diễn ra
            </option>
            <option data-value="Kết thúc" value="Kết thúc">
              Kết thúc
            </option>
          </>
        );
        break;
      default:
        break;
    }
  };

  // lấy dữ liệu của select status
  const handleOnChangeSelect = (e) => {
    const selectedIndex = e.target.options.selectedIndex;
    const status = e.target.options[selectedIndex].getAttribute("data-value");
    setSelectedStatus(status);
  };

  // edit row
  const handleEditRow = (row) => {
    setShowForm(true);
    setUpdate(false);
    setSelectedStatus(row.original.status);
    console.log(selectedStatus);
    setClasss({ ...row.original });
  };

  // lấy dữ liệu từ form
  const handelOnChangeInput = (e) => {
    setClasss({
      ...classs,
      [e.target.name]: e.target.value,
    });
  };

  // xóa trắng form
  const handleResetForm = () => {
    setShowForm((pre) => !pre);
    setClasss({
      classId: "",
      className: "",
      maximumQuantity: 0,
      status: "Đang chờ",
    });
    setUpdate(true);
  };

  // lấy tấc cả dữ liệu Class từ database (gọi api)
  const getDataClass = async () => {
    try {
      const resp = await classApi.getAllClass();
      setClassses(resp);
    } catch (error) {
      console.log(error);
    }
  };

  // thêm class
  const createClass = async () => {
    try {
      const resp = await classApi.createClass(classs);
      alert("Thêm thành công");
      handleResetForm();
    } catch (error) {
      console.log("Thêm thất bại", error);
    }
  };

  // cập nhật class
  const updateClass = async () => {
    try {
      console.log(classs);
      const body = classs;
      if (body.status === "Đang chờ" || body.status === "Đang diễn ra") {
        body.endDate = null;
      } else {
        body.endDate = new Date();
      }
      const resp = await classApi.updateClass(body, classs.classId);
      alert("Cập nhật thành công");
      handleResetForm();
    } catch (error) {
      console.log("Cập nhật thất bại", error);
    }
  };

  // bảng lớp học
  const columnClass = useMemo(
    () => [
      {
        accessorKey: "classId",
        header: "Mã lớp học",
        size: 100,
      },
      {
        accessorKey: "className",
        header: "Tên lớp học",
        size: 100,
      },
      {
        accessorKey: "startDate",
        accessorFn: (row) =>
          moment(row.startDate).format("DD/MM/yyyy, h:mm:ss a"),
        header: "Ngày bắt đầu",
        size: 90,
      },
      {
        accessorKey: "endDate",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          if (row.endDate !== null) {
            return (
              <span>{moment(row.endDate).format("DD/MM/yyyy, h:mm:ss a")}</span>
            );
          } else {
            return <span>Chưa kết thúc</span>;
          }
        },
        header: "Ngày kết thúc",
        size: 90,
      },
      {
        accessorKey: "maximumQuantity",
        header: "Số lượng tối đa",
        size: 95,
      },
      {
        accessorKey: "admin.fullname",
        header: "Người tạo",
        size: 95,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 95,
      },
    ],
    []
  );

  // hiển thị tiếng việt
  const displayActionHistory = (action) => {
    return action === "CREATE" ? "Thêm mới" : "Cập nhật";
  };

  // bảng lịch sử lớp học
  const columnClassHistory = useMemo(
    () => [
      {
        accessorKey: "classId",
        header: "Mã lớp học",
        size: 90,
      },
      {
        accessorKey: "className",
        header: "Tên lớp học",
        size: 100,
      },
      {
        accessorKey: "startDate",
        accessorFn: (row) =>
          moment(row.startDate).format("DD/MM/yyyy, h:mm:ss a"),
        header: "Ngày bắt đầu",
        size: 105,
      },
      {
        accessorKey: "endDate",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          if (row.endDate !== null) {
            return (
              <span>{moment(row.endDate).format("DD/MM/yyyy, h:mm:ss a")}</span>
            );
          } else {
            return <span>Chưa kết thúc</span>;
          }
        },
        header: "Ngày kết thúc",
        size: 105,
      },
      {
        accessorKey: "maximumQuantity",
        header: "Số lượng tối đa",
        size: 95,
      },
      {
        accessorKey: "adminId",
        header: "Người chỉnh sửa",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 95,
      },
      {
        accessorFn: (row) =>
          moment(row.modifyDate).format("DD-MM-yyyy, h:mm:ss a"),
        header: "Ngày Chỉnh Sửa",
        size: 120,
      },
      {
        accessorKey: "action",
        accessorFn: (row) => displayActionHistory(row.action),
        header: "Hành động",
        size: 100,
      },
    ],
    []
  );

  // lấy tấc cả dữ liệu ClassHistory từ database (gọi api)
  const getDataClassHistory = async () => {
    try {
      const resp = await classHistoryApi.getAllClassHistory();
      setClassHistories(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setClasss({
      ...classs,
      status: selectedStatus,
    });
  }, [selectedStatus]);

  // Use effect
  useEffect(() => {
    getDataClass();
    getDataClassHistory();
  }, []);

  return (
    <>
      <ClasssHeader />
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          {/* Header */}
          <CardHeader className="bg-white border-0 d-flex justify-content-between">
            <h3 className="mb-0">
              {isClassHistoryShowing ? "Bảng lịch sử lớp học" : "Bảng lớp học"}
            </h3>
            <Button
              color="default"
              type="button"
              onClick={() => handleChangeClassListAndHistory()}
            >
              {isClassHistoryShowing ? "Danh sách lớp học" : "Lịch sử lớp học"}
            </Button>
          </CardHeader>

          {/* bảng lớp học */}
          {isClassHistoryShowing ? null : (
            <CardBody>
              <MaterialReactTable
                displayColumnDefOptions={{
                  "mrt-row-actions": {
                    header: "Thao tác",
                    size: 50,
                  },
                }}
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                columns={columnClass}
                data={classses}
                positionActionsColumn="last"
                renderTopToolbarCustomActions={() => (
                  <Button
                    onClick={() => setShowForm((pre) => !pre)}
                    color="success"
                  >
                    Thêm lớp học
                  </Button>
                )}
                enableRowActions
                renderRowActions={({ row, table }) => (
                  <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        handleEditRow(row);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                )}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10, 20, 50, 100],
                  showFirstButton: false,
                  showLastButton: false,
                }}
              />
            </CardBody>
          )}

          {/* bảng lịch sử lớp học  */}
          {isClassHistoryShowing ? (
            <CardBody>
              <MaterialReactTable
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                columns={columnClassHistory}
                data={classHistories}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10, 20, 50, 100],
                  showFirstButton: false,
                  showLastButton: false,
                }}
              />
            </CardBody>
          ) : null}
        </Card>
        <Modal
          backdrop="static"
          className="modal-dialog-centered"
          isOpen={showForm}
          toggle={() => setShowForm((pre) => !pre)}
        >
          <div className="modal-header">
            <h3 className="mb-0">Thông tin lớp học</h3>
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
            <Form>
              <div className="px-lg-2">
                <FormGroup className={update ? "hidden-form-group" : ""}>
                  <label
                    className="form-control-label"
                    htmlFor="input-class-id"
                  >
                    Mã lớp học
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-class-id"
                    type="text"
                    onChange={handelOnChangeInput}
                    placeholder="Mã lớp học"
                    name="classId"
                    readOnly={update ? "readOnly" : "readOnly"}
                    value={classs.classId}
                  />
                </FormGroup>
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-class-name"
                  >
                    Tên lớp học
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-class-name"
                    placeholder="Tên lớp học"
                    type="text"
                    onChange={handelOnChangeInput}
                    name="className"
                    value={classs.className}
                  />
                </FormGroup>
                {/* <Row>
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-start-date'>
												Ngày bắt đầu
											</label>
											<Input
												className='form-control-alternative'
												id='input-start-date'
												type='date'
												value={classs.startDate}
												name='startDate'
												onChange={handelOnChangeInput}
											/>
										</FormGroup>
									</Col>
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-end-date'>
												Ngày kết thúc
											</label>
											<Input
												className='form-control-alternative'
												id='input-end-date'
												type='date'
												value={classs.endDate}
												name='endDate'
												onChange={handelOnChangeInput}
											/>
										</FormGroup>
									</Col>
								</Row> */}
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-maximumQuantity"
                      >
                        Số lượng tối đa
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="input-maximumQuantity"
                        type="number"
                        min={0}
                        step={1}
                        max={50}
                        value={classs.maximumQuantity}
                        name="maximumQuantity"
                        onChange={handelOnChangeInput}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        Trạng thái
                      </label>
                      <Input
                        id="exampleSelect"
                        name="status"
                        type="select"
                        onChange={handleOnChangeSelect}
                        readOnly={update ? "readOnly" : undefined}
                        value={selectedStatus}
                      >
                        {(classs.status === "Đang chờ" ||
                          classs.status === "Đang diễn ra" ||
                          classs.status === "Kết thúc") &&
                          (update ? (
                            <option data-value="Đang chờ" value="Đang chờ">
                              Đang chờ
                            </option>
                          ) : (
                            renderSelect(classs.status)
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Form>
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
            <Button
              color="primary"
              type="button"
              onClick={update ? createClass : updateClass}
            >
              {update ? "Lưu" : "Cập nhật"}
            </Button>
          </div>
        </Modal>
      </Container>
    </>
  );
};

export default Classs;
