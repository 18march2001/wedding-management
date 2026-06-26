// Common UI States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface DataState<T> extends LoadingState {
  data: T | null;
}

// UI Modal/Dialog
export interface Modal {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backdrop?: boolean;
}

export interface ConfirmDialog extends Modal {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// File Upload
export interface FileUpload {
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadOptions {
  maxSize: number; // bytes
  acceptedFormats: string[];
  multiple: boolean;
}

// Notification/Toast
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number; // milliseconds, 0 for permanent
  action?: {
    label: string;
    callback: () => void;
  };
}

// Breadcrumb
export interface Breadcrumb {
  label: string;
  to?: string;
  isActive?: boolean;
}

// Sorting
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Filter
export interface FilterItem {
  id: string;
  label: string;
  value: any;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: any;
}
