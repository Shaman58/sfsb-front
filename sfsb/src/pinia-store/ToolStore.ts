import { computed, type Ref, ref, toValue } from "vue";
import api, { CRUD, query } from "@/api/instance";

export default class ToolStore<T extends { id?: string | number }> {
    private cumulativeTool: Ref<T[][]> = ref([[]]);
    public loading: Ref<boolean> = ref(false);
    private offset: Ref<number> = ref(0);
    private limit: Ref<number> = ref(10);
    public url: string = "/";
    private crud: CRUD;

    public tools = computed(() => this.cumulativeTool.value.flat());

    public filter: Ref<string> = ref("");

    constructor(url: string) {
        this.url = url;
        this.fetchTool = this.fetchTool.bind(this);
        this.getTool = this.getTool.bind(this);
        this.saveTool = this.saveTool.bind(this);
        this.deleteTool = this.deleteTool.bind(this);
        this.newData = this.newData.bind(this);
        this.crud = new CRUD(url);
        this.loadAll = this.loadAll.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    async fetchTool() {
        this.loading.value = true;
        this.cumulativeTool.value[this.offset.value] =
            (await query(
                async () =>
                    await api.get<T[]>(
                        `${this.url}?offset=${this.offset.value}&limit=${this.limit.value}&filter=${this.filter.value}`
                    ),
                { success: "" }
            )) || ([] as T[]);
        this.loading.value = false;
    }

    async getTool(id: number): Promise<T | undefined> {
        this.loading.value = true;
        const res = await query(
            async () => await api.get<T>(`${this.url}/${id}`),
            { success: "" }
        );
        this.loading.value = false;
        return res;
    }

    async saveTool(tool: T) {
        this.loading.value = true;
        const res = await this.crud.save(tool);
        await this.fetchTool();
        this.loading.value = false;
        return res;
    }

    private hasId = (x: any): x is { id: any } => {
        return "id" in toValue(x);
    };

    async deleteTool(tool: T) {
        if (!this.hasId(tool)) return;
        this.loading.value = true;
        await this.crud.delete(tool);
        await this.fetchTool();
        this.loading.value = false;
    }

    async newData() {
        this.loading.value = true;
        const data = await query<T[]>(
            async () =>
                await api.get(
                    `${this.url}?offset=${this.offset.value + 1}&limit=${
                        this.limit.value
                    }&filter=${this.filter.value}`
                ),
            { success: "" }
        );
        if (!data || data.length === 0) return (this.loading.value = false);
        this.cumulativeTool.value[this.offset.value + 1] = data;
        this.offset.value += 1;
        this.loading.value = false;
        return true;
    }

    loadAll() {
        setTimeout(async () => {
            await this.fetchTool();
            while (await this.newData()) {
                console.log(`Loading ${this.url}`, this.offset.value);
            }
        });
    }

    async setFilter(value: string) {
        this.filter.value = value;
        this.offset.value = 0;
        this.loading.value = true;
        const data = await query<T[]>(
            async () =>
                await api.get(
                    `${this.url}?limit=${this.limit.value}&filter=${this.filter.value}`
                ),
            { success: "" }
        );
        if (!data || data.length === 0) return (this.loading.value = false);
        this.cumulativeTool.value = [data];
        this.loading.value = false;
    }
}
