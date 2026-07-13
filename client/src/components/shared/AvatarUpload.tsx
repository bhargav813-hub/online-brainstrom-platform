'use client';

import React, { useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserAvatar } from './UserAvatar';
import { userService } from '@/services/user.service';

interface AvatarUploadProps {
  currentAvatar?: string;
  name: string;
  onUploadSuccess: (newAvatar: string) => void;
  onDeleteSuccess: () => void;
}

export function AvatarUpload({ currentAvatar, name, onUploadSuccess, onDeleteSuccess }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    // Set preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);
    setProgress(0);

    try {
      const updatedUser = await userService.uploadAvatar(file, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      onUploadSuccess(updatedUser.avatar!);
      setPreviewUrl(null);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload avatar. Please try again.');
      setPreviewUrl(null); // Revert preview on failure
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDelete = async () => {
    if (!currentAvatar && !previewUrl) return;
    
    setIsDeleting(true);
    try {
      await userService.deleteAvatar();
      setPreviewUrl(null);
      onDeleteSuccess();
      toast.success('Avatar removed successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove avatar');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayUrl = previewUrl || currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <UserAvatar
          name={name}
          avatar={displayUrl}
          className="h-24 w-24 text-2xl transition-all duration-300 group-hover:opacity-75"
          size="lg" // Override size with custom classes above
        />
        
        {/* Upload Overlay */}
        <label
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity cursor-pointer
            ${isUploading ? 'opacity-100' : 'group-hover:opacity-100'}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-6 w-6 animate-spin mb-1" />
              <span className="text-xs font-medium">{progress}%</span>
            </div>
          ) : (
            <Camera className="h-8 w-8" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading || isDeleting}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="text-sm font-medium text-primary hover:underline focus:outline-none"
        >
          Change Avatar
        </button>
        {displayUrl && (
          <>
            <span className="text-muted-foreground">•</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
              className="text-sm font-medium text-destructive hover:underline focus:outline-none flex items-center gap-1"
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
