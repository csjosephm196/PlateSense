import { QRCodeSVG } from 'qrcode.react';

function getNetworkUrl(sessionId) {
  const { protocol, hostname, port } = window.location;
  // If accessed via localhost, try to use the LAN IP from the page URL instead
  // The user should open the desktop dashboard using the Network URL shown by Vite
  return `${protocol}//${hostname}${port ? `:${port}` : ''}/upload/${sessionId}`;
}

export default function QRGenerator({ sessionId, onRefresh }) {
  const uploadUrl = sessionId ? getNetworkUrl(sessionId) : '';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="flex flex-col items-center">
      {sessionId ? (
        <>
          <QRCodeSVG value={uploadUrl} size={200} level="M" className="rounded-lg" />
          <p className="mt-4 text-sm text-slate-500 text-center">
            Scan with your phone to upload a meal photo
          </p>
          {isLocalhost && (
            <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center max-w-xs">
              Open this page using the <strong>Network URL</strong> shown in your terminal (e.g. http://192.168.x.x:5173) so your phone can connect.
            </p>
          )}
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
