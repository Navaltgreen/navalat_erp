import { dataApi } from "../../../../config/axios/dataApi";
import type { UploadDocumentResponse } from "../../../../types/sales/proposal/uploadDocument.response";
export async function uploadDocument(file: File) {
  const formData = new FormData();

  formData.append("file", file);
  const response = await dataApi.post<UploadDocumentResponse>(
    `http://192.168.54.141:3005/api/post/document`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
