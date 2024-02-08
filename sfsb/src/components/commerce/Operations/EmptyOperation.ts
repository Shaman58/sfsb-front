const emptyOperation = (): Operation => ({
    created: null,
    operationName: "",
    updated: "",
    paymentPerHour: {
        amount: 0,
        currency: "RUB"
    },
    operationTimeManagement: ""
} as Operation)

export default emptyOperation
