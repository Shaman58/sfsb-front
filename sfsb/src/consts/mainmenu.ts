const navItems: NavItem[] = [
    { path: "/staff", label: "Пользователи", role: ["HR", "ADMIN"] },
    { path: "/supplier", label: "Снабжение", role: ["SUPPLIER", "ADMIN"] },
    { path: "/", label: "Данные" },
    { path: "/commerce", label: "Комерция", role: ["COMMERCE", "ADMIN"] },
    {
        path: "/technology",
        label: "Технология",
        role: ["TECHNOLOGIST", "ADMIN"],
    },
];

export default navItems;
