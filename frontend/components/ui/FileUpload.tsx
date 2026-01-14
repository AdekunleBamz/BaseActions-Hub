"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface FilePreview {
  file: File;
  preview?: string;
  error?: string;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      onFilesSelected,
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB default
      maxFiles = 10,
      disabled = false,
      className,
      children,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [error, setError] = useState<string | null>(null);

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const validateFiles = useCallback(
      (fileList: FileList | File[]): FilePreview[] => {
        const validFiles: FilePreview[] = [];
        const fileArray = Array.from(fileList);

        if (!multiple && fileArray.length > 1) {
          setError("Only one file allowed");
          return [];
        }

        if (fileArray.length > maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
          return [];
        }

        for (const file of fileArray) {
          if (file.size > maxSize) {
            validFiles.push({
              file,
              error: `File exceeds ${formatSize(maxSize)} limit`,
            });
            continue;
          }

          const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined;

          validFiles.push({ file, preview });
        }

        return validFiles;
      },
      [multiple, maxSize, maxFiles]
    );

    const handleFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList || disabled) return;

        setError(null);
        const validated = validateFiles(fileList);
        
        if (validated.length > 0) {
          setFiles(validated);
          const validFiles = validated.filter((f) => !f.error).map((f) => f.file);
          if (validFiles.length > 0) {
            onFilesSelected?.(validFiles);
          }
        }
      },
      [disabled, validateFiles, onFilesSelected]
    );

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
      if (!disabled) inputRef.current?.click();
    };

    const removeFile = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      const validFiles = newFiles.filter((f) => !f.error).map((f) => f.file);
      onFilesSelected?.(validFiles);
    };

    const clearAll = () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFiles([]);
      setError(null);
      onFilesSelected?.([]);
    };

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/20 hover:border-white/40",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {children || (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-gray-300">
                Drag & drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Max size: {formatSize(maxSize)}
                {multiple && ` • Max files: ${maxFiles}`}
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </span>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
            {files.map((file, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg bg-white/5",
                  file.error && "border border-red-500/50"
                )}
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.file.name}</p>
                  <p className={cn(
                    "text-xs",
                    file.error ? "text-red-400" : "text-gray-500"
                  )}>
                    {file.error || formatSize(file.file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
);

FileUpload.displayName = "FileUpload";
