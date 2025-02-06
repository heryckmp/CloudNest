"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileDrop(acceptedFiles).catch(console.error);
  }, []);

  const handleFileDrop = async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles.map(f => ({ 
      name: f.name, 
      size: f.size, 
      type: f.type,
      lastModified: f.lastModified
    })));

    for (const file of acceptedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        console.log('File too large:', { 
          name: file.name, 
          size: file.size, 
          maxSize: MAX_FILE_SIZE 
        });

        toast({
          description: (
            <p className="text-sm font-normal text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>
          ),
          className: "bg-destructive",
        });
        continue;
      }

      setFiles((prev) => [...prev, file]);
      setUploadingFiles((prev) => new Set(prev).add(file.name));

      console.log('Starting upload for file:', { 
        name: file.name, 
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      try {
        console.log('Calling uploadFile function with:', {
          fileName: file.name,
          fileType: file.type,
          ownerId,
          accountId,
          path
        });
        
        const success = await uploadFile({ 
          file, 
          ownerId, 
          accountId, 
          path: path || '/'
        });
        
        console.log('Upload result:', { 
          fileName: file.name, 
          success,
          fileInfo: {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          }
        });
        
        if (!success) {
          throw new Error("Failed to upload file");
        }

        toast({
          description: (
            <p className="text-sm font-normal text-white">
              <span className="font-semibold">{file.name}</span> uploaded successfully!
            </p>
          ),
          className: "bg-green-500",
        });
      } catch (error: unknown) {
        let errorMessage = "Falha ao fazer upload do arquivo. Por favor, tente novamente.";
        
        if (error instanceof Error) {
          console.error(`Error uploading ${file.name}:`, {
            message: error.message,
            stack: error.stack,
            fileInfo: {
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            },
          });
          errorMessage = error.message;
        } else {
          console.error(`Unknown error uploading ${file.name}:`, {
            error,
            fileInfo: {
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            },
          });
        }
        
        toast({
          description: (
            <p className="text-sm font-normal text-white">
              {errorMessage}
            </p>
          ),
          className: "bg-destructive",
        });
      } finally {
        console.log('Cleaning up file states:', file.name);
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(file.name);
          return newSet;
        });
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    }
  });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    if (!uploadingFiles.has(fileName)) {
      setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    }
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("flex items-center gap-2 bg-primary text-white hover:bg-primary/90", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
          className="h-6 w-6"
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h4 className="text-lg font-bold text-black dark:text-white">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            const isUploading = uploadingFiles.has(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{file.name}</span>
                    {isUploading && (
                      <Image
                        src="/assets/icons/file-loader.gif"
                        width={80}
                        height={26}
                        alt="Loader"
                        className="h-auto w-20"
                      />
                    )}
                  </div>
                </div>

                {!isUploading && (
                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt="Remove"
                    className="h-6 w-6 cursor-pointer"
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
