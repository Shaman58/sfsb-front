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

export function areElementsOverlapping(el1: HTMLElement, el2: HTMLElement) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
        (
            rect1.right < rect2.left || // правый край el1 левее левого края el2
            rect1.left > rect2.right || // левый край el1 правее правого края el2
            rect1.bottom < rect2.top || // нижний край el1 выше верхнего края el2
            rect1.top > rect2.bottom
        ) // верхний край el1 ниже нижнего края el2
    );
}
