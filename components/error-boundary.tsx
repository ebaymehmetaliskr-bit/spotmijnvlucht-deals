"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center animate-fadeIn">
        <div className="mb-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oeps! Er ging iets mis</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We hebben een onverwachte fout ondervonden. Probeer het opnieuw of neem contact met ons op als het probleem
            aanhoudt.
          </p>
          <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
              Technische details
            </summary>
            <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">{error.message}</pre>
          </details>
        </div>
        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Probeer opnieuw
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
            Terug naar home
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ApiErrorDisplay({ error, retry }: { error: string; retry?: () => void }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-fadeIn">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Er is een fout opgetreden</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          {retry && (
            <Button
              variant="outline"
              size="sm"
              onClick={retry}
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Opnieuw proberen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
