const emptyUser = (): Person => ({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    picture: "",
    username: "",
    phoneNumber: "",
    roles: [] as string[]
} as Person)

export default emptyUser
