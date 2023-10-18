import api from "@/api/instance";
import mammoth from "mammoth";

export const useOfferGenerator = () => {
  const previewCommerce = async (order) => {
    try {
      const response = await api.get("/doc/kp", {
        params: {orderId: order.id},
        responseType: 'arraybuffer'
      });

      const arrayBuffer = response.data;
      const result = await mammoth.convertToHtml({arrayBuffer: arrayBuffer});
      const blob = new Blob([response.data], {type: response.headers['content-type']});
      const objectURL = URL.createObjectURL(blob);
      const filename = order.customer.companyName + "_" + order.applicationNumber + '.docx';

      const downloadButtonHtml = `
      <a href="${objectURL}" download="${filename}" style="display: block; margin: 20px;">
        Скачать
      </a>
    `;

      const newWindow = window.open("", "_blank");
      newWindow.document.write(downloadButtonHtml);
      newWindow.document.write(result.value);
      newWindow.document.close();
    } catch (error) {
      console.error("There was an error previewing the DOCX file:", error);
    }
  }

  return {previewCommerce};
};
