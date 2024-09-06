import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

const useTaskMoving = defineStore("taskMouving", () => {
    const taskMoving: Ref<(Task & { offsetX: number }) | null> = ref(null);
    const borderMoving: Ref<(Task & { border: "left" | "right" }) | null> =
        ref(null);

    return {
        taskMoving,
        borderMoving,
    };
});
export default useTaskMoving;
