import {FormGroup} from '@mui/material';
import SubjectHeader from 'components/Headers/SubjectHeader';
import {MaterialReactTable} from 'material-react-table';
import {useEffect, useMemo, useState} from 'react';

// reactstrap components
import {Button, Card, CardBody, CardHeader, Container, Input, Modal} from 'reactstrap';

// Stoatify component
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Axios
import subjectApi from "../../api/subjectApi";
import subjectHistoryApi from "../../api/subjectHistoryApi";

const Subjects = () => {
  // Main variable
  const [subjects, setSubjects] = useState([]);
  const [subjectHistories, setSubjectHistories] = useState([]);

  // Action variable
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSubjectHistoryShowing, setIsSubjectHistoryShowing] = useState(false);

	// Form variable
	const [errorInputAddSubject, setErrorInputAddSubject] = useState({
		status: false,
		message: '',
	});

	const [errorInputUpdateSubject, setErrorInputUpdateSubject] = useState({
		status: false,
		message: '',
	});

	const admin = {
		admin_id: 'namnguyen',
		fullname: 'Nguyễn Hoài Nam',
		gender: true,
		date_of_birth: '2003-01-01',
		citizen_identification: '930475892189',
		levels: 'Admin',
		address: 'Can Tho',
		phone: '1234567890',
		image: 'image1.png',
	};

  // *************** Subject AREA
  const [subject, setSubject] = useState({
    subjectId: "",
    adminId: admin.admin_id,
    subjectName: "",
  });

	// Form action area
	const handleChangeInput = (e) => {
		setSubject((prevSubject) => ({
			...prevSubject,
			[e.target.name]: e.target.value,
		}));
	};

	// API Area
	const fetchSubjects = async () => {
		try {
			const resp = await subjectApi.getAllSubject();
			setSubjects(resp);
			console.log('restarted application');
		} catch (error) {
			console.log(error);
		}
		// const resp = await axios(ROOT_URL);
		// console.log(resp.data);
	};

	// API_AREA > CRUD
	const handleCreateNewSubject = async () => {
		subject.subjectId = '';

    const action = "add";
    if (validateForm(action)) {
      try {
        const body = subject;
        const resp = await subjectApi.createSubject(body);
        console.log(resp);

        // Create SubjectHistory
        handleCreateNewSubjectHistory(subject, action);
      } catch (error) {
        console.log(error);
      }
      console.log("Add Success");

      fetchSubjects();
      setShowModal(false);
    } else console.log("Error in validation");
  };

	const handleUpdateSubject = async () => {
		console.log(subject);

    const action = "update";
    if (validateForm(action)) {
      try {
        const body = subject;
        const resp = await subjectApi.updateSubject(body, subject.subjectId);
        console.log(resp);

        // Add subjectHistory
        handleCreateNewSubjectHistory(subject, action);
      } catch (error) {
        console.log(error);
      }

      console.log("Update success");

      setShowModal(false);
      setIsUpdate(false);

      fetchSubjects();
      setSubject({
        subjectId: "",
        adminId: admin.admin_id,
        subjectName: "",
      });
    }
  };

	// Validation area
	const validateForm = (action) => {
		if (subject.subjectName.length === 0) {
			if (action === 'add') {
				setErrorInputAddSubject({
					status: true,
					message: 'Vui lòng nhập vào tên môn học',
				});
			} else {
				setErrorInputUpdateSubject({
					status: true,
					message: 'Vui lòng nhập vào tên môn học',
				});
			}
			return false;
		} else {
			setErrorInputAddSubject({
				status: false,
				message: '',
			});
			setErrorInputUpdateSubject({
				status: false,
				message: '',
			});
		}
		return true;
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
        size: 40,
      },
      {
        accessorKey: "adminId",
        header: "Mã người tạo",
        size: 80,
      },
      {
        accessorKey: "subjectName",
        header: "Tên Môn Học",
      },
    ],
    []
  );

  const columnSubjectHistory = useMemo(
    () => [
      {
        accessorKey: "subjectHistoryId",
        header: "History ID",
        size: 40,
      },
      {
        accessorKey: "subjectName",
        header: "Tên Môn Học",
      },
      {
        accessorKey: "modifyDate",
        header: "Ngày chỉnh sửa",
        size: 120,
      },
      {
        accessorKey: "adminId",
        header: "Mã người tạo",
        size: 80,
      },
    ],
    []
  );

  // *************** Header Button area
  const handleChangeSubjectListAndHistory = () => {
    setIsSubjectHistoryShowing(!isSubjectHistoryShowing);
  };

  // *************** Subject History AREA
  // Utils
  const convertToDateTime = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();
    let hour = currentDate.getHours();
    const minute = currentDate.getMinutes().toString().padStart(2, "0");
    const period = hour;

    // Convert hour from 24-hour format to 12-hour format
    hour = hour % 12 || 12;

    const formattedDateTime = `${day}-${month}-${year}, ${hour}:${minute}${period}`;

    return formattedDateTime;
  };

  const [subjectHistory] = useState({
    subjectHistoryId: "",
    action: "",
    modifyDate: convertToDateTime(),
    adminId: subject.adminId,
    subjectName: "",
    subjectId: "",
  });

  // API
  const fetchSubjectHistory = async () => {
    try {
      const resp = await subjectHistoryApi.getAllSubjectHistory();
      setSubjectHistories(resp);
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
      subjectHistory.action = action === "add" ? "Thêm mới" : "Cập nhật";

      const body = subjectHistory;
      console.log(body);
      // const resp = await subjectHistoryApi.createSubjectHistory(body);
      // console.log(resp);
    } catch (error) {
      console.log(error);
    }
    // fetchSubjectHistory();
  };

  // *************** Use effect area
  useEffect(() => {
    fetchSubjects();
    fetchSubjectHistory();
  }, []);

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
              {isSubjectHistoryShowing ? "Bảng lịch sử môn học" : "Bảng Môn học"}
            </h3>
            <Button
              color="default"
              type="button"
              onClick={() => handleChangeSubjectListAndHistory()}
            >
              {isSubjectHistoryShowing
                ? "Danh sách môn học"
                : "Lịch sử môn học"}
            </Button>
          </CardHeader>
          <CardBody>
            {/* Table view */}
            <MaterialReactTable
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  header: "Thao tác",
                  size: 20,
                  // Something else here
                },
              }}
              columns={
                isSubjectHistoryShowing ? columnSubjectHistory : columnSubject
              }
              data={isSubjectHistoryShowing ? subjectHistories : subjects}
              positionActionsColumn="last"
              editingMode="modal" //default
              enableColumnOrdering
              enableEditing
              enableColumnResizing
              renderRowActions={({ row }) =>
                !isSubjectHistoryShowing ? (
                  <div className="d-flex justify-content-start">
                    <Button
                      color="warning"
                      outline
                      onClick={() => {
                        setShowModal(true);
                        setSubject({ ...row.original });
                        setIsUpdate(true);
                      }}
                    >
                      <i className="bx bx-edit"></i>
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-start">
                    <Button
                      color="info"
                      outline
                      onClick={() => {
                        console.log("Restored Object");
                      }}
                    >
                      <i className="bx bx-revision"></i>
                    </Button>
                  </div>
                )
              }
              // Top Add new Subject button
              renderTopToolbarCustomActions={() => (
                <Button
                  color="primary"
                  onClick={() => setShowModal(true)}
                  variant="contained"
                  id="addSubjects"
                  disabled={isSubjectHistoryShowing}
                >
                  <i className="bx bx-layer-plus"></i> Thêm môn học
                </Button>
              )}
            />
          </CardBody>
        </Card>

				{/* Toast */}
				{/* <ToastContainer /> */}

        {/* Modal Add - Update Suject*/}
        <Modal
          className="modal-dialog-centered"
          isOpen={showModal}
          toggle={showModal}
          backdrop={"static"}
        >
          <div className="modal-header">
            <h3 className="modal-title" id="modal-title-default">
              {isUpdate ? "Cập nhật môn học" : "Thêm môn học mới"}
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
              {isUpdate && (
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
                  Mã Admin
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
                    errorInputUpdateSubject.status
                      ? "is-invalid"
                      : "form-control-alternative"
                  }`}
                  id="name"
                  onChange={handleChangeInput}
                  name="subjectName"
                  value={subject.subjectName}
                />
                <span className="text-danger">
                  {errorInputUpdateSubject.message}
                </span>
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
                setIsUpdate(false);
              }}
            >
              Trở lại
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={() => {
                isUpdate ? handleUpdateSubject() : handleCreateNewSubject();
                // toast("Cập nhật môn học thành công");
              }}
            >
              {isUpdate ? "Cập nhật" : "Thêm môn học"}
            </Button>
          </div>
        </Modal>
      </Container>
      {/* Page content end */}
    </>
  );
};

export default Subjects;
