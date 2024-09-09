import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

const useTaskMoving = defineStore("taskMouving", () => {
    const taskMoving: Ref<(Task & { offsetX: number; x: number }) | null> =
        ref(null);
    const borderMoving: Ref<
        (Task & { border: "left" | "right"; x: number }) | null
    > = ref(null);
    const scrollBody = ref(0);
    const activeResource = ref<number | undefined>();

    return {
        taskMoving,
        borderMoving,
        scrollBody,
        activeResource,
    };
});
export default useTaskMoving;
