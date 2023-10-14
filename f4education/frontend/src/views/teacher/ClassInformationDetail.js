import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { ButtonGroup } from "@material-ui/core";
import { MaterialReactTable } from "material-react-table";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

// scss
import styles from "../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss";

const classes = {
  classId: 1,
  className: "101",
  courseName: "RestAPI bb",
  startDate: "1/1/2021",
  endDate: "2/2/2022",
  status: "Đang hoạt động",
  numberStudent: 30,
};

const students = {
  studentId: 1,
  fullName: "Tran Van An",
  studentImg: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
};

const ClassInformationDetail = () => {
  const data = useParams();
  let navigate = useNavigate();
  //   console.log(data.classId);

  const redirectTo = () => {
    return navigate("/teacher/classes-infor");
  };

  const columnStudent = useMemo(
    () => [
      {
        accessorKey: "studentId",
        header: "Mã sinh viên",
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 20,
      },
      {
        accessorKey: "fullName",
        header: "Tên Sinh viên",
        size: 80,
      },
      {
        accessorKey: "studentImg",
        header: "Hình ảnh",
        size: 50,
      },
      {
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          return (
            <ButtonGroup>
              <Button variant="default" color="green">
                Có mặt
              </Button>
              <Button variant="default" color="red">
                Vắng
              </Button>
            </ButtonGroup>
          );
        },
        header: "Có / Vắng",
        size: 80,
      },
    ],
    []
  );

  return (
    <>
        {/* Header */}
      <Box mb={"md"} className={styles["box-header"]}>
        <Group position="apart">
          <Title order={3} color="dark">
            Chi tiết lớp học: {data.classId}
          </Title>
          <Box>
            <Text color="dark">Tổng sinh viên: 40</Text>
          </Box>
        </Group>
      </Box>

      <Grid>
        {/* Left side */}
        <Grid.Col xl={3} lg={3}>
          <Box className={styles["box-header"]}>
            <Card padding="xl" radius="md" className={classes.card}>
              <Card.Section
                h={140}
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)",
                }}
              />
              <Avatar
                src="https://th.bing.com/th/id/OIP.0MP14fOr1ykZDCnNZ5grFwHaGZ?pid=ImgDet&rs=1"
                size={80}
                radius={80}
                mx="auto"
                mt={-30}
                className={classes.avatar}
              />
              <Text ta="center" fz="lg" fw={500} mt="sm" align="center">
                {classes.className}
              </Text>
              <Text ta="center" fz="sm" c="dimmed" align="center">
                {classes.courseName}
              </Text>
              <Text c="dimmed" mt="md" align="center" gap={30}>
                Từ ngày {classes.startDate} - {classes.endDate}
              </Text>
              <Button
                fullWidth
                radius="md"
                mt="xl"
                size="md"
                variant="default"
                onClick={() => redirectTo()}
              >
                Trở về
              </Button>
            </Card>
          </Box>
        </Grid.Col>

        {/* Right side */}
        <Grid.Col xl={9} lg={9}>
          <Box className={styles["box-header"]}>
            <Button color="grape" size="md" mb="lg">
              Lưu điểm danh
            </Button>

            <MaterialReactTable
              muiTableBodyProps={{
                sx: {
                  "& tr:nth-of-type(odd)": {
                    backgroundColor: "#f5f5f5",
                  },
                },
              }}
              enableRowNumbers
              columns={columnStudent}
              data={students}
              initialState={{
                columnVisibility: { studentId: false },
              }}
              enableColumnOrdering
              enableStickyHeader
              enableStickyFooter
              displayColumnDefOptions={{
                "mrt-row-numbers": {
                  size: 5,
                },
              }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [10, 20, 50, 100],
                showFirstButton: true,
                showLastButton: true,
              }}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default ClassInformationDetail;
