import { Badge, Card, Grid, Image, Text } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import StarIcon from '@mui/icons-material/Star'
import classnames from 'classnames'
import {
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col
} from 'reactstrap'
import { BorderColor } from '@mui/icons-material'

import courseApi from 'api/courseApi'
import subjectApi from 'api/subjectApi'
const IMG_URL = '/courses/'

function CourseDetailClient() {
    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])

    // lấy tất cả các khóa học
    const getAllCourse = async () => {
        try {
            const resp = await courseApi.getAll()
            setCourses(resp.reverse())
        } catch (error) {
            console.log('GetAllCourse', error)
        }
    }

    // lấy tất cả các môn học
    const getAllSubject = async () => {
        try {
            const resp = await subjectApi.getAllSubject()
            setSubjects(resp)
        } catch (error) {
            console.log('GetAllSubject', error)
        }
    }

    const handleRegistration = (course) => {
        // Lưu thông tin khóa học vào state
        console.log(course)
        // Thực hiện các thao tác khác tại đây
    }

    useEffect(() => {
        if (courses.length > 0) return
        getAllCourse()
        getAllSubject()
    }, [])

    return (
        <>
            <h1>Trang chi tiết sản phẩm</h1>
        </>
    )
}

export default CourseDetailClient
