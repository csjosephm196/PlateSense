import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator({ sessionId, onRefresh }) {
  const uploadUrl = sessionId ? `${window.location.origin}/upload/${sessionId}` : '';

  return (
    <div className="flex flex-col items-center">
      {sessionId ? (
        <>
          <QRCodeSVG value={uploadUrl} size={200} level="M" className="rounded-lg" />
          <p className="mt-4 text-sm text-slate-500 text-center">
            Scan with your phone to upload a meal photo
          </p>
          <button
            onClick={onRefresh}
            className="mt-4 text-sm text-brand-purple font-medium hover:text-brand-purple-dark"
          >
            Refresh QR code
          </button>
        </>
      ) : (
        <p className="text-slate-500">Loading...</p>
      )}
    </div>
  );
}
