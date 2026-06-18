'use client';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Error Icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-muted text-sm max-w-sm">
            {message}
          </p>
        </div>

        {/* Try Again Button */}
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-3 bg-accent text-background font-semibold rounded-xl hover:bg-accent/90 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
