'use client';
import { useState } from 'react';

export default function Home() {
  const [pdf, setPdf] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!pdf || !photo) {
      setStatus('⚠️ Please select both a PDF and a photo.');
      return;
    }

    setLoading(true);
    setStatus('Uploading files...');

    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('photo', photo);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      setStatus('❌ Upload failed.');
      setLoading(false);
      return;
    }

    setStatus('Merging PDF and photo...');

    const mergeRes = await fetch('/api/merge');
    if (!mergeRes.ok) {
      setStatus('❌ Merge failed.');
      setLoading(false);
      return;
    }

    setStatus('✅ Merge successful. You can now download your file.');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Resume + Photo Merger
        </h1>

        <div className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Upload & Merge'}
          </button>

          {status && <p className="text-center text-sm text-gray-700">{status}</p>}

          {status.includes('download') && (
            <a
              href="/api/download"
              className="block text-center mt-4 text-blue-600 underline"
              download
            >
              ⬇️ Download Merged PDF
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
