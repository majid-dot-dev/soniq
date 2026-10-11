import { Link } from 'react-router-dom'
import { AuthField, AuthShell, AuthSubmit } from '@/features/auth/components/auth-shell'

export default function ForgotPassword() {
  return (
    <AuthShell
      title="Reset password"
      footer={
        <Link to="/login" className="text-white underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthSubmit>Send reset link</AuthSubmit>
      </form>
    </AuthShell>
  )
}
