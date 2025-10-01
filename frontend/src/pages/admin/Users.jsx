import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (role) params.append('role', role)
      if (search) params.append('search', search)
      const res = await api.get(`/admin/users?${params}`)
      setUsers(res.data.users || [])
      setTotalPages(res.data.pagination.totalPages)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const updateRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      toast.success('User role updated')
      fetchUsers()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update role')
    }
  }

  const updateStatus = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive })
      toast.success('User status updated')
      fetchUsers()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <select value={role} onChange={(e) => { setPage(1); setRole(e.target.value) }} className="input w-auto">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <form onSubmit={handleSearch} className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input flex-1" placeholder="Search by name or email" />
            <button className="px-4 py-2 rounded-md bg-primary-600 text-white">Search</button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No users.</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{u.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{u.email}</td>
                      <td className="px-4 py-2 text-sm">
                        <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)} className="input w-auto">
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <select value={u.isActive ? 'active' : 'inactive'} onChange={(e) => updateStatus(u._id, e.target.value === 'active')} className="input w-auto">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-sm text-right"></td>
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

export default AdminUsers
