export class Empty{
    static KPItem(): KPItem{
        return ({
            decimal:"",
            name:"",
            created: null,
            updated: null,
            itemPrice: "0",
            amount: 0,
            totalPrice: "0"
        }) as KPItem
    }

    static KP(): KP{
        return ({
            items:[],
            created: null,
            updated: null,
            applicationNumber: -1,
            companyId: 1,
            businessProposal:"",
            managerUuid:""
        })
    }

    static Company(): Customer{
        return ({
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
    }

    static Operation():Operation{
        return ({
            created: null,
            operationName: "",
            updated: "",
            paymentPerHour: {
                amount: 0,
                currency: "RUB"
            },
        } as Operation)
    }

    static Item():Item{
        return ({
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
    }

    static Order():Omit<Order, "id" | "applicationNumber" | "user" | "customer"> {
        return ({
            description: "",
            items: [],
            businessProposal: "",
            created: "",
            updated: "",
            contact: null,
            files: [],
        })
    }

    static User():Person{
        return ({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            picture: "",
            username: "",
            phoneNumber: "",
            roles: [] as string[]
        } as Person)
    }

    static Material(): Material{
        return ({
            updated: 0,
            created: "",
            materialName: "",
            geometry: "",
            gost1: "",
            gost2: "",
            density: 0,
            price: {
                amount: 0,
                currency: "RUB"
            }
        }) as Material
    }

    static Tool():Tool{
        return ({
            toolName: "",
            description: "",
            created: null,
            updated: null
        }) as Tool
    }

    static Setup():Partial<Setup>{
        return ({
            setupTime: "00:00",
            processTime: "00:00",
            interoperativeTime: "00:00",
            measureToolItems: [],
            specialToolItems: [],
            cutterToolItems: [],
            toolings: [],
            additionalTools: [],
            setupNumber: 10,
            operation: {
            operationName: '',
                operationTimeManagement: "FULL"
        },
            cooperatePrice: {amount: 0, currency: 'RUB'}
        } as Partial<Setup>)
    }
}
