export interface KPMenuItem {
    emit: "save" | "delete" | "copy" | "refresh" | "download" | "print"
    icon: `mdi:mdi-${string}`
    label: string,
    canBeDisabled: boolean
}

export const menuItems: readonly KPMenuItem[] = [
    {emit: "save", icon: "mdi:mdi-floppy", label: "Сохранить", canBeDisabled: false},
    {emit: "delete", icon: "mdi:mdi-delete", label: "Удалить", canBeDisabled: true},
    {emit: "copy", icon: "mdi:mdi-content-copy", label: "Скопировать", canBeDisabled: true},
    {emit: "refresh", icon: "mdi:mdi-refresh", label: "Обновить", canBeDisabled: true},
    {emit: "download", icon: "mdi:mdi-download", label: "Сохранить", canBeDisabled: true},
    {emit: "print", icon: "mdi:mdi-printer", label: "Печать", canBeDisabled: true},
] as const
