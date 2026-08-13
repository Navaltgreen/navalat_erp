// query/uploadDocument.query.ts

import { useMutation } from "@tanstack/react-query";
import { uploadDocument } from "../../../../services/sales/management/proposal/uploadFile.service";

export function useUploadDocumentMutation() {
  return useMutation({
    mutationFn: uploadDocument,
  });
}
