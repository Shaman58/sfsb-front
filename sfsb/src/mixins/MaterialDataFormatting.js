import {ref} from 'vue';

export default function useGeometryFormatting() {
  const geometries = ref([
    {title: 'Круг', label: 'CYLINDER'},
    {title: 'Плита', label: 'BLANK'},
    {title: 'Шестигранник', label: 'HEXAGON'},
    {title: 'Пруток', label: 'ROD'},
    {title: 'Труба', label: 'TUBE'},
    {title: 'Профиль', label: 'PROFILE'},
    {title: 'Квадрат', label: 'SQUARE'},
    {title: 'Лента', label: 'TAPE'},
    {title: 'Лист', label: 'LIST'},
    {title: 'Другое', label: 'OTHER'},
  ]);

  const formatMaterialData = (data) => {
    const {geometry, materialName, gost} = data;

    switch (geometry) {
      case 'CYLINDER':
        return `Круг ${materialName} ${gost}`;
      case 'BLANK':
        return `Плита ${materialName} ${gost}`;
      case 'HEXAGON':
        return `Шестигранник ${materialName} ${gost}`;
      case 'ROD':
        return `Пруток ${materialName} ${gost}`;
      case 'TUBE':
        return `Труба ${materialName} ${gost}`;
      case 'PROFILE':
        return `Профиль ${materialName} ${gost}`;
      case 'LIST':
        return `Лист ${materialName} ${gost}`;
      case 'SQUARE':
        return `Квадрат ${materialName} ${gost}`;
      case 'TAPE':
        return `Лента ${materialName} ${gost}`;
      case 'OTHER':
        return `${materialName} ${gost}`;
      default:
        break;
    }

    return '';
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
