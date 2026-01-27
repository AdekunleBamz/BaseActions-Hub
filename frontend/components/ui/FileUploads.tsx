"use client";

import React, { useState, useRef, useCallback } from "react";

// ============================================================================
// FILE UPLOAD V2
// ============================================================================

interface FileUploadV2Props {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesSelected?: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function FileUploadV2({
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 10,
  onFilesSelected,
  onError,
  disabled = false,
  children,
  className = "",
}: FileUploadV2Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const validFiles: File[] = [];
      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        onError?.("Only one file is allowed");
        return [fileArray[0]];
      }

      if (fileArray.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return [];
      }

      for (const file of fileArray) {
        if (file.size > maxSize) {
          onError?.(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`);
          continue;
        }

        if (accept) {
          const acceptedTypes = accept.split(",").map((t) => t.trim());
          const fileType = file.type;
          const fileExtension = `.${file.name.split(".").pop()}`;

          const isAccepted = acceptedTypes.some(
            (type) =>
              type === fileType ||
              type === fileExtension ||
              (type.endsWith("/*") && fileType.startsWith(type.replace("/*", "")))
          );

          if (!isAccepted) {
            onError?.(`File "${file.name}" is not an accepted file type`);
            continue;
          }
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [accept, maxFiles, maxSize, multiple, onError]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected?.(validFiles);
      }
    }
    e.target.value = "";
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div onClick={handleClick} className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}>
        {children || (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="text-primary-500 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-400">
                {accept ? `Accepted: ${accept}` : "Any file type"} (Max: {formatFileSize(maxSize)})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// DRAG AND DROP ZONE V2
// ============================================================================

interface DragDropZoneV2Props extends Omit<FileUploadV2Props, "children"> {
  preview?: boolean;
  onRemove?: (index: number) => void;
}

export function DragDropZoneV2({
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 10,
  onFilesSelected,
  onError,
  onRemove,
  preview = true,
  disabled = false,
  className = "",
}: DragDropZoneV2Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) {
        onError?.(`File "${file.name}" exceeds maximum size`);
        return false;
      }
      return true;
    });

    const combined = multiple ? [...files, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, 1);
    setFiles(combined);
    onFilesSelected?.(combined);
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onRemove?.(index);
    onFilesSelected?.(newFiles);
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          disabled={disabled}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isDragOver ? "bg-primary-100 dark:bg-primary-800" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <svg
              className={`w-7 h-7 ${isDragOver ? "text-primary-500" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="text-primary-500 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {multiple ? `Up to ${maxFiles} files` : "Single file"} • Max {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {preview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <FileIcon filename={file.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// IMAGE UPLOAD V2
// ============================================================================

interface ImageUploadV2Props {
  value?: string;
  onChange?: (url: string | null, file?: File) => void;
  aspectRatio?: "square" | "video" | "banner";
  maxSize?: number;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  className?: string;
}

export function ImageUploadV2({
  value,
  onChange,
  aspectRatio = "square",
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  placeholder,
  className = "",
}: ImageUploadV2Props) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPreview(url);
      onChange?.(url, file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      <div
        className={`
          relative overflow-hidden rounded-xl border-2 border-dashed
          ${aspectRatioClass[aspectRatio]}
          ${preview ? "border-transparent" : "border-gray-300 dark:border-gray-600"}
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          transition-all duration-200 hover:border-primary-400
        `}
        onClick={() => !disabled && !preview && inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="p-2 bg-white/20 rounded-full text-white hover:bg-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            {placeholder || (
              <>
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Click to upload image
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COVER IMAGE UPLOAD
// ============================================================================

interface CoverImageUploadProps {
  value?: string;
  onChange?: (url: string | null, file?: File) => void;
  avatarUrl?: string;
  onAvatarChange?: (url: string | null, file?: File) => void;
  disabled?: boolean;
  className?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  avatarUrl,
  onAvatarChange,
  disabled = false,
  className = "",
}: CoverImageUploadProps) {
  const coverRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(value || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarUrl || null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setCoverPreview(url);
      onChange?.(url, file);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setAvatarPreview(url);
      onAvatarChange?.(url, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Cover Image */}
      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        onChange={handleCoverChange}
        disabled={disabled}
        className="hidden"
      />
      <div
        className={`
          relative h-48 rounded-xl overflow-hidden
          ${coverPreview ? "" : "bg-gradient-to-r from-primary-500 to-accent-500"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !disabled && coverRef.current?.click()}
      >
        {coverPreview && (
          <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
        )}
        {!disabled && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Change cover</span>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      {onAvatarChange && (
        <>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={disabled}
            className="hidden"
          />
          <div
            className={`
              absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden
              ${avatarPreview ? "" : "bg-gradient-to-br from-primary-500 to-accent-500"}
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
              shadow-lg
            `}
            onClick={(e) => {
              e.stopPropagation();
              !disabled && avatarRef.current?.click();
            }}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                ?
              </div>
            )}
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
  const isDocument = ["pdf", "doc", "docx", "txt"].includes(ext || "");
  const isVideo = ["mp4", "mov", "avi", "webm"].includes(ext || "");

  const iconColor = isImage
    ? "text-green-500"
    : isDocument
    ? "text-blue-500"
    : isVideo
    ? "text-purple-500"
    : "text-gray-500";

  return (
    <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${iconColor}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

export default FileUploadV2;
