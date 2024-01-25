import CONSTS from "@/consts"

export default function useGeometryFormatting() {


    const formatMaterialData = (material: Material) => {
        if (!material) return ""
        const {geometry, materialName, gost1, gost2} = material
        const res = CONSTS.GEOMETRIES.find(e => e.label === geometry)
        return res ? `${res.title} ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}` : ""
    };


    const formatWorkpieceData = (workpiece: Workpiece) => {
        if (!workpiece) return ""
        const {material, id, created, updated, ...geoms} = workpiece
        const workpieceData: number[] | undefined = CONSTS.GEOMETRIES.find(
            (e) => e.label === material.geometry
        )?.workpieceData;

        // `${formatMaterialData(material)} ${geom1}х${geom2}х${geom3}`
        //TODO: данную функцию надо продебажить

        const workpieceDataString = workpieceData && workpieceData.reduce(
            (acc, e) => acc + (geoms[`geom${e}`] ? geoms[`geom${e}`] : ""),
            ""
        );
        return material.geometry && workpieceDataString
            ? formatMaterialData(material) + workpieceDataString
            : "";
    };


    const geometries = CONSTS.GEOMETRIES
    return {geometries, formatMaterialData, formatWorkpieceData};
}
