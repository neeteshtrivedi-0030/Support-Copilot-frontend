export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';

export const AUTH_STORAGE_KEY = 'support_copilot_auth_token';
export const REFRESH_STORAGE_KEY = 'support_copilot_refresh_token';
export const USER_STORAGE_KEY = 'support_copilot_user';

export const DEPARTMENTS = [
  { value: 'General', label: 'General / Company-Wide' },
  { value: 'HR', label: 'Human Resources (HR)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Security', label: 'Security & Compliance' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Operations', label: 'Operations' },
] as const;

export const DOCUMENT_TYPES = [
  { value: 'pdf', label: 'PDF Document (.pdf)' },
  { value: 'docx', label: 'Word Document (.docx)' },
  { value: 'txt', label: 'Plain Text (.txt)' },
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx', '.txt'];
