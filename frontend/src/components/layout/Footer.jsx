import { Link } from 'react-router-dom'
import { BookOpen, Mail, Truck, Banknote } from 'lucide-react'
import PageContainer from './PageContainer'
import { formatPrice } from '../../utils/format'
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants'

const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-primary-900 text-neutral-200">
      <PageContainer className="py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <BookOpen className="h-5 w-5 text-white" aria-hidden />
              </div>
              <span className="font-serif text-xl text-white">BooksBin</span>
            </div>
            <p className="text-body-sm text-neutral-300">
              A curated online bookstore for readers and collectors. Browse, order,
              and pay cash on delivery.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">Shop</h3>
            <ul className="space-y-2.5 text-body-sm">
              <li><Link to="/books" className="text-neutral-300 transition-colors hover:text-white">All products</Link></li>
              <li><Link to="/books?sort=bestseller" className="text-neutral-300 transition-colors hover:text-white">Bestsellers</Link></li>
              <li><Link to="/books?sort=newest" className="text-neutral-300 transition-colors hover:text-white">New arrivals</Link></li>
              <li><Link to="/cart" className="text-neutral-300 transition-colors hover:text-white">Your cart</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">Account</h3>
            <ul className="space-y-2.5 text-body-sm">
              <li><Link to="/login" className="text-neutral-300 transition-colors hover:text-white">Sign in</Link></li>
              <li><Link to="/register" className="text-neutral-300 transition-colors hover:text-white">Create account</Link></li>
              <li><Link to="/account" className="text-neutral-300 transition-colors hover:text-white">My account</Link></li>
              <li><Link to="/orders" className="text-neutral-300 transition-colors hover:text-white">Order history</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-h3 text-white">Delivery</h3>
            <ul className="space-y-3 text-body-sm text-neutral-300">
              <li className="flex items-start gap-2">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li className="flex items-start gap-2">
                <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                Cash on delivery at your doorstep
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                support@booksbin.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-center text-small text-neutral-400">
            © {new Date().getFullYear()} BooksBin. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  )
}

export default Footer
