declare module "*.png" {
    const value: string;
    export default value;
}
declare module "*.jpg" {
    const value: string;
    export default value;
}
declare module "*.jpeg" {
    const value: string;
    export default value;
}

declare module "*.vue" {
    import { defineComponent } from "vue";
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}

declare interface ImportMeta {
    env: {
        VITE_APP_KEYCLOAK_CLIENT: string;
        VITE_APP_KEYCLOAK_REALM: string;
        VITE_APP_KEYCLOAK_URL: string;
        BASE_URL: string;
        VITE_APP_VERSION: any;
        VITE_APP_BASE_API_URL: string;
        VITE_APP_BASE_FS_URL: string;
    };
}

declare interface Therm {
    title: string;
    label: string;
}

declare interface NavItem {
    path: string;
    label: string;
    role?: string[];
    submenu?: NavItem[];
}

declare interface OrderFile {
    created: string;
    filename: string;
    id: numer;
    link: string;
    updated: string;
}

declare interface Customer {
    address: string;
    bank: string;
    bik: string;
    companyName: string;
    contacts?: any[];
    correspondentAccount: string;
    created: string;
    email: string;
    id?: number;
    inn: string;
    kpp: string;
    ogrn: string;
    paymentAccount: string;
    phoneNumber: string;
    updated: string | null;
}

declare interface PartialCustomer extends Partial<Customer> {}

declare interface Department {
    id: number;
    created: string | null;
    updated: string | null;
    departmentName: string;
}

declare interface ItemPrice {
    amount: number;
    currency: RUB;
    formatted?: string;
}

declare interface Material {
    id: number;
    created: string;
    updated: string | unknown;
    materialName: string;
    gost1: string;
    gost2: string | null;
    geometry: string;
    price: ItemPrice;
    density: number;
}

declare interface Workpiece {
    id: number;
    created: string;
    updated: string | unknown;
    material: Material;
    geom1: string;
    geom2: string;
    geom3: string;
}

declare interface Tool {
    id: number;
    created: string | null;
    updated: string | null;
    toolName: string;
    description: string;
}

declare interface ToolItem {
    id: number;
    created: string | null | unknown;
    updated: string | null;
    amount: number;
    price: ItemPrice;
    tool: Tool;
}

declare interface Operation {
    id: number;
    created: string | null;
    updated: string;
    operationName: string;
    paymentPerHour: ItemPrice | null;
    operationTimeManagement: OperationTimeManagement;
}

declare interface AdditionalTool extends Tool {
    workpiece?: Workpiece;
    amount: number;
    processTime: string;
}

declare interface Setup {
    id: number;
    created: string;
    updated: string | unknown;
    setupNumber: number;
    operation: Partial<Operation>;
    setupTime: string;
    processTime: string;
    interoperativeTime: string;
    measureToolItems: ToolItem[];
    additionalTools: AdditionalTool[];
    specialToolItems: ToolItem[];
    cutterToolItems: ToolItem[];
    toolings: Tool[];
    perTime: string | null;
    text: string | null;
    cooperatePrice: ItemPrice;
    additionalComments: string;
    group: boolean;
    cooperate: boolean;
    aggregate: boolean;
    groupAble?: boolean;
}

declare interface Technology {
    id: number;
    created: string;
    updated: string;
    drawingNumber: string;
    drawingName: string;
    employee: unknown;
    quantityOfDefectiveParts: number;
    quantityOfSetUpParts: number;
    quantityOfPartsFromWorkpiece: number;
    workpiece: Workpiece;
    technologistTime: string;
    setups: Setup[];
    outsourcedCosts: ItemPrice;
    outsourcedCostsDescription: string | null;
    assembly: boolean;
    computed: boolean;
    user: Person;
    blocked: string;
}

declare interface Item {
    id?: number;
    created?: string;
    updated?: string;
    price: ItemPrice;
    customerMaterial: boolean;
    uid?: number | string;
    quantity: number;
    technology: Technology;
}

declare interface Order {
    id: number;
    created: string;
    updated: string | null;
    applicationNumber: number;
    businessProposal: string;
    items: Item[];
    customer: Customer;
    user: Person;
    contact: unknown | null;
    description: string;
    files: OrderFile[];
}

declare interface Person {
    id: string;
    picture: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: Roles;
}

declare interface Logo {
    id: number;
    created: string;
    updated: string;
    filename: string;
    link: string;
    user: null | Person;
}

declare interface Company extends Customer {
    logo: null | Logo;
}

declare interface PartialCompany extends Parial<Company> {}

declare type OperationTimeManagement = COMPUTED | PROCESS_TIME_ONLY | FULL;

declare interface Operation {
    id: number;
    created: null | string;
    updated: string;
    operationName: string;
    paymentPerHour: ItemPrice;
    operationTimeManagement: OperationTimeManagement;
}

declare type Role = string;
declare type Roles = string[];

declare interface FileOrder {
    id: number;
    created: string | null;
    updated: string | null;
    filename: string;
    link: string;
    user: unknown | null;
}

declare interface KPItem {
    id?: string;
    created: string | null;
    updated: string | null;
    itemPrice: number;
    name: string;
    decimal: string;
    amount: number;
    totalPrice: number;
}

declare interface KP {
    id?: number;
    created?: string | null;
    updated?: string | null;
    applicationNumber: number;
    businessProposal: string;
    items: KPItem[];
    customerId: number;
    createdBy: string;
    companyId: number;
    system: boolean;
}

declare interface KPResponse {
    content: KP[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

declare interface ToolPrintItem {
    name: string;
    description: string;
    amount: number;
    itemPrice: number;
}

declare interface ToolPrint {
    header: string;
    body: string;
    footer: string;
    tools: ToolPrintItem[];
}

declare interface CountryCode {
    name: string;
    dial_code: string;
    code: string;
}

declare interface Task {
    id: number;
    workflowId: number;
    name: string;
    technology: string;
    color: string;
    startAt: string;
    endAt: string;
    duration: number;
    description: string;
}

declare interface Resource {
    id: number;
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    tasks: Task[];
}
