export interface KPMenuItem {
    emit: "save" | "delete" | "copy" | "refresh" | "download" | "print"
    icon: `mdi:mdi-${string}`
    label: string,
    canBeDisabled: boolean,
    disabledWhenStranger: boolean,
    disabledWhenSystem: boolean,
}

export const menuItems: readonly KPMenuItem[] = [
    {
        emit: "save",
        icon: "mdi:mdi-floppy",
        label: "Сохранить",
        canBeDisabled: false,
        disabledWhenStranger: true,
        disabledWhenSystem: true
    },
    {
        emit: "delete",
        icon: "mdi:mdi-delete",
        label: "Удалить",
        canBeDisabled: true,
        disabledWhenStranger: true,
        disabledWhenSystem: true
    },
    {
        emit: "copy",
        icon: "mdi:mdi-content-copy",
        label: "Скопировать",
        canBeDisabled: true,
        disabledWhenStranger: false,
        disabledWhenSystem: false
    },
    {
        emit: "print",
        icon: "mdi:mdi-printer",
        label: "Печать",
        canBeDisabled: true,
        disabledWhenStranger: true,
        disabledWhenSystem: true
    },
] as const
