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
import { useCallback, useMemo, useState } from "react";

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

const Subjects = (props) => {
  const [isShowToast, setIsShowToast] = useState(false);

  const data = [
    { id: "JAVABS", name: "Java cơ bản", adminId: "nam257" },
    { id: "JAVAAV", name: "Java nâng cap", adminId: "duong038" },
    { id: "WEB201", name: "Kiểm thử", adminId: "hien082" },
    { id: "WEB104", name: "AngularJS ang Bootstrap ", adminId: "loi018" },
  ];

  // Material React Table
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback();

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID môn học",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: "adminId",
        header: "Tên admin",
        size: 30,
      },
      {
        accessorKey: "name",
        header: "Tên môn học",
        size: 150,
      },
    ],
    []
  );

  return (
    <>
      {/* HeaderSubject start */}
      <SubjectHeader />
      {/* HeaderSubject End */}

      {/* Page content */}
      <Container className="mt-7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h3 className="mb-0">Bảng Môn học</h3>
          </CardHeader>
          <CardBody>
            {/* Table view */}
            <MaterialReactTable
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  muiTableHeadCellProps: {
                    align: "center",
                  },
                },
              }}
              columns={columns}
              data={tableData}
              editingMode="modal" //default
              enableColumnOrdering
              enableEditing
              onEditingRowSave={handleSaveRowEdits}
              onEditingRowCancel={handleCancelRowEdits}
              renderRowActions={({ row, table }) => (
                <div className="d-flex justify-content-center align-content-center">
                  <Button
                    color="warning"
                    outline
                    onClick={() => table.setEditingRow(row)}
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
        <div
          className="toast auto-hide bg-white position-fixed right-0 p-3"
          style={{ zIndex: 100, top: "100px", minWidth: "300px" }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <i className="bx bx-notification"></i>
            <strong className="ml-1">Hệ thống!</strong>
            <button
              type="button"
              className="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <hr className="m-0 p-0 mb-2" />
          <div className="toast-body bg-secondary">Ngủ đi khuya gòi.</div>
        </div>
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
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Tạo môn học mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Subjects;
