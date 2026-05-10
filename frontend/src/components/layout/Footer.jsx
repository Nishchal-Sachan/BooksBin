import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'
import PageContainer from './PageContainer'

const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 text-neutral-100">
      <PageContainer className="py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 xl:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-400" aria-hidden />
              <span className="text-h3 font-bold text-white">BooksBin</span>
            </div>
            <p className="max-w-sm text-body-sm text-neutral-400">
              Your one-stop destination for discovering, buying, and selling books
              online. Connect with readers and authors from around the world.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">Quick links</h3>
            <ul className="space-y-2.5 text-body-sm">
              <li>
                <Link
                  to="/books"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">For sellers</h3>
            <ul className="space-y-2.5 text-body-sm">
              <li>
                <Link
                  to="/register"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Create seller account
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/dashboard"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Seller dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/books/add"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  List a book
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/orders"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Manage orders
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">Customer service</h3>
            <ul className="space-y-2.5 text-body-sm">
              <li>
                <Link
                  to="/shipping"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">Contact</h3>
            <div className="space-y-3 text-body-sm text-neutral-400">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary-400" />
                <span>support@booksbin.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                <span>
                  123 Book Street
                  <br />
                  Reading City, RC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-8 md:mt-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-small text-neutral-500 md:text-left">
              © {new Date().getFullYear()} BooksBin. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-small">
              <Link
                to="/privacy"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-neutral-500 transition-colors hover:text-white"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}

export default Footer
