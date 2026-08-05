import { dataApi } from "../../../../config/axios/dataApi";
import type {CreateClientResponse, FormDataPayload } from "../../../../types/oceanix/onboarding/onboarding_client";

export const createClient = async (
  payload: FormDataPayload,
): Promise<CreateClientResponse> => {
  const { data } = await dataApi.post("/api/v1/clients/", payload);
  return data;
};
