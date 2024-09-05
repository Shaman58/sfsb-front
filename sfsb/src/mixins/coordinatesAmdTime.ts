export const coordinatesToTime = (
    coordinate: number,
    scale: number = 30,
    start: string | Date = new Date("09.02.2024")
): string => {
    const timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
    const coordMs = (coordinate / scale) * 3600 * 1000;
    const dateMs = new Date(start).getTime() - timezoneOffsetMs + coordMs;
    return new Date(dateMs + timezoneOffsetMs).toISOString();
};
