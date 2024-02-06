const emptyItem = (): Item => ({
    technology: {
        drawingName: "",
        drawingNumber: ""
    },
    quantity: 0,
    price: {
        amount: 0,
        currency: "RUB"
    }
} as Item)

export default emptyItem
