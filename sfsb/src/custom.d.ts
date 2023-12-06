declare interface ImportMeta {
  env: {
    VITE_APP_BASE_API_URL: string;
  };
}
declare interface Therm {
  title: string;
  label: string;
}

declare interface NavItem{
  path: string,
  label: string
}

declare interface OrderFile {
  created: string
  filename: string
  id:numer
  link: string;
  updated: string;
}
