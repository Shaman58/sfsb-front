const emptyCompany = (): Customer => ({
    companyName: "",
    address: "",
    email: "",
    phoneNumber: "",
    inn: "",
    ogrn: "",
    bank: "",
    bik: "",
    correspondentAccount: "",
    paymentAccount: "",
    kpp: "",

}) as Customer

export default emptyCompany
