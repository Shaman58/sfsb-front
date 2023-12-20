import Vuex from 'vuex'
import departmentModule from "@/store/DepartmentModule";
import employeeModule from "@/store/EmployeeModule";
import companyModule from "@/store/CompanyModule";
import toolingModule from "@/store/ToolingModule";
import specialsModule from "@/store/SpecialsModule"
import materialModule from "@/store/MaterialModule";
import customerModule from "@/store/CustomerModule";
import contactModule from "@/store/ContactModule";
import orderModule from "@/store/OrderModule";
import itemModule from "@/store/itemModule";
import technologyModule from "@/store/TechnologyModule";
import operationModule from "@/store/OperationModule";
import cutterModule from "@/store/CutterModule";
import filesInOrders from "@/store/FilesInOrder";

export default new Vuex.Store({
  modules: {
    departmentModule,
    employeeModule,
    companyModule,
    toolingModule,
    specialsModule,
    materialModule,
    customerModule,
    contactModule,
    orderModule,
    itemModule,
    technologyModule,
    operationModule,
    cutterModule,
    filesInOrders
  }
})
