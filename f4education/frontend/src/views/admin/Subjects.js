import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import SubjectHeader from "components/Headers/SubjectHeader";
import { MaterialReactTable } from "material-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Input,
  Label,
  Modal,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

// Stoatify component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const data = [
  { id: "JAVABS", name: "Java cơ bản", adminId: "nam257" },
  { id: "JAVAAV", name: "Java nâng cap", adminId: "duong038" },
  { id: "WEB201", name: "Kiểm thử", adminId: "hien082" },
  { id: "WEB104", name: "AngularJS ang Bootstrap ", adminId: "loi018" },
];

const Subjects = (props) => {
  // Main variable
  const [subjects, setSubjects] = useState(data);

  // Action variable
  const [showModal, setShowModal] = useState(false);

  // Material React Table
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [validationErrors, setValidationErrors] = useState({});

  // Form avariable
  const [subject, setSubject] = useState({
    id: "",
    adminId: "",
    name: "",
  });

  const handleChangeInput = (e) => {
    setSubject((prevSubject) => ({
      ...prevSubject,
      [e.target.name]: e.target.value,
    }));
  };

  // Material Area
  const handleCreateNewRow = (values) => {
    subjects.push(values);
    setSubjects([...subjects]);
  };

  const handleUpdateRow = () => {
    console.log(subject);
    const newSubjects = [...subjects];

    const subjectIndex = newSubjects.findIndex((sb) => sb.id === subject.id);

    console.log(subjectIndex);

    if (subjectIndex !== -1) {
      newSubjects[subjectIndex] = subject;

      setSubjects(newSubjects);
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      subject[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setSubject([...subject]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 10,
      },
      {
        accessorKey: "adminId",
        header: "Admin ID",
        size: 10,
      },
      {
        accessorKey: "name",
        header: "Tên Môn Học",
      },
    ],
    []
  );

  // Form Area

  return (
    <>
      {/* HeaderSubject start */}
      <SubjectHeader />
      {/* HeaderSubject End */}

      {/* Page content */}
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h3 className="mb-0">Bảng Môn học</h3>
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
              columns={columns}
              data={subjects}
              editingMode="modal" //default
              enableColumnOrdering
              enableEditing
              onEditingRowSave={handleSaveRowEdits}
              onEditingRowCancel={handleCancelRowEdits}
              positionActionsColumn="last"
              renderRowActions={({ row }) => (
                <div className="d-flex justify-content-start">
                  <Button
                    color="warning"
                    outline
                    onClick={() => {
                      setShowModal(true);
                      setSubject({ ...row.original });
                    }}
                  >
                    <i className="bx bx-edit"></i>
                  </Button>
                </div>
              )}
              renderTopToolbarCustomActions={() => (
                <Button
                  color="primary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                  data-placement="top"
                  id="addSubjects"
                >
                  <i className="bx bx-layer-plus"></i> Thêm môn học
                </Button>
              )}
            />
            <UncontrolledTooltip delay={0} placement="top" target="addSubjects">
              Thêm môn học
            </UncontrolledTooltip>

            {/* Add new Subject */}
            <CreateNewAccountModal
              columns={columns}
              open={createModalOpen}
              onClose={() => setCreateModalOpen(false)}
              onSubmit={handleCreateNewRow}
            />
          </CardBody>
        </Card>

        {/* Toast */}
        <ToastContainer />

        {/* Modal */}
        <Modal
          className="modal-dialog-centered"
          isOpen={showModal}
          toggle={showModal}
        >
          <div className="modal-header">
            <h3 className="modal-title" id="modal-title-default">
              Cập nhật môn học
            </h3>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setShowModal(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <form method="post">
              <FormGroup className="mb-3">
                <label className="form-control-label" htmlFor="id">
                  Mã môn học
                </label>
                <Input
                  className="form-control-alternative"
                  id="id"
                  onChange={handleChangeInput}
                  name="id"
                  value={subject.id}
                />
              </FormGroup>
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
                  className="form-control-alternative"
                  id="name"
                  onChange={handleChangeInput}
                  name="name"
                  value={subject.name}
                />
              </FormGroup>
            </form>
          </div>
          <div className="modal-footer">
            <Button
              color="default"
              outline
              data-dismiss="modal"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Trở lại
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={() => {
                handleUpdateRow();
                toast("Cập nhật môn học thành công");
                setShowModal(false);
              }}
            >
              Cập nhật
            </Button>
          </div>
        </Modal>
      </Container>
    </>
  );
};

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="left">Tạo môn học mới</DialogTitle>
      <DialogContent>
        <hr className="p-0 m-0 mb-5" />
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => (
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor={column.accessorKey}
                >
                  {column.header}
                </label>
                <Input
                  className="form-control-alternative"
                  disabled={column.accessorKey === "adminId"}
                  key={column.id}
                  id={column.accessorKey}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              </FormGroup>
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button color="default" outline onClick={onClose}>
          Thoát
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleSubmit();
            toast("Thêm môn học thành công");
          }}
          variant="contained"
        >
          Tạo môn học mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Subjects;
