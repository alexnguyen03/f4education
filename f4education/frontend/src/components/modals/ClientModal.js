import { Button, Modal, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

const ClientModal = ({ isOpen, handleCloseModal }) => {
    return (
        <Modal.Root
            opened={isOpen}
            onClose={() => {
                handleCloseModal(isOpen)
            }}
            centered
            size={'md'}
            radius={10}
        >
            <Modal.Overlay
                onClick={() => {
                    handleCloseModal(isOpen)
                }}
            />
            <Modal.Content>
                <Modal.Body>
                    <Modal.CloseButton
                        ml="auto"
                        size="lg"
                        onClick={() => {
                            handleCloseModal(isOpen)
                        }}
                        mb={25}
                    />
                    <Stack p={30} justify="space-between">
                        <Title order={1} color="dark" mb={5} align="center">
                            Tham gia với chúng tôi để bắt đầu học tập tại trung
                            tâm.
                        </Title>
                        <Text
                            color="dimmed"
                            maw={250}
                            size="lg"
                            mx="auto"
                            align="center"
                            mb={25}
                        >
                            Với hàng nghìn khóa học cho bạn lựa chọn
                        </Text>

                        <Button variant="gradient" size="lg" mb={5}>
                            <Link
                                to="/client-register"
                                color="dark"
                                className="text-white"
                            >
                                Đăng ký ngay
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            color="violet"
                            size="lg"
                            mb={10}
                        >
                            <Link
                                to="/auth/login"
                                color="dark"
                                className="text-primary"
                            >
                                Đăng nhập
                            </Link>
                        </Button>
                        <Text color="dark" mx="auto" my={20} align="center">
                            By continuing, you agree to F4Education Terms of
                            Service; and acknowledge you've read our Privacy
                            Policy;. Notice at collection;
                        </Text>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}

export default ClientModal
