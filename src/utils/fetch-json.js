import { APIError } from "./api-error.js";

const fetchJson = async (
  url,
  { serviceName, timeoutMs = 10000, headers = {} },
) => {
  try {
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      throw new APIError(
        502,
        `${serviceName} is temporarily unavailable. Please try again.`,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new APIError(504, `${serviceName} timed out. Please try again.`);
    }

    throw new APIError(
      502,
      `${serviceName} is temporarily unavailable. Please try again.`,
    );
  }
};

export { fetchJson };
