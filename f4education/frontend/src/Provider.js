import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

function Provider({ children }) {
    return (
        <MantineProvider>
            <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
    )
}

export default Provider
