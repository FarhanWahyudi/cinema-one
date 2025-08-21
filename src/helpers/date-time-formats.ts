import dayjs from "dayjs"

export const formatDate = (date: Date | string): string => dayjs(date).format("DD MMM YYYY")

export const formatTime = (time: string): string => dayjs(`1970-01-01T${time}`).format("hh:mm A")

export const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m}m`;
}