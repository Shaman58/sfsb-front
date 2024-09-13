const navItems: NavItem[] = [
    { path: "/staff", label: "Пользователи", role: ["HR", "ADMIN"] },
    { path: "/supplier", label: "Снабжение", role: ["SUPPLIER", "ADMIN"] },
    {
        path: "/data",
        label: "Данные",
        role: ["TECHNOLOGIST", "ADMIN"],
        submenu: [
            {
                path: "materials",
                label: "Материалы",
                role: ["TECHNOLOGIST", "ADMIN"],
            },
            {
                path: "cutters",
                label: "Инструменты",
                role: ["TECHNOLOGIST", "ADMIN"],
            },
            {
                path: "specials",
                label: "Специнструменты",
                role: ["TECHNOLOGIST", "ADMIN"],
            },
            {
                path: "toolings",
                label: "Оснастка",
                role: ["TECHNOLOGIST", "ADMIN"],
            },
        ],
    },
    {
        path: "/commerce",
        label: "Коммерция",
        role: ["COMMERCE", "ADMIN"],
        submenu: [
            {
                path: "clients",
                label: "Контрагенты",
                role: ["COMMERCE", "ADMIN"],
            },
            { path: "orders", label: "Заявки", role: ["COMMERCE", "ADMIN"] },
            {
                path: "operations",
                label: "Операции",
                role: ["COMMERCE", "ADMIN"],
            },
            { path: "kp", label: "КП", role: ["COMMERCE", "ADMIN"] },
        ],
    },
    {
        path: "/technology",
        label: "Технология",
        role: ["TECHNOLOGIST", "ADMIN"],
    },
    {
        path: "/workflow",
        label: "Производство",
        role: ["TECHNOLOGIST", "ADMIN"],
    },
];

export default navItems;
