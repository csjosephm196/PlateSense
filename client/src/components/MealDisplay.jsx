export default function MealDisplay({ imageUrl }) {
  if (!imageUrl) {
    return (
      <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
        Waiting for meal photo...
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt="Meal"
      className="w-full aspect-video object-cover rounded-xl"
    />
  );
}
