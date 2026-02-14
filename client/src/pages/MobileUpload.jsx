import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const API = '/api';

export default function MobileUpload() {
  const { sessionId } = useParams();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const fileRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef();

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Camera access denied');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  async function captureAndUpload() {
    if (!videoRef.current?.srcObject || !sessionId) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'meal.jpg');
      formData.append('sessionId', sessionId);
      setStatus('uploading');
      setError('');
      try {
        const res = await fetch(`${API}/upload-meal-image`, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Upload failed');
        setStatus('success');
        stopCamera();
      } catch (err) {
        setError(err.message);
        setStatus('idle');
      }
    }, 'image/jpeg', 0.9);
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', sessionId);
    setStatus('uploading');
    setError('');
    try {
      const res = await fetch(`${API}/upload-meal-image`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Plate<span className="text-brand-purple">Sense</span>
      </h1>
      <p className="text-slate-600 mb-8">Upload meal photo</p>

      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-8 py-6 text-emerald-800 text-center max-w-sm">
          <p className="font-semibold text-lg">Upload complete!</p>
          <p className="text-sm mt-2">Check your desktop dashboard for analysis.</p>
        </div>
      )}

      {status === 'idle' && (
        <>
          <div className="w-full max-w-sm aspect-square bg-slate-200 rounded-2xl overflow-hidden mb-6 border border-slate-200 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={startCamera}
              className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Start camera
            </button>
            <button
              onClick={captureAndUpload}
              className="flex-1 py-3 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark transition-colors"
            >
              Capture & upload
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-6">or</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-2 py-3 px-8 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-brand-purple hover:text-brand-purple transition-colors"
          >
            Choose from gallery
          </button>
        </>
      )}

      {status === 'uploading' && (
        <p className="text-slate-600 font-medium">Uploading...</p>
      )}

      {error && (
        <p className="mt-6 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
