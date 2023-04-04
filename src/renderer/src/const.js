const defaultWorkplaceOptions = ['本社', '在宅出勤', '社外出勤']
const defaultattendanceTypeOptions = ['出勤', '公休', '欠勤', '有给休假', '振休', '特别休假', '短时勤务 ']

export const getWorkplaceOptions = () => window.EStore.get('workplaceOptions')

export const getAttendanceTypeOptions = () => window.EStore.get('attendanceTypeOptions')

export const setWorkplaceOptions = (WorkplaceOptions) => {
  window.EStore.set('workplaceOptions', WorkplaceOptions)
  workplaceOptions = WorkplaceOptions
}

export const setAttendanceTypeOptions = (AttendanceTypeOptions) => {
  window.EStore.set('attendanceTypeOptions', AttendanceTypeOptions)
  attendanceTypeOptions = AttendanceTypeOptions
}

export let workplaceOptions = getWorkplaceOptions() || defaultWorkplaceOptions
export let attendanceTypeOptions = getAttendanceTypeOptions() || defaultattendanceTypeOptions

if (!getWorkplaceOptions()) {
  setWorkplaceOptions(defaultWorkplaceOptions)
}

if (!getAttendanceTypeOptions()) {
  setAttendanceTypeOptions(defaultattendanceTypeOptions)
}
