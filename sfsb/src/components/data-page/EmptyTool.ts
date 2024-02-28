const emptyTool=():Omit<Tool, "id">=>({
    toolName: "",
    description: "",
    created: null,
    updated: null
})

export default emptyTool
