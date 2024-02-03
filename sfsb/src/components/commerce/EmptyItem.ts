const emptyItem = (): Pick<Item, "technology" | "quantity"> => ({
    technology: {
        drawingName: "",
        drawingNumber: ""
    },
    quantity: 0
})

export default emptyItem
