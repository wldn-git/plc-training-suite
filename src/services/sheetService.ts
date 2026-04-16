/**
 * Google Sheets Service
 * Menghubungkan aplikasi ke Google Spreadsheet via Apps Script
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVUSR1zaSNI8XdmAZsS-2oYxuTQqMH2Xowr8A9aZfqUPe4AlICdSnkJVmCIyItozMMuA/exec';

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

export const sheetService = {
  async send(data: RegistrationData | QuizResultData) {
    if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      console.warn('Sheets URL not configured, skipping cloud sync.');
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script butuh no-cors untuk simple POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error('Failed to sync with Google Sheets:', error);
    }
  }
};
