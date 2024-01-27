import {defineStore} from "pinia";
import api, {CRUD, query} from "@/api/instance";
import {Ref, ref} from "vue";


const crudOperation = new CRUD("/tooling")
export const useToolingStore = defineStore("tooling", () => {
    const cumulativeToolings: Ref<Tool[]> = ref([])
    const toolings: Ref<Tool[]> = ref([]);
    const loading: Ref<boolean> = ref(false)
    const offset: Ref<number> = ref(0)
    const limit: Ref<number> = ref(100)

    const accumulateToolings = (toolings: Tool[]): void => {

    }

    const fetchToolings = async () => {
        loading.value = true
        toolings.value = await query(async () =>
            await api.get(`/tooling?offset=${offset.value}&limit=${limit.value}`), {success: ""}) || []
        loading.value = false
    };

    const saveToolings = async (tooling: Partial<Tool>) => {
        loading.value = true
        await crudOperation.save(tooling)
        await fetchToolings()
        loading.value = false
    };

    const deleteTooling = async (tooling: Tool) => {
        loading.value = true
        await crudOperation.delete(tooling)
        await fetchToolings()
        loading.value = false
    };

    const setOffset = (value: number) => offset.value = value
    const incOffset = () => offset.value++
    const decOffset = () => offset.value--

    const setLimit = (value: number) => limit.value = value


    return {
        cumulativeToolings,
        toolings,
        loading,
        fetchToolings,
        saveToolings,
        deleteTooling,
        setOffset,
        incOffset,
        decOffset,
        setLimit
    };
});

/*
суть проблемы:
фильтрация значений списка в "дата"
сейчас я получаю список с значениями offset и limit по-умолчанию, т.е. 20 единиц.
Итерирую список для поиска значений соотвествующих фильтру.
В случае если количество больше 20 мне нужно или увеличить значение limit или делать дополнительные запросы на api,
для получения следующей порции данных с дальнейшим объединением с имеющимися данными
Если количество записей до 100, то проблема отпадает - устанавливаю лимит 100.
А если больше 100, то в любом случае мне нужно будет делать дополнительные запросы, конкатинировать данные в итоге это усложняет алгоритм и жрет дополнительные ресурсы
Насколько я понимаю, сделать 

 */
