import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import PageContainer from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

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
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-h1 md:text-display">Manage users</h1>
          <select
            value={role}
            onChange={(e) => {
              setPage(1)
              setRole(e.target.value)
            }}
            className="select-field w-full sm:w-auto"
            aria-label="Filter by role"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Card className="mb-6 p-4 shadow-card md:p-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1"
              placeholder="Search by name or email"
            />
            <Button type="submit" className="sm:w-auto">
              Search
            </Button>
          </form>
        </Card>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-body text-neutral-500">
            No users.
          </div>
        ) : (
          <Card className="overflow-hidden p-0 shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-small font-semibold uppercase tracking-wide text-neutral-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-surface">
                  {users.map((u) => (
                    <tr key={u._id} className="transition-colors hover:bg-surface-subtle/80">
                      <td className="whitespace-nowrap px-4 py-3 text-body-sm text-neutral-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-body-sm text-neutral-500">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-body-sm">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                          className="select-field w-auto min-w-[6.5rem] py-2 text-small"
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-body-sm">
                        <select
                          value={u.isActive ? 'active' : 'inactive'}
                          onChange={(e) =>
                            updateStatus(u._id, e.target.value === 'active')
                          }
                          className="select-field w-auto py-2 text-small"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
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

export default AdminUsers
