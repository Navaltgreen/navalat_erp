export type FieldType = "text" | "email" | "textarea";

export type Field = {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  options?: { label: string; value: string }[];
  rules?: {
    required?: boolean;
    message?: string;
    pattern?: RegExp;
  }[];
};

export interface FormData {
  name: string;
  email: string;
  phone_number: string;
  country: string;
  address: string;
}
export interface FormDataPayload {
  name: string;
  email: string;
  phone_number: number;
  country: string;
  address: string;
}

export type FormErrors = Partial<Record<keyof FormDataPayload, string>>;


export interface CreateClientResponse {
  success: boolean;
  message: string;
  data: FormDataPayload;
  meta: {
    status_code: number;
  };
}
