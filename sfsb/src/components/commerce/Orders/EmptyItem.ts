const emptyItem = (): Item => ({
    technology: {
        drawingName: "",
        drawingNumber: "",
        outsourcedCosts: {
            amount: 0,
            currency: "RUB"
        }
    },
    quantity: 0,
    price: {
        amount: 0,
        currency: "RUB"
    }
} as Item)

export default emptyItem
