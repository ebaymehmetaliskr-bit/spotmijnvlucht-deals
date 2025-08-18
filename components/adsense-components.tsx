"use client"

import { useEffect } from "react"

// Header Banner Ad
export function HeaderBannerAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 py-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
            data-ad-slot="1234567890" // Replace with your ad slot ID
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
          {/* Fallback for development/testing */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 text-center text-gray-600 text-sm">
            <span>Advertisement Space - 728x90 Header Banner</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sidebar Ad (Desktop)
export function SidebarAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className="hidden lg:block sticky top-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
          data-ad-slot="0987654321"
          data-ad-format="rectangle"
          data-full-width-responsive="true"
        />
        {/* Fallback for development/testing */}
        <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-lg h-64 flex items-center justify-center text-gray-600 text-sm">
          <span>300x250 Sidebar Ad</span>
        </div>
      </div>
    </div>
  )
}

// In-Content Ad (Between sections)
export function InContentAd({ className = "" }: { className?: string }) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">Advertisement</div>
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
            data-ad-slot="1122334455"
            data-ad-format="fluid"
            data-ad-layout="in-article"
            data-full-width-responsive="true"
          />
          {/* Fallback for development/testing */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center text-gray-600">
            <span>Responsive In-Content Advertisement</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Between Deal Rows Ad
export function BetweenDealsAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className="col-span-full my-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-xs text-gray-500 mb-3 text-center">Gesponsord</div>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
          data-ad-slot="5566778899"
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-full-width-responsive="true"
        />
        {/* Fallback for development/testing */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-8 text-center text-gray-600">
          <div className="text-lg font-medium mb-2">Sponsored Content</div>
          <div className="text-sm">Native Ad Placement - Blends with deal cards</div>
        </div>
      </div>
    </div>
  )
}

// Mobile Banner Ad
export function MobileBannerAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className="lg:hidden w-full py-4">
      <div className="px-4">
        <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
          data-ad-slot="9988776655"
          data-ad-format="banner"
          data-full-width-responsive="true"
        />
        {/* Fallback for development/testing */}
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-4 text-center text-gray-600 text-sm">
          <span>320x50 Mobile Banner</span>
        </div>
      </div>
    </div>
  )
}

// Footer Ad
export function FooterAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className="w-full bg-gray-50 py-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">Advertisement</div>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
            data-ad-slot="4433221100"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
          {/* Fallback for development/testing */}
          <div className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg p-4 text-center text-gray-600 text-sm">
            <span>728x90 Footer Banner</span>
          </div>
        </div>
      </div>
    </div>
  )
}
