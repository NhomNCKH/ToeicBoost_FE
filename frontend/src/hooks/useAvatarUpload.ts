import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const presignRes = await apiClient.media.getPresignedUploadUrl({
        fileName: file.name,
        contentType: file.type,
        category: 'avatar',
      });

      if (presignRes.statusCode !== 200) {
        throw new Error(presignRes.message || 'Khong the lay presigned URL');
      }

      const { signedPutUrl, s3Key } = presignRes.data;
      setProgress(25);

      const s3Res = await fetch(signedPutUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!s3Res.ok) {
        throw new Error('Upload len S3 that bai');
      }

      setProgress(75);

      const attachRes = await apiClient.auth.attachAvatarFromS3(s3Key);

      if (attachRes.statusCode !== 200) {
        throw new Error(attachRes.message || 'Cap nhat avatar that bai');
      }

      setProgress(100);

      const avatarUrl = (attachRes.data as any)?.avatarUrl as string | undefined;
      return avatarUrl ?? null;
    } catch (err: any) {
      setError(err.message || 'Upload avatar that bai');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading, progress, error };
};
