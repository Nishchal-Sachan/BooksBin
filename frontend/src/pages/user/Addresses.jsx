import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/cn'

export default function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false,
    },
  })

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users/profile')
      setAddresses(data.user?.addresses || [])
    } catch {
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditingId(null)
    reset({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: addresses.length === 0,
    })
    setShowForm(true)
  }

  const openEdit = (addr) => {
    setEditingId(addr._id)
    setValue('type', addr.type || 'home')
    setValue('name', addr.name || '')
    setValue('street', addr.street || '')
    setValue('city', addr.city || '')
    setValue('state', addr.state || '')
    setValue('zipCode', addr.zipCode || '')
    setValue('country', addr.country || '')
    setValue('isDefault', addr.isDefault || false)
    setShowForm(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        const res = await api.put(`/users/addresses/${editingId}`, data)
        setAddresses(res.data.addresses)
        toast.success('Address updated')
      } else {
        const res = await api.post('/users/addresses', data)
        setAddresses(res.data.addresses)
        toast.success('Address added')
      }
      setShowForm(false)
      setEditingId(null)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save address')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return
    try {
      const res = await api.delete(`/users/addresses/${id}`)
      setAddresses(res.data.addresses)
      toast.success('Address removed')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <AccountLayout
      title="Addresses"
      subtitle="Manage delivery addresses for faster checkout."
    >
      <div className="mb-6 flex justify-end">
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add address
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6 shadow-soft">
          <h2 className="text-h3">
            {editingId ? 'Edit address' : 'New address'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-small font-medium">Label</label>
              <input {...register('name')} className="input-field mt-1 w-full" placeholder="Home, Office…" />
            </div>
            <div>
              <label className="text-small font-medium">Type</label>
              <select {...register('type')} className="select-field mt-1 w-full">
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-small font-medium">Street</label>
              <input {...register('street')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="text-small font-medium">City</label>
              <input {...register('city')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="text-small font-medium">State</label>
              <input {...register('state')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="text-small font-medium">ZIP</label>
              <input {...register('zipCode')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="text-small font-medium">Country</label>
              <input {...register('country')} className="input-field mt-1 w-full" />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" {...register('isDefault')} />
              <span className="text-body-sm">Set as default</span>
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-ink-muted">Loading…</p>
      ) : addresses.length === 0 ? (
        <Card className="py-16 text-center shadow-soft">
          <MapPin className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-ink-muted">No saved addresses yet.</p>
          <Button onClick={openNew} className="mt-4">
            Add your first address
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card
              key={addr._id}
              className={cn(
                'p-5 shadow-soft',
                addr.isDefault && 'ring-2 ring-primary-200'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    {addr.name}
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-small text-primary-700">
                        <Star className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-body-sm text-ink-muted">
                    {addr.street}
                    <br />
                    {addr.city}, {addr.state} {addr.zipCode}
                    <br />
                    {addr.country}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(addr)}
                    className="rounded-lg p-2 text-ink-muted hover:bg-neutral-100"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr._id)}
                    className="rounded-lg p-2 text-ink-muted hover:bg-error-muted hover:text-error-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
