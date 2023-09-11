import Vuex from 'vuex'
import departmentModule from "@/store/DepartmentModule";
import employeeModule from "@/store/EmployeeModule";
import companyModule from "@/store/CompanyModule";
import areaModule from "@/store/AreaModule";
import storeModule from "@/store/StoreModule";
import measureModule from "@/store/MeasureModule";
import toolingModule from "@/store/ToolingModule";
import specialsModule from "@/store/SpecialsModule"
import workpieceModule from "@/store/WorkpieceModule";
import materialModule from "@/store/MaterialModule";
import customerModule from "@/store/CustomerModule";
import contactModule from "@/store/ContactModule";
import orderModule from "@/store/OrderModule";
import itemModule from "@/store/itemModule";
import technologyModule from "@/store/TechnologyModule";
import setupModule from "@/store/SetupModule";
import operationModule from "@/store/OperationModule";
import cutterModule from "@/store/CutterModule";

export default new Vuex.Store({
  modules: {
    departmentModule,
    employeeModule,
    companyModule,
    areaModule,
    storeModule,
    measureModule,
    toolingModule,
    specialsModule,
    workpieceModule,
    materialModule,
    customerModule,
    contactModule,
    orderModule,
    itemModule,
    technologyModule,
    setupModule,
    operationModule,
    cutterModule
  }
})
