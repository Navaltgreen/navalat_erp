import { dataApi } from "../../../../config/axios/dataApi";
import type { UploadDocumentResponse } from "../../../../types/sales/proposal/uploadDocument.response";

function resolveUploadedFileUrl(response: UploadDocumentResponse): string {
  const nestedDataUrl = response.data?.url;

  if (nestedDataUrl) {
    return nestedDataUrl;
  }

  const directUrl =
    response.url ?? response.image ?? response.file_url ?? response.s3Url;

  if (directUrl) {
    return directUrl;
  }

  const nestedData = response.data;

  if (nestedData && typeof nestedData === "object") {
    const nestedUrl =
      nestedData.url ??
      nestedData.image ??
      nestedData.file_url ??
      nestedData.s3Url;

    if (nestedUrl) {
      return nestedUrl;
    }
  }

  throw new Error("Upload succeeded but no file URL was returned");
}

export async function uploadDocument(file: File) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await dataApi.post<UploadDocumentResponse>(
    "/api/v1/sales/upload/image/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return resolveUploadedFileUrl(response.data);
}
