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

declare module string {
  import { defineComponent } from string;
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare interface ImportMeta {
  env: {
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
  contacts: any[];
  correspondentAccount: string;
  created: string;
  email: string;
  id: number;
  inn: string;
  kpp: string;
  ogrn: string;
  paymentAccount: string;
  phoneNumber: string;
  updated: string | null;
}

declare interface Department {
  id: number;
  created: string | null;
  updated: string | null;
  departmentName: string;
}

declare interface ItemPrice {
  amount: number;
  currency: string;
  formatted?: string;
}

declare interface Material {
  id: number;
  created: string;
  updated: null;
  materialName: string;
  gost1: string;
  gost2: null;
  geometry: string;
  price: ItemPrice;
  density: number;
}
declare interface Workpiece {
  id: number;
  created: string;
  updated: null;
  material: Material;
  geom1: string;
  geom2: string;
  geom3: string;
}

declare interface Tool {
  id: number;
  created: null;
  updated: null;
  toolName: string;
  description: string;
}
declare interface ToolItem {
  id: number;
  created: string;
  updated: null;
  amount: number;
  price: ItemPrice;
  tool: Tool;
}

declare interface Operation {
  id: number;
  created: null;
  updated: string;
  operationName: string;
  paymentPerHour: ItemPrice;
  operationTimeManagement: string;
}
declare interface Setup {
  id: number;
  created: string;
  updated: string;
  setupNumber: number;
  operation: Partial<Operation>;
  setupTime: string;
  processTime: string;
  interoperativeTime: string;
  measureToolItems: ToolItem[];
  additionalTools: any[];
  specialToolItems: ToolItem[];
  cutterToolItems: ToolItem[];
  toolings: [];
  perTime: string | null;
  text: string | null;
  cooperatePrice: ItemPrice;
  additionalComments: string;
  group: false;
  cooperate: false;
  aggregate: false;
}

declare interface Technology {
  id: number;
  created: string;
  updated: string;
  drawingNumber: string;
  drawingName: string;
  employee: null;
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
  user: Person
}
declare interface Item {
  created: string;
  customerMaterial: boolean;
  id: number;
  price: ItemPrice;
  quantity: number;
  technology: Technology;
  updated: string;
}
declare interface Order {
  applicationNumber: number;
  businessProposal: string;
  contact: null;
  created: string;
  customer: Customer;
  description: string;
  user: Person;
  files: OrderFile[];
  id: number;
  items: Item[];
  updated: string | null;
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

declare type Role = string;
declare type Roles = string[];
