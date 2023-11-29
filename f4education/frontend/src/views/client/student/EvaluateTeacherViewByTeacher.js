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
    Space,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { IconAlertCircle, IconNotes } from '@tabler/icons-react'
import evaluateApi from '../../../api/evaluateApi'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
const EvaluateTeacherViewByTeacher = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    const [dataArray, setDataArray] = useState([
        {
            title: 'Giảng viên có khuyến khích sáng tạo và tư duy độc lập từ học viên',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Không có, không bao giờ nhắc đến'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Có, rất khuyết khích'
                }
            ]
        },
        {
            title: 'Nội dung và phương pháp giảng dạy',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Rất không tốt'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Không tốt'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Tốt'
                },
                {
                    value: 4,
                    totalVoteItem: 0,
                    label: 'Xuất sắc'
                }
            ]
        },
        {
            title: 'Sự công bằng của giảng viên trong kiểm tra đánh giá quá trình và đánh giá kết quả học tập',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Rất không công bằng'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Đôi lúc còn thiên vị'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Rất công bằng'
                }
            ]
        },
        {
            title: 'Thời gian giảng dạy của giảng viên',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: ' Rất hay trễ giờ'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Nhiều lần trễ giờ'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Trễ giờ 1 vài lần'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Luôn đi đúng giờ'
                }
            ]
        }
    ])

    const getEvaluationTeacherId = async () => {
        try {
            console.log(
                '🚀 ~ file: EvaluateTeacherViewByTeacher.js:112 ~ getEvaluationTeacherId ~ user.username:',
                user.username
            )
            const resp = await evaluateApi.getEvaluationTeacherId(user.username)
            console.log(
                '🚀 ~ file: EvaluateTeacherViewByTeacher.js:115 ~ getEvaluationTeacherId ~ resp:',
                resp
            )
            const updatedData = resp.data.map((item1) => {
                const foundItem = dataArray.find(
                    (item2) => item2.title === item1.title
                )
                console.log(
                    '🚀 ~ file: EvaluateTeacherViewByTeacher.js:142 ~ updatedData ~ foundItem:',
                    foundItem
                )

                if (foundItem) {
                    const updatedOptions = foundItem.options.map((option) => {
                        if (option.value === item1.value) {
                            console.log(item1.voteCount)
                            return {
                                ...option,
                                totalVoteItem: item1.voteCount
                            }
                        }
                        return option
                    })

                    return {
                        ...foundItem,
                        totalVote: foundItem.totalVote + item1.voteCount,
                        options: updatedOptions
                    }
                }
                return item1
            })
            console.log(
                '🚀 ~ file: EvaluateTeacherViewByTeacher.js:167 ~ updatedData ~ updatedData:',
                updatedData
            )

            const groupedByTitle = updatedData.reduce((acc, obj) => {
                const key = obj.title
                if (!acc[key]) {
                    acc[key] = {
                        title: obj.title,
                        totalVote: 0,
                        options: []
                    }
                }

                acc[key].totalVote += obj.totalVote

                obj.options.forEach((opt) => {
                    const existingOption = acc[key].options.find(
                        (o) => o.value === opt.value
                    )
                    if (existingOption) {
                        existingOption.totalVoteItem += opt.totalVoteItem
                    } else {
                        acc[key].options.push({
                            value: opt.value,
                            totalVoteItem: opt.totalVoteItem,
                            label: opt.label
                        })
                    }
                })

                return acc
            }, {})

            const result = Object.values(groupedByTitle)

            console.log(result)

            setDataArray(result)
            // In ra kết quả sau khi đã cập nhật
        } catch (error) {
            console.log(
                '🚀 ~ file: EvaluateTeacherViewByTeacher.js:113 ~ getEvaluationTeacherId ~ error:',
                error
            )
        }
    }

    const renderEvaluationTeacher = () => {
        return dataArray.map((item, index) => (
            <Paper shadow="lg" p="md" mb={'lg'} key={index}>
                <Box>
                    <Title order={3}> {item.title}</Title>
                </Box>
                <Space h="xl" />
                <Group grow position="center">
                    {item.options.map((subItem, subIndex) => {
                        var color = 'red'

                        switch (subItem.value) {
                            case 1:
                                color = 'yellow'
                                break
                            case 2:
                                color = 'gray'
                                break
                            case 3:
                                color = 'cyan'
                                break
                            case 4:
                                color = 'green'
                                break

                            default:
                                color = 'red'
                                break
                        }
                        return (
                            <Alert
                                key={index}
                                icon={<IconAlertCircle size="1rem" />}
                                title={subItem.label}
                                color={color}
                            >
                                <Group>
                                    <Title order={4}>
                                        {subItem.totalVoteItem} Đánh giá - Chiếm{' '}
                                        {subItem.totalVoteItem *
                                            (100 / item.totalVote).toFixed(
                                                2
                                            )}{' '}
                                        %
                                    </Title>
                                </Group>
                            </Alert>
                        )
                    })}
                </Group>
            </Paper>
        ))
    }
    useEffect(() => {
        getEvaluationTeacherId()
    }, [])
    return (
        <Container fluid mt={'md'}>
            <Center>
                <Title order={2}>Thông tin nhận xét giảng viên</Title>
            </Center>
            {renderEvaluationTeacher()}
        </Container>
    )
}
export default EvaluateTeacherViewByTeacher
