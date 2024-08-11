export {};
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $defaultColor: string;
        $keycloakService: any;
        $navItems: NavItem[];
        $operations: Therm[];
        $geometries: (Therm & { workpieceData: number[] })[];
    }
}
