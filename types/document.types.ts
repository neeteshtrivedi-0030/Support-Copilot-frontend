import { UserDepartment } from './auth.types';

export type DocumentType = 'pdf' | 'docx' | 'txt';

export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed';

export interface DocumentItem {
  _id: string;
  name: string;
  originalName: string;
  type: DocumentType;
  department: UserDepartment;
  status: DocumentStatus;
  fileHash: string;
  fileSize: number;
  uploadedBy:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  chunksCount?: number;
  storageKey?: string;
  s3Url?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListQuery {
  page?: number;
  limit?: number;
  department?: string;
  status?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentUploadPayload {
  file: File;
  department: string;
  name?: string;
}

export interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DocumentTableProps {
  documents: DocumentItem[];
  isLoading: boolean;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}
