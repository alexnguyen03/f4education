import {
  Alert,
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Input,
  MediaQuery,
  Paper,
  rem,
  Skeleton,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconColorSwatch, IconFilterSearch } from "@tabler/icons-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// API
import classApi from "../../api/classApi";

// scss
import styles from "../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss";

const teacherId = "nguyenhoainam121nTC";

const ClassInformation = () => {
  // ********** Param Variable
  let navigate = useNavigate();

  // ********** Main Variable
  const [listClasses, setListClasses] = useState([]);

  // ********** Action Variable
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //  ******** Fetch AREA
  const fetchClassByTeacher = async () => {
    try {
      setLoading(true);
      const resp = await classApi.getAllClassByTeacherId(teacherId);
      if (resp.status === 200 && resp.data.length > 0) {
        setListClasses(resp.data.reverse());
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClassByTeacher();
  }, []);

  // ********** Action
  const handleChangeSearchClass = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigateToClassInformationDetail = (classId) => {
    navigate("/teacher/classes-infor/" + classId);
  };

  const filteredClasses = listClasses.filter((item) => {
    const className = item.classes.className;
    const startDate = item.classes.startDate;
    const endDate = item.classes.endDate;
    const courseName = item.courseName[0];

    // console.log(className, startDate, endDate, courseName);

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
    <Grid.Col span={4} key={c.classes.classId} >
      {loading ? (
        <>
          <Skeleton
            radius={"sm"}
            mb="lg"
            mt="md"
            width={rem("3rem")}
            height={rem("3rem")}
          />
          <Skeleton width={"100%"} height={rem("2rem")} mb="sm" />
          <Skeleton width={"100%"} height={rem("1rem")} mb="sm" />
          <Skeleton width={"100%"} height={rem("1rem")} mb="sm" />
        </>
      ) : (
        <>
          <Paper
            withBorder
            radius="md"
            p={0}
            className={styles.card}
            onClick={() => navigateToClassInformationDetail(c.classes.classId)}
          >
            <Flex justify={"space-between"} align="center" mt="md">
              <ThemeIcon
                size="xl"
                radius="md"
                variant="gradient"
                gradient={{ deg: 0, from: "pink", to: "violet" }}
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
            <Title order={3} fw={500} mt="md">
              Tên Lớp: {c.classes.className}
            </Title>
            <Text size="lg" mt="sm" c="dimmed" lineClamp={2}>
              Khóa học: {c.courseName}
            </Text>
            <Text size="lg" mt="sm" c="dimmed">
              Thời gian dạy: {moment(c.classes.startDate).format("DD/mm/yyyy")}{" "}
              - {moment(c.classes.endDate).format("DD/mm/yyyy")}
            </Text>
          </Paper>
        </>
      )}
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
                size="md"
                placeholder="Tìm lớp học"
                onChange={(e) => handleChangeSearchClass(e)}
              />
              <Button color="violet" size="md">
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
