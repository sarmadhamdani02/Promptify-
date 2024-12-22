export interface ApiResponse {
  success: boolean; // Indicates whether the request was successful or not.
  message: string; // A human-readable message (e.g., success or error message).
  data?: string; // The data returned from the API, if any (optional).
  errorCode?: string; // A code for specific error types (optional).
  timestamp?: string; // Time when the response was generated (optional).
  meta?: Record<string, any>; // Additional metadata, such as pagination or rate-limiting info (optional).
}
