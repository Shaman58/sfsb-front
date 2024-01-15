import type {Ref} from "vue";
import {onMounted, onUnmounted, ref} from "vue"

export default function useWindowResize(): Ref<number> {
    let width: Ref<number> = ref(window.innerWidth)

    const handler = () => width.value = window.innerWidth

    onMounted(() => {
        window.addEventListener("resize", handler)
    })

    onUnmounted(() => window.removeEventListener("resize", handler))

    return width
}
