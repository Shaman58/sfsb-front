import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

const useTaskMoving = defineStore("taskMoving", () => {
    const taskMoving: Ref<
        (Task & { offsetX: number; x: number; previousState: Task }) | null
    > = ref(null);
    const borderMoving: Ref<
        (Task & { border: "left" | "right"; x: number }) | null
    > = ref(null);
    const borderMovingPreviousState = ref<Task | undefined>();
    const scrollBody = ref(0);
    const activeResource = ref<number | undefined>();

    return {
        taskMoving,
        borderMoving,
        borderMovingPreviousState,
        scrollBody,
        activeResource,
    };
});
export default useTaskMoving;
