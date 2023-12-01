 const GEOMETRIES: (Therm & { workpieceData: number[] })[] = [
   { title: "Круг", label: "CYLINDER", workpieceData: [1,2] },
   { title: "Плита", label: "BLANK", workpieceData: [1,2,3] },
   { title: "Шестигранник", label: "HEXAGON", workpieceData: [1,2] },
   { title: "Пруток", label: "ROD", workpieceData: [1,2] },
   { title: "Труба", label: "TUBE", workpieceData: [1,2,3] },
   { title: "Профиль", label: "PROFILE", workpieceData: [1] },
   { title: "Квадрат", label: "SQUARE", workpieceData: [1,2,3] },
   { title: "Лента", label: "TAPE", workpieceData: [1,2] },
   { title: "Лист", label: "LIST", workpieceData: [1,2] },
   { title: "Другое", label: "OTHER", workpieceData: [1,2] },
 ];

export default GEOMETRIES
