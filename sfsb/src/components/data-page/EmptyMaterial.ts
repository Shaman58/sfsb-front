const emptyMaterial=():Omit<Material, "id">=>({
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
})

export default emptyMaterial
