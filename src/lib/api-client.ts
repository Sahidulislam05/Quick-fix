import { ofetch } from "ofetch";
import { ApiError } from "./api-error";
import { clearAccessToken, getAccessToken } from "./auth-token";
import { env } from "./env";

type BackendErrorBody = {
  success: false;
  message?: string;
  errorDetails?: {
    statusCode?: number;
    name?: string;
    issues?: unknown[];
  };
};

export const apiClient = ofetch.create({
  baseURL: `${env.apiUrl}/api`,
  retry: 0,

  onRequest({ options }) {
    const token = getAccessToken();
    if (token) {
      const headers = new Headers(options.headers as HeadersInit);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },

  onResponseError({ response }) {
    const body = response._data as BackendErrorBody | undefined;

    if (response.status === 401) {
      clearAccessToken();
    }

    throw new ApiError(
      body?.message ?? "Something went wrong. Please try again.",
      response.status,
      body?.errorDetails?.issues,
    );
  },
});
