import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

const useTaskMoving = defineStore("taskMouving", () => {
    const taskMoving: Ref<(Task & { offsetX: number }) | null> = ref(null);

    return {
        taskMoving,
    };
});
export default useTaskMoving;
