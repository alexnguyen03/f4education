import React, { forwardRef } from 'react'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import { Group, Avatar, Text, Menu, UnstyledButton } from '@mantine/core'

const UserButton = forwardRef(
    ({ image, name, email, icon, ...others }, ref) => (
        <UnstyledButton
            ref={ref}
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                boxShadow: '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05)',
                padding: theme.spacing.md,
                color:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[0]
                        : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0]
                }
            })}
            {...others}
        >
            <Group>
                <Avatar src={image} radius="xl" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {name}
                    </Text>

                    <Text color="dimmed" size="xs">
                        {email}
                    </Text>
                </div>

                {icon || <IconChevronDown size="1rem" />}
            </Group>
        </UnstyledButton>
    )
)
export default UserButton
