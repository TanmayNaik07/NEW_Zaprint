export default function ShopsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-black/5 rounded-lg mb-2" />
        <div className="h-5 w-72 bg-black/5 rounded-lg" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 w-full bg-black/5 rounded-lg" />

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-black/5 bg-white/50 overflow-hidden">
            <div className="h-40 bg-black/5" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-32 bg-black/5 rounded" />
              <div className="h-4 w-48 bg-black/5 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-black/5 rounded-full" />
                <div className="h-6 w-16 bg-black/5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
