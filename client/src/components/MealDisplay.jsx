export default function MealDisplay({ imageUrl }) {
  if (!imageUrl) {
    return (
      <div className="aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
        <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-400 font-medium">Waiting for meal photo...</p>
        <p className="text-xs text-gray-300 mt-1">Scan the QR code with your phone</p>
      </div>
    );
  }
  return (
    <div className="relative group">
      <img
        src={imageUrl}
        alt="Meal"
        className="w-full aspect-video object-cover rounded-xl"
      />
      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Received
      </div>
    </div>
  );
}
