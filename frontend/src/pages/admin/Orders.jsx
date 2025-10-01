import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="input w-auto">
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No orders.</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">#{o._id.slice(-8)}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{o.customer?.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{o.items?.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${(o.totals?.total || 0).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{o.status}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="input w-auto">
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
              <div className="px-4 py-3 border-t flex justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded border disabled:opacity-50">Previous</button>
                <span className="px-3 py-1.5">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded border disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
