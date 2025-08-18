export function DealCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 shimmer" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 shimmer" />
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 shimmer" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 shimmer" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
      </div>
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin" />
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
      <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-300">Deals laden...</span>
    </div>
  )
}

export function ButtonLoadingState({ children, isLoading, ...props }: any) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${props.className} transition-all duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Laden...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export function SuccessAnimation({ show, message }: { show: boolean; message: string }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm mx-4 text-center animate-bounce-custom">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{message}</p>
      </div>
    </div>
  )
}
