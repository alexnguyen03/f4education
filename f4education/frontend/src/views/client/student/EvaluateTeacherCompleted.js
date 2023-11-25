import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Container,
    Group,
    Image,
    Paper,
    Radio,
    Text,
    Title
} from '@mantine/core'
import { IconAlertCircle, IconNotes } from '@tabler/icons-react'
import evaluateApi from '../../../api/evaluateApi'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EvaluateTeacherCompleted = () => {
    const navigate = useNavigate()

    const renderCompleteCard = () => {
        return (
            <Paper shadow="xs" p="md" mt={'md'}>
                <Center mb={'md'}>
                    <Title order={3}>
                        Cảm ơn bạn đã hoàn thành đánh giá giảng viên!
                    </Title>{' '}
                </Center>
                <Center>
                    <Button
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                        onClick={() => {
                            navigate('/student/classes')
                        }}
                    >
                        Quay về lớp học
                    </Button>
                </Center>
            </Paper>
        )
    }
    return <Container mt={'md'}>{renderCompleteCard()}</Container>
}

export default EvaluateTeacherCompleted
