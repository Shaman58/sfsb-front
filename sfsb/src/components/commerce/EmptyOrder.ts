const emptyOrder = (): Omit<Order, "id" | "applicationNumber" | "user" | "customer"> => ({
    description: "",
    items: [],
    businessProposal: "",
    created: "",
    updated: "",
    contact: null,
    files: [],
})

export default emptyOrder
