import { useContext } from 'react'
import { RoleContext } from '../context/RoleContext'
import StudentPerformanceAnalytics from '../components/StudentPerformanceAnalytics'
import ClassPerformanceAnalytics from '../components/ClassPerformanceAnalytics'

const CPAView = () => {
  const { activeRole } = useContext(RoleContext)

  if (activeRole === 'Student') {
    return <StudentPerformanceAnalytics />
  } else {
    return <ClassPerformanceAnalytics />
  }
}

export default CPAView
