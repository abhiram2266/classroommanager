import { storage } from './firebase';
import { db } from './firebase';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';

export type MaterialCategory = 'pyq' | 'notes' | 'books' | 'lab-manual' | 'assignments' | 'other';

export interface StudyMaterial {
  id: string;
  name: string;
  fileName: string;
  category: MaterialCategory;
  subject: string;
  semester: string;
  uploadedBy: string;
  uploadedAt: number;
  downloadUrl: string;
  storagePath: string;
  size: number;
  description?: string;
  downloads: number;
}

const STORAGE_BASE_PATH = 'study-materials';

/**
 * Upload a study material file
 */
export async function uploadStudyMaterial(
  file: File,
  category: MaterialCategory,
  subject: string,
  semester: string,
  uploadedBy: string,
  description?: string
): Promise<StudyMaterial> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${STORAGE_BASE_PATH}/${category}/${subject}/${fileName}`;
    const fileRef = ref(storage, filePath);

    // Upload file to storage
    await uploadBytes(fileRef, file);

    // Get download URL
    const downloadUrl = await getDownloadURL(fileRef);

    // Add metadata to Firestore
    const docRef = await addDoc(collection(db, 'studyMaterials'), {
      name: file.name,
      fileName: fileName,
      category,
      subject,
      semester,
      uploadedBy,
      uploadedAt: Timestamp.now(),
      downloadUrl,
      storagePath: filePath,
      size: file.size,
      description: description || '',
      downloads: 0,
    });

    const material: StudyMaterial = {
      id: docRef.id,
      name: file.name,
      fileName: fileName,
      category,
      subject,
      semester,
      uploadedBy,
      uploadedAt: Date.now(),
      downloadUrl,
      storagePath: filePath,
      size: file.size,
      description: description || '',
      downloads: 0,
    };

    return material;
  } catch (error) {
    console.error('Error uploading study material:', error);
    throw error;
  }
}

/**
 * Get all study materials
 */
export async function getAllStudyMaterials(): Promise<StudyMaterial[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'studyMaterials'));
    const materials: StudyMaterial[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      materials.push({
        id: doc.id,
        name: data.name,
        fileName: data.fileName,
        category: data.category,
        subject: data.subject,
        semester: data.semester,
        uploadedBy: data.uploadedBy,
        uploadedAt: data.uploadedAt?.toDate?.().getTime?.() || Date.now(),
        downloadUrl: data.downloadUrl,
        storagePath: data.storagePath,
        size: data.size || 0,
        description: data.description || '',
        downloads: data.downloads || 0,
      });
    });

    return materials.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (error) {
    console.error('Error fetching study materials:', error);
    throw error;
  }
}

/**
 * Get materials by category
 */
export async function getMaterialsByCategory(category: MaterialCategory): Promise<StudyMaterial[]> {
  try {
    const q = query(collection(db, 'studyMaterials'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const materials: StudyMaterial[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      materials.push({
        id: doc.id,
        name: data.name,
        fileName: data.fileName,
        category: data.category,
        subject: data.subject,
        semester: data.semester,
        uploadedBy: data.uploadedBy,
        uploadedAt: data.uploadedAt?.toDate?.().getTime?.() || Date.now(),
        downloadUrl: data.downloadUrl,
        storagePath: data.storagePath,
        size: data.size || 0,
        description: data.description || '',
        downloads: data.downloads || 0,
      });
    });

    return materials.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (error) {
    console.error('Error fetching materials by category:', error);
    throw error;
  }
}

/**
 * Get materials by subject
 */
export async function getMaterialsBySubject(subject: string): Promise<StudyMaterial[]> {
  try {
    const q = query(collection(db, 'studyMaterials'), where('subject', '==', subject));
    const querySnapshot = await getDocs(q);
    const materials: StudyMaterial[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      materials.push({
        id: doc.id,
        name: data.name,
        fileName: data.fileName,
        category: data.category,
        subject: data.subject,
        semester: data.semester,
        uploadedBy: data.uploadedBy,
        uploadedAt: data.uploadedAt?.toDate?.().getTime?.() || Date.now(),
        downloadUrl: data.downloadUrl,
        storagePath: data.storagePath,
        size: data.size || 0,
        description: data.description || '',
        downloads: data.downloads || 0,
      });
    });

    return materials.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (error) {
    console.error('Error fetching materials by subject:', error);
    throw error;
  }
}

/**
 * Delete a study material
 */
export async function deleteStudyMaterial(id: string, storagePath: string): Promise<void> {
  try {
    // Delete from storage
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);

    // Delete from Firestore
    await deleteDoc(doc(db, 'studyMaterials', id));
  } catch (error) {
    console.error('Error deleting study material:', error);
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

/**
 * Get category display name
 */
export function getCategoryName(category: MaterialCategory): string {
  const names: Record<MaterialCategory, string> = {
    pyq: 'Previous Year Questions',
    notes: 'Class Notes',
    books: 'Reference Books',
    'lab-manual': 'Lab Manual',
    assignments: 'Assignments',
    other: 'Other',
  };
  return names[category];
}

/**
 * Get category icon emoji
 */
export function getCategoryEmoji(category: MaterialCategory): string {
  const emojis: Record<MaterialCategory, string> = {
    pyq: '📝',
    notes: '📖',
    books: '📚',
    'lab-manual': '🔬',
    assignments: '✍️',
    other: '📄',
  };
  return emojis[category];
}
