import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import PageContainer from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (status) params.append('status', status)
      const res = await api.get(`/admin/orders?${params}`)
      setOrders(res.data.orders || [])
      setTotalPages(res.data.pagination.totalPages)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus })
      toast.success('Order status updated')
      fetchOrders()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-h1 md:text-display">Manage orders</h1>
          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e.target.value)
            }}
            className="select-field w-full sm:w-auto"
            aria-label="Filter by status"
          >
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-body text-neutral-500">
            No orders.
          </div>
        ) : (
          <Card className="overflow-hidden p-0 shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-surface">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-surface-subtle/80">
                      <td className="whitespace-nowrap px-4 py-3 text-body-sm font-medium text-neutral-900">
                        #{o._id.slice(-8)}
                      </td>
                      <td className="px-4 py-3 text-body-sm text-neutral-600">
                        {o.customer?.name}
                      </td>
                      <td className="px-4 py-3 text-body-sm text-neutral-500">
                        {o.items?.length}
                      </td>
                      <td className="px-4 py-3 text-body-sm font-medium text-neutral-900">
                        ${(o.totals?.total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-body-sm">
                        <Badge variant="outline" className="capitalize">
                          {o.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-body-sm">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className="select-field w-auto min-w-[8rem] py-2 text-small"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-neutral-100 px-4 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="px-3 py-2 text-body-sm text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        )}
      </PageContainer>
    </div>
  )
}

export default AdminOrders
