import CONSTS from "@/consts"
export default function useGeometryFormatting() {


  const formatMaterialData = (data) => {
    const {geometry, materialName, gost1, gost2} = data;

    // switch (geometry) {
    //   case 'CYLINDER':
    //     return `Круг ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'BLANK':
    //     return `Плита ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'HEXAGON':
    //     return `Шестигранник ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'ROD':
    //     return `Пруток ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'TUBE':
    //     return `Труба ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'PROFILE':
    //     return `Профиль ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'LIST':
    //     return `Лист ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'SQUARE':
    //     return `Квадрат ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'TAPE':
    //     return `Лента ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   case 'OTHER':
    //     return `${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}`;
    //   default:
    //     break;
    // }

    const res = CONSTS.GEOMETRIES.find(e=>e.label===geometry)

    return res ? `${res.title} ${materialName} ${gost1 ? gost1 : ''} ${gost2 ? gost2 : ''}` : ""

    // return '';
  };

  const formatWorkpieceData = (data) => {
    const {geom1, geom2, geom3, material} = data;
    switch (material.geometry) {
      case 'CYLINDER':
        return `${formatMaterialData(material)} ф${geom1}х${geom2}`;
      case 'BLANK':
        return `${formatMaterialData(material)} ${geom1}х${geom2}х${geom3}`;
      case 'HEXAGON':
        return `${formatMaterialData(material)} ф${geom1}х${geom2}`;
      case 'ROD':
        return `${formatMaterialData(material)} ф${geom1}х${geom2}`;
      case 'TUBE':
        return `${formatMaterialData(material)} ф${geom1}ф${geom2}х${geom3}`;
      case 'PROFILE':
        return `${formatMaterialData(material)} ${geom1}`;
      case 'LIST':
        return `${formatMaterialData(material)} ${geom1}х${geom2}х${geom3}`;
      case 'SQUARE':
        return `${formatMaterialData(material)} ф${geom1}х${geom2}`;
      case 'TAPE':
        return `${formatMaterialData(material)} ф${geom1}х${geom2}`;
      case 'OTHER':
        return `${formatMaterialData(material)} ф${geom1}х${geom2}`;
      default:
        break;
    }

    return '';
  };

  return {geometries, formatMaterialData, formatWorkpieceData};
}
