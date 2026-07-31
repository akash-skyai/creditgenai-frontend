export interface SendOtpRequest {
  mobileNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}
