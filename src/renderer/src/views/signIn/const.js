import dayjs from "dayjs";

export const keyMap = new Map([
  ['useId', (content) => {
    return {
      Member: {
        relation: [{ id: content }]
      }
    }
  }],
  [
    'workplace', (content) => {
      return {
        '作業場所': {
          select: {
            name: content
          }
        }
      }
    }
  ],
  [
    'attendanceType', (content) => {
      return {
        '出勤区分': {
          select: {
            name: content
          }
        }
      }
    }
  ],
  [
    'startTime', (startTime, endTime) => {
      return {
        '出勤時間': {
          date: {
            start: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            end: endTime ? dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
          }
        }
      }
    }
  ],
  [
    'restTime', (number) => {
      return {
        '休憩時間(Hour)': {
          number: Number(number),
        }
      }
    }
  ],
  [
    'log', (content) => {
      return {
        'メモ': {
          title: [
            {
              plain_text: '勤怠記録',
              text: { content: '勤怠記録', link: null },
            }
          ]
        }
      }
    }
  ],
])
