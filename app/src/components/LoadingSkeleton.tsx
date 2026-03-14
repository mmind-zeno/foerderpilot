export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Intro-Text Skeleton */}
      <div className="bg-white border border-[#D4D1CB] rounded-lg p-6 mb-8">
        <div className="shimmer-bg h-4 w-3/4 rounded mb-3" />
        <div className="shimmer-bg h-4 w-1/2 rounded" />
      </div>

      {/* Card Skeletons */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-white border border-[#D4D1CB] rounded-lg p-6"
          style={{ opacity: 1 - i * 0.15 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="shimmer-bg h-5 w-2/3 rounded mb-2" />
              <div className="shimmer-bg h-3 w-1/3 rounded" />
            </div>
            <div className="shimmer-bg h-6 w-16 rounded-full ml-4" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="shimmer-bg h-3 w-full rounded" />
            <div className="shimmer-bg h-3 w-full rounded" />
            <div className="shimmer-bg h-3 w-4/5 rounded" />
          </div>
          <div className="flex gap-3 pt-3 border-t border-[#EAE8E4]">
            <div className="shimmer-bg h-3 w-28 rounded" />
            <div className="shimmer-bg h-3 w-24 rounded" />
          </div>
        </div>
      ))}

      <p className="text-center text-[#9B998F] text-sm pt-4 animate-pulse">
        KI analysiert 100 Förderungen in Liechtenstein…
      </p>
    </div>
  )
}
