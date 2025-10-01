import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import { DollarSign, BookOpen, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <div className="flex items-center">
      <div className="p-2 rounded-md bg-primary-50 text-primary-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
)

const SellerDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [topBooks, setTopBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/sellers/dashboard')
      setStats(res.data.stats)
      setRecentOrders(res.data.recentOrders || [])
      setTopBooks(res.data.topBooks || [])
    } catch (e) {
      toast.error('Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard icon={DollarSign} label="Total Sales" value={`$${(stats?.totalSales || 0).toFixed(2)}`} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} />
          <StatCard icon={BookOpen} label="Active Books" value={stats?.totalBooks || 0} />
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">#{o._id.slice(-8)}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{o.customer?.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{o.items?.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Books */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Books</h2>
          {topBooks.length === 0 ? (
            <p className="text-gray-500">No data.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topBooks.map((b) => (
                <div key={b._id} className="border rounded-lg p-4">
                  <img src={b.images?.[0] || '/placeholder-book.jpg'} alt={b.title} className="w-full h-40 object-cover rounded" />
                  <div className="mt-3 font-medium">{b.title}</div>
                  <div className="text-sm text-gray-500">{b.author}</div>
                  <div className="text-sm mt-1">Sales: {b.salesCount || 0}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
