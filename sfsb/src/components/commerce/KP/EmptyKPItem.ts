const emptyKPItem = (): KPItem => ({
    decimal:"",
    name:"",
    created: null,
    updated: null,
    itemPrice: 0,
    amount: 0,
    totalPrice: "0"
}) as KPItem

export default emptyKPItem
