import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import PageContainer from '../../components/layout/PageContainer'
import { Card, CardContent } from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'

const Stat = ({ label, value }) => (
  <Card className="shadow-card">
    <CardContent className="p-6">
      <p className="text-small font-medium text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    </CardContent>
  </Card>
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
      <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
        <PageContainer>
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer>
        <h1 className="text-h1 md:text-display mb-8">Admin dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat label="Total users" value={stats?.totalUsers || 0} />
          <Stat label="Active books" value={stats?.totalBooks || 0} />
          <Stat label="Total orders" value={stats?.totalOrders || 0} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h2 className="text-h3 mb-4">Recent orders</h2>
              <div className="space-y-3">
                {recentOrders.length === 0 ? (
                  <p className="text-body-sm text-neutral-500">No recent orders.</p>
                ) : (
                  recentOrders.map((o) => (
                    <div
                      key={o._id}
                      className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="text-body-sm font-medium text-neutral-900">
                          Order #{o._id.slice(-8)}
                        </div>
                        <div className="text-small text-neutral-500">
                          {o.customer?.name} •{' '}
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-body-sm font-semibold text-primary-600">
                        ${(o.totals?.total || 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <h2 className="text-h3 mb-4">Top selling books</h2>
              <div className="space-y-3">
                {topBooks.length === 0 ? (
                  <p className="text-body-sm text-neutral-500">No data.</p>
                ) : (
                  topBooks.map((b) => (
                    <div key={b._id} className="flex items-center gap-3">
                      <img
                        src={b.images?.[0] || '/placeholder-book.jpg'}
                        alt={b.title}
                        className="h-12 w-8 rounded object-cover shadow-soft"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-body-sm font-medium text-neutral-900">
                          {b.title}
                        </div>
                        <div className="text-small text-neutral-500">{b.author}</div>
                      </div>
                      <div className="text-body-sm text-neutral-600">
                        Sales: {b.salesCount || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  )
}

export default AdminDashboard
