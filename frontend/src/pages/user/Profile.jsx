import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import {
  User,
  Mail,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  Save,
  Lock,
} from 'lucide-react'
import { updateProfile, changePassword } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { cn } from '../../utils/cn'
import { loadProfileDraft, saveProfileDraft } from '../../utils/profileDraftStorage'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function Profile() {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const userKey = user?._id || user?.id || 'local'
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    if (!user) return
    const draft = loadProfileDraft(userKey)
    resetProfile({
      name: draft?.name ?? user.name ?? '',
      email: draft?.email ?? user.email ?? '',
      phone: draft?.phone ?? user.profile?.phone ?? '',
      address: {
        street:
          draft?.address?.street ?? user.profile?.address?.street ?? '',
        city: draft?.address?.city ?? user.profile?.address?.city ?? '',
        state: draft?.address?.state ?? user.profile?.address?.state ?? '',
        zipCode:
          draft?.address?.zipCode ?? user.profile?.address?.zipCode ?? '',
        country:
          draft?.address?.country ?? user.profile?.address?.country ?? '',
      },
    })
  }, [user, userKey, resetProfile])

  const onSubmitProfile = async (data) => {
    saveProfileDraft(userKey, data)
    try {
      await dispatch(updateProfile(data)).unwrap()
      toast.success('Profile saved')
    } catch {
      toast.success('Saved on this device (demo — server unavailable)')
    }
  }

  const onSubmitPassword = async (data) => {
    try {
      await dispatch(
        changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      ).unwrap()
      toast.success('Password changed')
      resetPassword()
    } catch (error) {
      toast.error(error || 'Could not change password')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <Spinner size="lg" />
      </div>
    )
  }

  const tabBtn = (id, label, Icon) => (
    <button
      key={id}
      type="button"
      onClick={() => setActiveTab(id)}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors',
        activeTab === id
          ? 'bg-primary-50 text-primary-800'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      {label}
    </button>
  )

  return (
    <AccountLayout
      title="Profile"
      subtitle="Update your name, contact details, and shipping address."
    >
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-neutral-200/90 bg-surface p-1.5 shadow-soft">
        {tabBtn('profile', 'Contact & address', User)}
        {tabBtn('password', 'Password', Lock)}
      </div>

      {activeTab === 'profile' && (
        <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
          <h2 className="text-h3 mb-6 text-neutral-900">
            Contact &amp; address
          </h2>
          <form
            onSubmit={handleSubmitProfile(onSubmitProfile)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-small font-medium text-neutral-700">
                  Full name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    {...registerProfile('name')}
                    className={cn(
                      'input-field pl-10',
                      profileErrors.name && 'input-field-error'
                    )}
                    placeholder="Your name"
                  />
                </div>
                {profileErrors.name && (
                  <p className="mt-1 text-small text-error">
                    {profileErrors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-small font-medium text-neutral-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    {...registerProfile('email')}
                    type="email"
                    className={cn(
                      'input-field pl-10',
                      profileErrors.email && 'input-field-error'
                    )}
                    placeholder="you@example.com"
                  />
                </div>
                {profileErrors.email && (
                  <p className="mt-1 text-small text-error">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">
                Phone
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  {...registerProfile('phone')}
                  type="tel"
                  className="input-field pl-10"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-body font-semibold text-neutral-900">
                <MapPin className="h-4 w-4 text-primary-600" />
                Address
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-small font-medium text-neutral-700">
                    Street
                  </label>
                  <input
                    {...registerProfile('address.street')}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-small font-medium text-neutral-700">
                    City
                  </label>
                  <input
                    {...registerProfile('address.city')}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-small font-medium text-neutral-700">
                    State / region
                  </label>
                  <input
                    {...registerProfile('address.state')}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-small font-medium text-neutral-700">
                    ZIP / postal code
                  </label>
                  <input
                    {...registerProfile('address.zipCode')}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-small font-medium text-neutral-700">
                    Country
                  </label>
                  <input
                    {...registerProfile('address.country')}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-neutral-100 pt-6">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card className="border-neutral-200/90 p-6 shadow-card md:p-8">
          <h2 className="text-h3 mb-6 text-neutral-900">Change password</h2>
          <form
            onSubmit={handleSubmitPassword(onSubmitPassword)}
            className="space-y-6"
          >
            {[
              {
                name: 'currentPassword',
                label: 'Current password',
                show: showCurrentPassword,
                setShow: setShowCurrentPassword,
              },
              {
                name: 'newPassword',
                label: 'New password',
                show: showNewPassword,
                setShow: setShowNewPassword,
              },
              {
                name: 'confirmPassword',
                label: 'Confirm new password',
                show: showConfirmPassword,
                setShow: setShowConfirmPassword,
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-small font-medium text-neutral-700">
                  {field.label}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    {...registerPassword(field.name)}
                    type={field.show ? 'text' : 'password'}
                    className={cn(
                      'input-field pl-10 pr-10',
                      passwordErrors[field.name] && 'input-field-error'
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                    onClick={() => field.setShow(!field.show)}
                    aria-label="Toggle visibility"
                  >
                    {field.show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordErrors[field.name] && (
                  <p className="mt-1 text-small text-error">
                    {passwordErrors[field.name].message}
                  </p>
                )}
              </div>
            ))}
            <div className="flex justify-end border-t border-neutral-100 pt-6">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Update password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </AccountLayout>
  )
}
