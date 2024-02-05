const emptyOperation = (): Operation => ({
    created: null,
    operationName: "",
    updated: "",
    paymentPerHour: {
        amount: 0,
    },
    operationTimeManagement: ""
} as Operation)

export default emptyOperation
