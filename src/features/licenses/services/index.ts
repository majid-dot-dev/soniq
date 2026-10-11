import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  LicenseCatalog,
  LicenseTemplate,
  LicenseTemplateInput,
} from '@/features/licenses/types'
import { api } from '@/lib/api/client'

const LICENSES = '/api/v1/licenses'

export const licenseKeys = {
  all: ['licenses'] as const,
  list: (catalog?: LicenseCatalog) => [...licenseKeys.all, 'list', catalog ?? 'all'] as const,
  detail: (id: string) => [...licenseKeys.all, 'detail', id] as const,
}

export function useLicenseTemplates(catalog?: LicenseCatalog, enabled = true) {
  return useQuery({
    queryKey: licenseKeys.list(catalog),
    queryFn: async () => {
      const { data } = await api.get<{ licenses: LicenseTemplate[] }>(LICENSES, {
        params: catalog ? { catalog } : undefined,
      })
      return data.licenses
    },
    enabled,
  })
}

export function useCreateLicenseTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LicenseTemplateInput) => {
      const { data } = await api.post<{ license: LicenseTemplate }>(LICENSES, input)
      return data.license
    },
    onSuccess: (license) => {
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      queryClient.setQueryData(licenseKeys.detail(license.id), license)
    },
  })
}

export function useUpdateLicenseTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      licenseId,
      ...input
    }: Partial<LicenseTemplateInput> & { licenseId: string }) => {
      const { data } = await api.patch<{ license: LicenseTemplate }>(
        `${LICENSES}/${licenseId}`,
        input,
      )
      return data.license
    },
    onSuccess: (license) => {
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      queryClient.setQueryData(licenseKeys.detail(license.id), license)
    },
  })
}

export function useDeleteLicenseTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (licenseId: string) => {
      const { data } = await api.delete<{ license: LicenseTemplate }>(`${LICENSES}/${licenseId}`)
      return data.license
    },
    onSuccess: (license) => {
      queryClient.removeQueries({ queryKey: licenseKeys.detail(license.id) })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
    },
  })
}
