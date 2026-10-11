import { toast } from 'sonner'
import { ApiError, getErrorMessage } from '@/lib/api/errors'

export { toast }

export function toastApiError(error: unknown, fallback = 'Something went wrong') {
  toast.error(getErrorMessage(error, fallback))
}

export function isApiErrorStatus(error: unknown, status: number) {
  return error instanceof ApiError && error.status === status
}
