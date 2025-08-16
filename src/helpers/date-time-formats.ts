import dayjs from "dayjs"

export const formatDate = (date: Date | string): string => dayjs(date).format("MM DD, YYYY")

export const formatTime = (time: string): string => dayjs(`1970-01-01T${time}`).format("hh:mm A")