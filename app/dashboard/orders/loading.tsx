export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-black/5 rounded-lg mb-2" />
        <div className="h-5 w-72 bg-black/5 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-black/5 bg-white/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black/5" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-black/5 rounded mb-2" />
              <div className="h-3 w-32 bg-black/5 rounded" />
            </div>
            <div className="h-6 w-20 bg-black/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
