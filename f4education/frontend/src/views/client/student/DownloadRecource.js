import {
    Badge,
    Box,
    Button,
    Card,
    Center,
    Chip,
    Container,
    Divider,
    Group,
    Image,
    Indicator,
    Loader,
    LoadingOverlay,
    Overlay,
    Tabs,
    Text
} from '@mantine/core'
import resourceApi from '../../../api/resourceApi'
import React, { useState } from 'react'
import { useEffect } from 'react'

function DownloadRecource({ courseName }) {
    const [recource, setRecource] = useState([{ id: '', name: '', type: '' }])
    const [selectedRecourceIds, setSelectedRecourceIds] = useState([])
    const [loadingDownload, setLoadingDownload] = useState(false)
    const [loadingDownloadAll, setLoadingDownloadAll] = useState(false)
    const [loadingResource, setLoadingResource] = useState(false)
    const getAllFileByCourseName = async () => {
        try {
            setLoadingResource(true)
            //! fixed course name
            const resp = await resourceApi.getAllFileByCourseName(courseName)
            console.log(
                '🚀 ~ file: DownloadRecource.js:34 ~ getAllFileByCourseName ~ courseName:',
                courseName
            )
            console.log(
                '🚀 ~ file: DownloadRecource.js:12 ~ getAllFileByCourseName ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setLoadingResource(false)

                setRecource(
                    resp.data.map((item) => {
                        const { id, name, type } = { ...item }
                        return {
                            id: id,
                            name: name,
                            type: type
                        }
                    })
                )
            }
        } catch (error) {
            setLoadingResource(false)

            console.log(
                '🚀 ~ file: DownloadRecource.js:11 ~ getAllFileByCourseName ~ error:',
                error
            )
        }
    }

    const handleOnChangeChipGroup = (items) => {
        console.log(
            '🚀 ~ file: DownloadRecource.js:39 ~ handleOnChangeChipGroup ~ item:',
            ...selectedRecourceIds,
            items
        )
        setSelectedRecourceIds(items)
    }
    const handleCheckAll = () => {
        const allRecourceIds = recource.map((rc) => rc.id)
        setSelectedRecourceIds(allRecourceIds)
    }
    const handleOnClickDownloadFiles = async (isAll) => {
        var fileIds = selectedRecourceIds
        if (isAll) {
            setLoadingDownloadAll(true)
            fileIds = recource.map((item) => item.id)
        } else {
            setLoadingDownload(true)
        }

        try {
            const resp = await resourceApi.downloadFiles(fileIds)
            if (resp.status === 200) {
                const blob = new Blob([resp.data], { type: 'application/zip' })
                const url = window.URL.createObjectURL(blob)
                // Tạo một thẻ <a> ẩn và kích hoạt tải về
                const a = document.createElement('a')
                a.href = url
                a.download = 'Tai-nguyen.zip'
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()

                // Xóa thẻ <a> và URL tạo ra sau khi tải xong
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                setLoadingDownload(false)
                setLoadingDownloadAll(false)
            }
        } catch (error) {
            setLoadingDownload(false)
            setLoadingDownloadAll(false)

            console.error('Failed to download files:', error)
        }
    }
    useEffect(() => {
        getAllFileByCourseName()
    }, [])
    if (loadingResource) {
        return (
            <Center mih={200}>
                <Loader />
            </Center>
        )
    }
    return (
        <Box>
            <Container>
                <Chip.Group
                    multiple
                    value={selectedRecourceIds}
                    onChange={(items) => {
                        handleOnChangeChipGroup(items)
                    }}
                >
                    <Text fz="md" mb={'md'}>
                        Bài học{' '}
                        <Badge>
                            {
                                recource.filter((rc) => {
                                    if (rc.type === 'lesson') return rc
                                }).length
                            }
                        </Badge>
                    </Text>
                    {recource.filter((rc) => {
                        if (rc.type === 'lesson') return rc
                    }).length === 0 ? (
                        <p>Oops ! Khóa học chưa có bài học rồi :((</p>
                    ) : null}
                    {recource.map((rc) => {
                        if (rc.type === 'lesson')
                            return (
                                <Chip
                                    key={rc.id}
                                    value={rc.id}
                                    disabled={
                                        loadingDownload || loadingDownloadAll
                                    }
                                >
                                    {rc.name}
                                </Chip>
                            )
                    })}

                    <Text fz="md" mb={'md'}>
                        Tài nguyên{' '}
                        <Badge>
                            {
                                recource.filter((rc) => {
                                    if (rc.type !== 'lesson') return rc
                                }).length
                            }
                        </Badge>
                    </Text>
                    {recource.filter((rc) => {
                        if (rc.type !== 'lesson') return rc
                    }).length === 0 ? (
                        <p>Oops ! Khóa học chưa có tài nguyên rồi :((</p>
                    ) : null}
                    {recource.map((rc) => {
                        if (rc.type !== 'lesson')
                            return (
                                <Chip
                                    key={rc.id}
                                    value={rc.id}
                                    disabled={
                                        loadingDownload || loadingDownloadAll
                                    }
                                >
                                    {rc.name}
                                </Chip>
                            )
                    })}
                </Chip.Group>
                <Divider my="md" />
                <Group mt={'md'}>
                    <Button
                        variant="light"
                        color="orange"
                        loading={loadingDownloadAll}
                        disabled={loadingDownload || recource.length === 0}
                        onClick={() => {
                            handleCheckAll()
                            handleOnClickDownloadFiles(true)
                        }}
                    >
                        {loadingDownloadAll
                            ? 'Đang chuẩn bị file...'
                            : 'Tải tất cả'}
                    </Button>
                    <Indicator
                        inline
                        label={selectedRecourceIds.length}
                        size={16}
                    >
                        <Button
                            loading={loadingDownload}
                            disabled={
                                loadingDownloadAll ||
                                selectedRecourceIds.length <= 0
                            }
                            variant="light"
                            onClick={() => {
                                handleOnClickDownloadFiles(false)
                            }}
                        >
                            {!loadingDownload
                                ? 'Tải ngay'
                                : 'Đang chuẩn bị file...'}
                        </Button>
                    </Indicator>
                </Group>
            </Container>
        </Box>
    )
}

export default DownloadRecource
