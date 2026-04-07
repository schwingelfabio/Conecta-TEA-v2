import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Video, Upload, X, Save } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function MediaUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'media'), {
        url: downloadUrl,
        caption,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: serverTimestamp(),
        type: file.type.startsWith('video') ? 'video' : 'image'
      });
      
      setFile(null);
      setPreviewUrl(null);
      setCaption('');
      setTags('');
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-4">Upload Media</h2>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
      
      {!previewUrl ? (
        <div className="flex gap-4">
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-4 bg-sky-50 text-sky-700 rounded-xl flex flex-col items-center gap-2 hover:bg-sky-100">
            <Upload /> Upload
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {file?.type.startsWith('video') ? (
            <video src={previewUrl} className="w-full rounded-xl" controls />
          ) : (
            <img src={previewUrl} className="w-full rounded-xl" alt="Preview" />
          )}
          <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border rounded-lg" />
          <div className="flex gap-2">
            <button onClick={() => { setPreviewUrl(null); setFile(null); }} className="p-2 bg-gray-100 rounded-lg"><X /></button>
            <button onClick={handleUpload} disabled={uploading} className="flex-1 p-2 bg-sky-600 text-white rounded-lg font-bold flex items-center justify-center gap-2">
              <Save size={20} /> {uploading ? 'Uploading...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
