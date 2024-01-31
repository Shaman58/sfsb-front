export default function debounce(func: Function, ms: number) {
    let timeout: any;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
}
