import {
    Alert,
    Badge,
    Group,
    HoverCard,
    Loader,
    LoadingOverlay,
    Progress,
    Select,
    Text
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import MaterialReactTable from 'material-react-table'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import classApi from '../../../api/classApi'
import scheduleApi from '../../../api/scheduleApi'
import { convertArrayToLabel } from '../../../utils/Convertor'
import CourseProgress from './CourseProgress'

const StudentHome = (props) => {
    return (
        <>
            <div className="">
                <CourseProgress />
            </div>
        </>
    )
}
export default StudentHome
