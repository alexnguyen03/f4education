import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  LoadingOverlay,
  Group,
  Grid,
} from "@mantine/core";
import { Search as SearchIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

import courseApi from "api/courseApi";
const IMG_URL = "/courses/";

function CourseRegisterDetailClient() {
  const [visible, setVisible] = useState(true);
  const [course, setCourse] = useState({
    courseId: 0,
    courseName: "",
    courseDuration: 100,
    coursePrice: 6000000,
    courseDescription: "",
    image: "",
    subject: {
      subjectId: 0,
      subjectName: "",
      admin: {
        adminId: "",
        fullname: "",
        gender: true,
        dateOfBirth: "",
        citizenIdentification: "",
        address: "",
        phone: "",
        image: "",
      },
    },
  });

  // lấy tất cả các khóa học
  const getCourseById = async (courseId) => {
    try {
      const resp = await courseApi.findCourseById(courseId);
      setCourse(resp);
      console.log(resp);
      setVisible(false);
    } catch (error) {
      console.log("GetAllCourse", error);
    }
  };

  const data = useParams();

  useEffect(() => {
    if (course.length > 0) return;
    getCourseById(data.courseId);
  }, []);

  return (
    <>
      <div className="col-lg-12 mt-7">
        <h1 className="my-3" style={{ color: "#525f7f", fontWeight: "bold" }}>
          Chi tiết khóa học đã đăng ký
        </h1>
        <Grid
          style={{ border: "1px solid rgba(0,0,0,.125)", borderRadius: "10px" }}
        >
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            color="rgba(46, 46, 46, 1)"
            size={50}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Grid.Col span={4} p={30}>
            <Image
              style={{ borderRadius: "5%", overflow: "hidden" }}
              src={process.env.REACT_APP_IMAGE_URL + IMG_URL + course.image}
              height={200}
              alt="Norway"
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Text fw={700} size={30} mt={10}>
              {course.courseName}
            </Text>
            <span class="text-muted">
              Chủ đề: <b>{course.subject.subjectName}</b>
            </span>
            <Badge
              className="p-0 ml-5"
              size="lg"
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
            <Text size="md" c="dimmed" mt={5}>
              {course.courseDescription}
            </Text>
          </Grid.Col>
          <Grid.Col span={12} px={30}>
            <span>
              <b>0</b> trong <b>10</b> bài học đã hoàn thành
            </span>
            <span className="h2 float-right">0%</span>
            <div class="progress mt-3">
              <div
                class="progress-bar bg-success"
                role="progressbar"
                style={{ width: "25%" }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
}

export default CourseRegisterDetailClient;
