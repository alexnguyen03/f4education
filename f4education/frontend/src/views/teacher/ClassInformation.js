import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Input,
  MediaQuery,
  Paper,
  rem,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconColorSwatch, IconFilterSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// scss
import styles from "../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss";

const listClass = [
  {
    classId: 1,
    className: "101",
    courseName:
      "RestAPI aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa eeeeeeeeeeeeeeeeeeeeeeee bbbbbbbbbbbbbbbbbbbbb",
    startDate: "1/1/2021",
    endDate: "2/2/2022",
    status: "Đang hoạt động",
    numberStudent: 30,
  },
  {
    classId: 2,
    className: "102",
    courseName: "AngularJS",
    startDate: "5/6/2021",
    endDate: "2/2/2022",
    status: "Nghĩ",
    numberStudent: 40,
  },
];

const ClassInformation = () => {
  // ********** Main Variable

  // ********** Action Variable
  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();

  // ********** Action
  const handleChangeSearchClass = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigateToClassInformationDetail = (classId) => {
    navigate("/teacher/classes-infor/" + classId);
  };

  const filteredClasses = listClass.filter((item) => {
    const { className, startDate, endDate, courseName } = item;
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      className.toLowerCase().includes(lowerSearchTerm) ||
      courseName.toLowerCase().includes(lowerSearchTerm) ||
      startDate.includes(lowerSearchTerm) ||
      endDate.includes(lowerSearchTerm)
    );
  });

  // ************** Render UI
  const classInformationList = filteredClasses.map((c) => (
    <Grid.Col span={4} key={c.classId}>
      <Paper
        withBorder
        radius="md"
        className={styles.card}
        onClick={() => navigateToClassInformationDetail(c.classId)}
      >
        <Flex justify={"space-between"} align="center">
          <ThemeIcon
            size="xl"
            radius="md"
            variant="gradient"
            gradient={{ deg: 0, from: "pink", to: "purple" }}
          >
            <IconColorSwatch
              style={{ width: rem(28), height: rem(28) }}
              stroke={1.5}
            />
          </ThemeIcon>
          <Tooltip label="Tổng số sinh viên" position="top">
            <Alert title={c.numberStudent} color="indigo"></Alert>
          </Tooltip>
        </Flex>
        <Text size="xl" fw={500} mt="md">
          Tên Lớp: {c.className}
        </Text>
        <Text size="md" mt="sm" c="dimmed" lineClamp={2}>
          Khóa học: {c.courseName}
        </Text>
        <Text size="md" mt="sm" c="dimmed">
          Thời gian dạy: {c.startDate} - {c.endDate}
        </Text>
      </Paper>
    </Grid.Col>
  ));

  return (
    <>
      <Box className={styles.box} p={rem("2rem")}>
        {/* Header section */}
        <Group position="apart" mb="xl">
          <Title order={2} fw={700} color="dark">
            Danh sách lớp học
          </Title>
          <MediaQuery query="max-width: (780px)" styles={{ width: "100%" }}>
            <Group position="right">
              <Input
                id="search-input"
                icon={<IconFilterSearch />}
                withAsterisk
                size="md"
                placeholder="Tìm lớp học"
                onChange={(e) => handleChangeSearchClass(e)}
              />
              <Button color="grape" size="md">
                Tìm kiếm
              </Button>
            </Group>
          </MediaQuery>
        </Group>

        <Grid gutter="md">
          {/* Item - Templates one */}
          {/* <Grid.Col>
            <Card withBorder padding="md">
              <Group position="apart">
                <Box>
                  <Group>
                    <Text fz="md" color="dimmed">
                      Lớp học:
                    </Text>
                    <Title order={5} fz="lg" fw={500} color="dark">
                      101
                    </Title>
                    <Text fz="md" color="dimmed" ml={5}>
                      Tổng sinh viên:
                    </Text>
                    <Title order={5} fz="lg" fw={500} color="dark">
                      40
                    </Title>
                  </Group>
                  <Group>
                    <Text fz="md" color="dimmed">
                      Môn dạy:
                    </Text>
                    <Title order={5} fz="lg" fw={500} color="dark">
                      Spring Boot 3.0 Rest api
                    </Title>
                  </Group>
                  <Group>
                    <Text color="dimmed" fz="md">
                      Hoạt động từ:
                    </Text>
                    <Text color="dark" fz="md">
                      17/20/2023 - 20/10/2023
                    </Text>
                  </Group>
                </Box>
                <Flex justify="end" align="center">
                  <Badge color="grape" size="lg">
                    Đang hoạt động
                  </Badge>
                </Flex>
              </Group>
            </Card>
          </Grid.Col> */}

          {/* List Class */}
          {classInformationList}
        </Grid>
      </Box>
    </>
  );
};

export default ClassInformation;
