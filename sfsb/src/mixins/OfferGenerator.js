import api from "@/api/instance";
import mammoth from "mammoth";

export const useOfferGenerator = () => {
  const generateDocument = async (url, params, filename) => {
    try {
      const response = await api.get(url, {
        params,
        responseType: 'arraybuffer'
      });

      const arrayBuffer = response.data;
      const result = await mammoth.convertToHtml({arrayBuffer});
      const blob = new Blob([arrayBuffer], {type: response.headers['content-type']});
      const objectURL = URL.createObjectURL(blob);

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

  const previewCommerce = async (order) => {
    const url = "/doc/kp";
    const params = {orderId: order.id};
    const filename = "КП " + order.customer.companyName + " заказ №" + order.applicationNumber + ".docx";

    await generateDocument(url, params, filename);
  }

  const previewToolOrder = async (order, teId, feId) => {
    const url = "/doc/tool-order";
    const params = {
      orderId: order.id,
      teId: teId,
      feId: feId,
      body: 'Прошу отдел снабжения приобрести инструмент:'
    };
    const filename = "Заявка на инструмент на заказ №" + order.applicationNumber + ".docx";

    await generateDocument(url, params, filename);
  }

  return {previewCommerce, previewToolOrder};
};
