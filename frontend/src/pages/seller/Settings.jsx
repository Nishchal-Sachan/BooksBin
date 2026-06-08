import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { changePassword, updateProfile } from '../../store/slices/authSlice'

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function SellerSettings() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onProfile = async (data) => {
    try {
      await dispatch(updateProfile({ name: data.name })).unwrap()
      toast.success('Profile updated')
    } catch (e) {
      toast.error(e || 'Update failed')
    }
  }

  const onPassword = async (data) => {
    try {
      await dispatch(
        changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      ).unwrap()
      toast.success('Password changed')
      passwordForm.reset()
    } catch (e) {
      toast.error(e || 'Password change failed')
    }
  }

  return (
    <SellerLayout title="Account settings" subtitle="Manage your seller profile and password.">
      <div className="space-y-6">
        <Card className="border-neutral-200 p-6 shadow-card">
          <h2 className="text-h3">Profile</h2>
          <form onSubmit={profileForm.handleSubmit(onProfile)} className="mt-5 space-y-4 max-w-md">
            <Input label="Name" {...profileForm.register('name')} error={profileForm.formState.errors.name?.message} />
            <Input label="Email" {...profileForm.register('email')} disabled />
            <Button type="submit">Save profile</Button>
          </form>
        </Card>
        <Card className="border-neutral-200 p-6 shadow-card">
          <h2 className="text-h3">Password</h2>
          <form onSubmit={passwordForm.handleSubmit(onPassword)} className="mt-5 space-y-4 max-w-md">
            <Input label="Current password" type="password" {...passwordForm.register('currentPassword')} />
            <Input label="New password" type="password" {...passwordForm.register('newPassword')} />
            <Input label="Confirm password" type="password" {...passwordForm.register('confirmPassword')} error={passwordForm.formState.errors.confirmPassword?.message} />
            <Button type="submit">Update password</Button>
          </form>
        </Card>
      </div>
    </SellerLayout>
  )
}
