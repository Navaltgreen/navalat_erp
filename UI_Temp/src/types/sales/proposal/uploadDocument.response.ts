export type UploadDocumentResponse = {
  success?: boolean;
  status?: string;
  message?: string;
  meta?: Record<string, unknown>;
  s3Url?: string;
  url?: string;
  image?: string;
  file_url?: string;
  data?: {
    filename?: string;
    url?: string;
    image?: string;
    file_url?: string;
    s3Url?: string;
  };
};
