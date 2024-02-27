export default function debounce(func: Function, ms: number) {
    let timeout: any;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), ms);
    };
}
