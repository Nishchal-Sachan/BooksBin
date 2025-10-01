import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'

const Stat = ({ label, value }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-semibold mt-2">{value}</p>
  </div>
)

const AdminDashboard = () => {
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
      const res = await api.get('/admin/dashboard')
      setStats(res.data.stats)
      setRecentOrders(res.data.recentOrders || [])
      setTopBooks(res.data.topSellingBooks || [])
    } catch {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stat label="Total Users" value={stats?.totalUsers || 0} />
          <Stat label="Active Books" value={stats?.totalBooks || 0} />
          <Stat label="Total Orders" value={stats?.totalOrders || 0} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500">No recent orders.</p>
              ) : recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Order #{o._id.slice(-8)}</div>
                    <div className="text-xs text-gray-500">{o.customer?.name} • {new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm font-semibold">${(o.totals?.total || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Books</h2>
            <div className="space-y-3">
              {topBooks.length === 0 ? (
                <p className="text-gray-500">No data.</p>
              ) : topBooks.map((b) => (
                <div key={b._id} className="flex items-center gap-3">
                  <img src={b.images?.[0] || '/placeholder-book.jpg'} alt={b.title} className="h-12 w-8 object-cover rounded" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{b.title}</div>
                    <div className="text-xs text-gray-500">{b.author}</div>
                  </div>
                  <div className="text-sm">Sales: {b.salesCount || 0}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
