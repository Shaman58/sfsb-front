const navItems: NavItem[] = [
    {path: "/staff", label: "Пользователи", role: ["HR", "ADMIN"]},
    {path: "/supplier", label: "Снабжение", role: ["SUPPLIER", "ADMIN"]},
    {
        path: "/data", label: "Данные", role: ["TECHNOLOGIST", "ADMIN"], submenu: [
            {path: "materials", label: "Материалы", role: ["TECHNOLOGIST", "ADMIN"]},
            {path: "cutters", label: "Инструменты", role: ["TECHNOLOGIST", "ADMIN"]},
            {path: "specials", label: "Специнструменты", role: ["TECHNOLOGIST", "ADMIN"]},
            {path: "toolings", label: "Остастка", role: ["TECHNOLOGIST", "ADMIN"]},
        ]
    },
    {path: "/commerce", label: "Коммерция", role: ["COMMERCE", "ADMIN"]},
    {
        path: "/technology",
        label: "Технология",
        role: ["TECHNOLOGIST", "ADMIN"],
    },
];

export default navItems;
