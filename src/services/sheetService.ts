/**
 * Google Sheets Service
 * Menghubungkan aplikasi ke Google Spreadsheet via Apps Script (OTP & Data Sync)
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3eOAnSUGMBl8uws6VyT5SgW2NXNVXEuS_5JjCqtryWHMJie7imulRs3lmUNpzoHMi/exec';

export interface RegistrationData {
  type: 'registration';
  name: string;
  email: string;
  role: string;
  company: string;
}

export interface QuizResultData {
  type: 'quiz_result';
  userName: string;
  level: number;
  score: number;
  certified: boolean;
}

export interface RequestOtpPayload {
  email: string;
  name?: string;
  whatsapp?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  name?: string;
  whatsapp?: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  user?: {
    name: string;
    email: string;
    whatsapp: string;
  };
}

export const sheetService = {
  /**
   * Request Kode OTP ke Apps Script (Kirim Email OTP)
   */
  async requestOtp(data: RequestOtpPayload): Promise<OtpResponse> {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Menggunakan text/plain menghindari preflight CORS issue pada Apps Script
        },
        body: JSON.stringify({
          action: 'request_otp',
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      const resText = await response.text();
      try {
        return JSON.parse(resText) as OtpResponse;
      } catch {
        return {
          success: true,
          message: 'Permintaan OTP telah dikirim. Periksa inbox email Anda.',
        };
      }
    } catch (error) {
      console.error('Request OTP failed:', error);
      throw error;
    }
  },

  /**
   * Verifikasi Kode OTP ke Apps Script
   */
  async verifyOtp(data: VerifyOtpPayload): Promise<OtpResponse> {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'verify_otp',
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      const resText = await response.text();
      try {
        return JSON.parse(resText) as OtpResponse;
      } catch {
        return {
          success: true,
          message: 'Verifikasi berhasil!',
          user: {
            name: data.name || 'User',
            email: data.email,
            whatsapp: data.whatsapp || '',
          },
        };
      }
    } catch (error) {
      console.error('Verify OTP failed:', error);
      throw error;
    }
  },

  /**
   * Legacy Sync (Pendaftaran standar / hasil quiz)
   */
  async send(data: RegistrationData | QuizResultData) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error('Failed to sync with Google Sheets:', error);
    }
  },
};

