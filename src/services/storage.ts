import { storage } from './firebase';
import { ref, uploadBytes, deleteObject, listAll, getDownloadURL, getMetadata } from 'firebase/storage';

export interface StorageFile {
  name: string;
  size: number;
  uploadedAt: number;
  downloadUrl: string;
  path: string;
}

const STORAGE_BASE_PATH = 'college-drive';

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(file: File, userId: string): Promise<StorageFile> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${STORAGE_BASE_PATH}/${userId}/${fileName}`;
    const fileRef = ref(storage, filePath);

    // Upload file
    await uploadBytes(fileRef, file);

    // Get download URL
    const downloadUrl = await getDownloadURL(fileRef);

    const storageFile: StorageFile = {
      name: file.name,
      size: file.size,
      uploadedAt: Date.now(),
      downloadUrl,
      path: filePath,
    };

    return storageFile;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Get all files for a user
 */
export async function getUserFiles(userId: string): Promise<StorageFile[]> {
  try {
    const userPath = `${STORAGE_BASE_PATH}/${userId}`;
    const userRef = ref(storage, userPath);

    const result = await listAll(userRef);
    const files: StorageFile[] = [];

    for (const fileRef of result.items) {
      try {
        const downloadUrl = await getDownloadURL(fileRef);
        const metadata = await getMetadata(fileRef);
        
        files.push({
          name: fileRef.name,
          size: metadata.size || 0,
          uploadedAt: metadata.timeCreated ? new Date(metadata.timeCreated).getTime() : Date.now(),
          downloadUrl,
          path: fileRef.fullPath,
        });
      } catch (error) {
        console.warn(`Failed to get metadata for ${fileRef.name}:`, error);
        // Continue with next file
      }
    }

    return files.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
