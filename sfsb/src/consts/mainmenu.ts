const navItems: NavItem[] = [
    {path: "/staff", label: "Пользователи", role: ["HR", "ADMIN"]},
    {path: "/supplier", label: "Снабжение", role: ["SUPPLIER", "ADMIN"]},
    {path: "/data", label: "Данные", role: ["TECHNOLOGIST", "ADMIN"]},
    {path: "/commerce", label: "Коммерция", role: ["COMMERCE", "ADMIN"]},
    {
        path: "/technology",
        label: "Технология",
        role: ["TECHNOLOGIST", "ADMIN"],
    },
];

export default navItems;
