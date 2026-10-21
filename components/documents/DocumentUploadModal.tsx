'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useDocuments } from '../../hooks/useDocuments';
import { useJoiValidation } from '../../hooks/useJoiValidation';
import { documentUploadMetadataSchema } from '../../utils/validation/document.schema';
import { DEPARTMENTS, ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../../utils/constants';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { uploadDocument, isUploading } = useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [department, setDepartment] = useState('General');
  const [customName, setCustomName] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  const { errors, validate } = useJoiValidation(documentUploadMetadataSchema);

  const handleFileChange = (file: File | undefined) => {
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
      setFileError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('File size exceeds the 10MB maximum limit.');
      return;
    }

    setSelectedFile(file);
    if (!customName) {
      setCustomName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Please select a document to upload.');
      return;
    }

    const isValid = validate({ department, name: customName });
    if (!isValid) return;

    try {
      await uploadDocument({
        file: selectedFile,
        department,
        name: customName || selectedFile.name,
      });

      dispatch(
        addToast({
          type: 'success',
          title: 'Document Uploaded',
          message: 'Document was added to the ingestion queue and is processing.',
        })
      );

      // Reset & close
      setSelectedFile(null);
      setCustomName('');
      setDepartment('General');
      onClose();
    } catch (err) {
      const error = err as Error;
      dispatch(
        addToast({
          type: 'error',
          title: 'Upload Failed',
          message: error.message || 'Could not upload document',
        })
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Knowledge Document"
      description="Upload enterprise policies, manuals, or handbooks for RAG indexing."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 rounded-full">
              <UploadCloud className="w-6 h-6" />
            </div>
            {selectedFile ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Click to browse or drag and drop document
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported formats: PDF, DOCX, TXT (Max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {fileError && (
          <p className="text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {fileError}
          </p>
        )}

        {/* Document Name */}
        <Input
          label="Document Title (Optional)"
          placeholder="e.g. Remote Work Policy 2026"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          error={errors.name}
        />

        {/* Department Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Target Department / Access Group
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department}</p>}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isUploading} disabled={!selectedFile}>
            Upload & Ingest
          </Button>
        </div>
      </form>
    </Modal>
  );
};
