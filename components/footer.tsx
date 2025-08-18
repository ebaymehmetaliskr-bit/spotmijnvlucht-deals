import Link from "next/link"
import { Plane, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">SpotMijnVlucht.nl</span>
            </div>
            <p className="text-gray-400 mb-4">
              Jouw betrouwbare partner voor de beste vliegdeals en reistips. Bespaar tot 70% op je volgende reis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#deals" className="text-gray-400 hover:text-white transition-colors">
                  Alle Deals
                </Link>
              </li>
              <li>
                <Link href="/bestemmingen" className="text-gray-400 hover:text-white transition-colors">
                  Bestemmingen
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Reisgids & Tips
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Over Ons
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Populaire Bestemmingen</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bestemmingen/istanbul" className="text-gray-400 hover:text-white transition-colors">
                  Istanbul vanaf €89
                </Link>
              </li>
              <li>
                <Link href="/bestemmingen/barcelona" className="text-gray-400 hover:text-white transition-colors">
                  Barcelona vanaf €67
                </Link>
              </li>
              <li>
                <Link href="/bestemmingen/london" className="text-gray-400 hover:text-white transition-colors">
                  London vanaf €45
                </Link>
              </li>
              <li>
                <Link href="/bestemmingen/rome" className="text-gray-400 hover:text-white transition-colors">
                  Rome vanaf €78
                </Link>
              </li>
              <li>
                <Link href="/bestemmingen/prague" className="text-gray-400 hover:text-white transition-colors">
                  Praag vanaf €52
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Info</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Algemene Voorwaarden
                </Link>
              </li>
            </ul>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@spotmijnvlucht.nl</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Nederland</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 SpotMijnVlucht.nl. Alle rechten voorbehouden.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Veilig betalen met:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">
                  SSL
                </div>
                <div className="w-8 h-5 bg-green-600 rounded text-xs flex items-center justify-center font-bold">
                  256
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
