import api from "@/api/instance";
import mammoth from "mammoth";
import {useToast} from "vue-toast-notification";
import {saveAs} from "file-saver";
import checkStatus from "@/mixins/CheckStatus";
import {AxiosError} from "axios";

const toast = useToast();

export const useOfferGenerator = () => {
    const generateDocument = async (
        url: string,
        params: { orderId: number },
        filename: string
    ) => {
        // @ts-ignore
        try {
            const response = await api.get(url, {
                params,
                responseType: "arraybuffer",
            });
            checkStatus(response)
            const arrayBuffer = response.data;
            const result = await mammoth.convertToHtml({arrayBuffer});
            const blob = new Blob([arrayBuffer], {
                type: response.headers["content-type"],
            });
            const objectURL = URL.createObjectURL(blob);
            return {objectURL, html: result.value, blob: blob || null};
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ info: string }, any>
            const {response} = axiosError
            const {data} = response as { data: unknown }
            const textError = data && JSON.parse(new TextDecoder().decode(data as AllowSharedBufferSource))
            toast.error("Ошибка: " + textError?.info, {position: "top-right"});
            console.error(
                "There was an error previewing the DOCX file:",
                error
            );
            return {objectURL: "", html: "", blob: null};
        }
    };

    const printOffer = async (url: string, params: { orderId: number }, filename: string) => {
        const {html, objectURL} = await generateDocument(url, params, filename);
        const downloadButtonHtml = `
        <a href="${objectURL}" download="${filename}.docx" style="display: block; margin: 20px;">
          Скачать
        </a>
      `;

        const newWindow = window.open("", "_blank");
        newWindow && newWindow.document.write(downloadButtonHtml);
        newWindow && newWindow.document.write(`
                <style>
                    img{
                        display: block;
                        max-width: 150px;
                        max-height: 32px;
                        object-fit: contain;
                    }
                    .last{
                        border-collapse: collapse;
                    }
                    .last *{
                        box-sizing: border-box;
                    }
                    .last tr{
                        display: grid;
                        grid-template-columns: 40px 1fr 1fr 0.25fr 0.5fr 0.5fr;
                    }
                    .last tr:first-child{
                        border: 1px solid purple;
                        text-align: center;
                        text-transform: uppercase;
                    }
                    .last td{
                        border: 1px solid #777;
                        padding: 4px;
                    }
                </style>
            `)
        newWindow && newWindow.document.write(html);
        newWindow && newWindow.document.write(`
                <script>
                const tables = [...document.querySelectorAll("table")];
                console.log(tables);
                if(tables && tables.length > 0) {
                    tables.at(-1).classList.add("last");
                }
                </script>
            `);

        newWindow && newWindow.document.close();
    }
    const previewCommerce = async (order: Order, companyId: number | undefined = 1) => {
        const url = "/doc/kp";
        const params = {orderId: order.id, companyId};
        const filename =
            "КП " +
            order.customer.companyName +
            " заказ №" +
            order.applicationNumber +
            ".docx";

        await printOffer(url, params, filename);
    };
    const previewToolOrder = async (
        order: Order,
        teId: number,
        feId: number
    ) => {
        const url = "/doc/tool-order";
        const params = {
            orderId: order.id,
            teId: teId,
            feId: feId,
            body: "Прошу отдел снабжения приобрести инструмент:",
        };
        const filename =
            "Заявка на инструмент на заказ №" +
            order.applicationNumber +
            ".docx";

        await printOffer(url, params, filename);
    };

    const previewPlan1 = async (order: Order) => {
        const url = "/doc/manufacturing-report";
        const params = {
            orderId: order.id,
        };
        const filename = "План на заказ №" + order.applicationNumber + ".xlsx";

        try {
            const response = await api.get(url, {
                params,
                responseType: "arraybuffer",
            });

            const blob = new Blob([response.data], {
                type: response.headers["content-type"],
            });
            saveAs(blob, filename);
        } catch (error) {
            console.error("There was an error downloading the file:", error);
        }
    };

    const previewPlan2 = async (order: Order) => {
        const url = "/doc/operation-report";
        const params = {
            orderId: order.id,
        };
        const filename = "План на заказ №" + order.applicationNumber + ".xlsx";

        try {
            const response = await api.get(url, {
                params,
                responseType: "arraybuffer",
            });

            const blob = new Blob([response.data], {
                type: response.headers["content-type"],
            });
            saveAs(blob, filename);
        } catch (error) {
            console.error("There was an error downloading the file:", error);
        }
    };

    return {generateDocument, printOffer, previewCommerce, previewToolOrder, previewPlan1, previewPlan2};
};
