"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane, Menu, X, User, LogIn } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Plane className="h-8 w-8 transition-transform duration-300 hover:rotate-12" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">SpotMijnVlucht.nl</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="#deals"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Deals
            </Link>
            <Link
              href="/bestemmingen"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Bestemmingen
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Tips
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Over Ons
            </Link>
          </nav>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 touch-friendly"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Inloggen
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg touch-friendly">
              <User className="h-4 w-4 mr-2" />
              Registreren
            </Button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 touch-friendly"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-slideIn">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 py-2 touch-friendly"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#deals"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 py-2 touch-friendly"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/bestemmingen"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 py-2 touch-friendly"
                onClick={() => setIsMenuOpen(false)}
              >
                Bestemmingen
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 py-2 touch-friendly"
                onClick={() => setIsMenuOpen(false)}
              >
                Tips
              </Link>
              <Link
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 py-2 touch-friendly"
                onClick={() => setIsMenuOpen(false)}
              >
                Over Ons
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="justify-start text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 touch-friendly"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Inloggen
                </Button>
                <Button className="justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white touch-friendly">
                  <User className="h-4 w-4 mr-2" />
                  Registreren
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
