import React, { useState, useEffect } from 'react'
import { Card, Text, Badge, Stack, Title, Loader, Grid } from '@mantine/core'
import { Search as SearchIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'

import courseApi from 'api/courseApi'
const IMG_URL = '/courses/'

function CourseRegisterClient() {
    const [courses, setCourses] = useState([])
    const [searchItem, setSearchItem] = useState('')
    const [isLoading, setLoading] = useState(true)

    // lấy tất cả các khóa học
    const getAllCourseByAccountId = async () => {
        try {
            setLoading(true)
            const resp = await courseApi.findCoursesByStudenttId('1')
            if (resp.status === 200 && resp.data.length > 0) {
                setCourses(resp.data.reverse())
                setLoading(false)
            }
        } catch (error) {
            console.log('GetAllCourse', error)
        }
    }

    const searchCourses = courses.filter((course) => {
        const courseValues = Object.values(course)
        const subjectName = course.subject.subjectName.toLowerCase()
        for (let i = 0; i < courseValues.length; i++) {
            const value = courseValues[i]
            if (
                typeof value === 'string' &&
                value.toLowerCase().includes(searchItem.toLowerCase())
            ) {
                return value.toLowerCase().includes(searchItem.toLowerCase())
            }
            if (typeof value === 'number' && value.toString() === searchItem) {
                return value.toString() === searchItem
            }
            if (subjectName.toLowerCase().includes(searchItem.toLowerCase())) {
                return subjectName
                    .toLowerCase()
                    .includes(searchItem.toLowerCase())
            }
        }
        return false
    })

    useEffect(() => {
        if (courses.length > 0) return
        getAllCourseByAccountId()
    }, [])

    return (
        <>
            <div className="col-lg-12 mt-7">
                <div
                    className="col-lg-3 searchCourse mt-5 my-3"
                    style={{
                        border: '1px solid #282a354d',
                        borderRadius: '25px',
                        background: '#fff',
                        width: '400px'
                    }}
                >
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </div>
                        <input
                            style={{ border: 'none' }}
                            class="form-control"
                            type="text"
                            value={searchItem}
                            onChange={(e) => setSearchItem(e.target.value)}
                            placeholder="Tìm khóa học"
                        />
                    </div>
                </div>
                <h1 className="mb-3 text-dark">
                    Danh sách khóa học đã đăng ký đang chờ xếp lớp
                </h1>
                <Grid>
                    {isLoading ? (
                        <>
                            <Stack mt={100} mx="auto" align="center">
                                <Title order={2} color="dark">
                                    <Loader color="rgba(46, 46, 46, 1)" />
                                </Title>
                                <Text c="dimmed" fz="lg">
                                    Vui lòng chờ trong giây lát...
                                </Text>
                            </Stack>
                        </>
                    ) : (
                        searchCourses.map((course) => (
                            <Grid.Col span={4}>
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Card.Section>
                                        <img
                                            src={
                                                process.env
                                                    .REACT_APP_IMAGE_URL +
                                                IMG_URL +
                                                course.image
                                            }
                                            style={{
                                                width: '100%',
                                                height: '250px'
                                            }}
                                            className="img-fluid"
                                            alt="Course"
                                        />
                                    </Card.Section>
                                    <Text fw={600} size={20} mt={10} mb={5}>
                                        {course.courseName}
                                    </Text>
                                    <span class="text-dark">
                                        Chủ đề:{' '}
                                        <b>{course.subject.subjectName}</b>
                                    </span>
                                    <Badge
                                        className="p-0 ml-3"
                                        size="lg"
                                        color="pink"
                                        variant="light"
                                        mb={3}
                                    >
                                        Thời lượng: {course.courseDuration}{' '}
                                        (giờ)
                                    </Badge>
                                    <br />
                                    <b>
                                        Giá: {course.coursePrice}
                                        <u>đ</u>
                                    </b>
                                    <p class="text-dark mt-1 font-weight-normal mb-0">
                                        Nội dung: {course.courseDescription}
                                    </p>
                                </Card>
                            </Grid.Col>
                        ))
                    )}
                </Grid>
            </div>
        </>
    )
}

export default CourseRegisterClient
