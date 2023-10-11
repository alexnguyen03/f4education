import React, { useState, useEffect } from "react";
import { Card, Text, Badge, Button, Loader, Grid } from "@mantine/core";
import { Search as SearchIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

import courseApi from "api/courseApi";
const IMG_URL = "/courses/";

function CourseRegisterClient() {
  const [courses, setCourses] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [isLoading, setLoading] = useState(true);

  // lấy tất cả các khóa học
  const getAllCourseByAccountId = async () => {
    try {
      const resp = await courseApi.findCoursesByAccountId(4);
      setCourses(resp.reverse());
      setLoading(false);
    } catch (error) {
      console.log("GetAllCourse", error);
    }
  };

  const searchCourses = courses.filter((course) => {
    const courseValues = Object.values(course);
    const subjectName = course.subject.subjectName.toLowerCase();
    for (let i = 0; i < courseValues.length; i++) {
      const value = courseValues[i];
      if (
        typeof value === "string" &&
        value.toLowerCase().includes(searchItem.toLowerCase())
      ) {
        return value.toLowerCase().includes(searchItem.toLowerCase());
      }
      if (typeof value === "number" && value.toString() === searchItem) {
        return value.toString() === searchItem;
      }
      if (subjectName.toLowerCase().includes(searchItem.toLowerCase())) {
        return subjectName.toLowerCase().includes(searchItem.toLowerCase());
      }
    }
    return false;
  });

  useEffect(() => {
    if (courses.length > 0) return;
    getAllCourseByAccountId();
  }, []);

  return (
    <>
      <div className="col-lg-12 mt-7">
        <div
          className="col-lg-3 searchCourse mt-5 mb-5"
          style={{
            border: "1px solid #282a354d",
            borderRadius: "25px",
            background: "#fff",
            width: "400px",
          }}
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </div>
            <input
              style={{ border: "none" }}
              class="form-control"
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              placeholder="Tìm khóa học"
            />
          </div>
        </div>
        <h2 className="mb-3">Danh sách khóa học đã đăng ký</h2>
        <Grid>
          {isLoading ? (
            <Loader color="rgba(46, 46, 46, 1)" size={50} style={{ marginLeft: "50%" }} />
          ) : (
            searchCourses.map((course) => (
              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <img
                      src={
                        process.env.REACT_APP_IMAGE_URL + IMG_URL + course.image
                      }
                      style={{ width: "100%", height: "250px" }}
                      className="img-fluid"
                      alt="Course"
                    />
                  </Card.Section>
                  <Text fw={600} size={20} mt={10}>
                    {course.courseName}
                  </Text>
                  <span class="text-muted small">
                    Chủ đề: <b>{course.subject.subjectName}</b>
                  </span>
                  <Badge
                    className="p-0 ml-3"
                    size="md"
                    color="pink"
                    variant="light"
                    mb={5}
                  >
                    Thời lượng: {course.courseDuration} (giờ)
                  </Badge>
                  <br />
                  <b>
                    Giá: {course.coursePrice}
                    <u>đ</u>
                  </b>
                  <Text size="sm" c="dimmed" mt={5}>
                    {course.courseDescription}
                  </Text>
                  <Link to={`/course-register-detail/${course.courseId}`}>
                    <Button
                      variant="light"
                      color="blue"
                      fullWidth
                      mt="md"
                      radius="md"
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </Card>
              </Grid.Col>
            ))
          )}
          {/* {searchCourses.map((course) => (
            <Grid.Col span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                <img
                      src={
                        process.env.REACT_APP_IMAGE_URL + IMG_URL + course.image
                      }
                      style={{width: "100%", height: "250px" }}
                      className="img-fluid"
                      alt="Course"
                    />
                </Card.Section>
                <Text fw={600} size={20} mt={10}>
                  {course.courseName}
                </Text>
                <span class="text-muted small">
                  Chủ đề: <b>{course.subject.subjectName}</b>
                </span>
                <Badge
                  className="p-0 ml-3"
                  size="md"
                  color="pink"
                  variant="light"
                  mb={5}
                >
                  Thời lượng: {course.courseDuration} (giờ)
                </Badge>
                <br />
                <b>
                  Giá: {course.coursePrice}
                  <u>đ</u>
                </b>
                <Text size="sm" c="dimmed" mt={5}>
                  {course.courseDescription}
                </Text>
                <Link to={`/course-register-detail/${course.courseId}`}>
                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                  >
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>
            </Grid.Col>
          ))} */}
        </Grid>
      </div>
    </>
  );
}

export default CourseRegisterClient;
