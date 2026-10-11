import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { LicenseEditor } from '@/features/licenses/components/license-editor'
import { draftToTemplateFields, emptyDraft, type LicenseDraft } from '@/features/licenses/lib/draft'
import { useCreateLicenseTemplate } from '@/features/licenses/services'
import type { LicenseCatalog } from '@/features/licenses/types'

function catalogFromSearch(value: string | null): LicenseCatalog {
  return value === 'kit' ? 'kit' : 'beat'
}

export default function CreateLicensePage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [searchParams] = useSearchParams()
  const catalog = catalogFromSearch(searchParams.get('catalog'))
  const createLicense = useCreateLicenseTemplate()
  const [draft, setDraft] = useState<LicenseDraft>(() => emptyDraft(catalog))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(emptyDraft(catalog))
  }, [catalog])

  function goBack() {
    navigate('/licenses')
  }

  async function save() {
    const fields = draftToTemplateFields(catalog, draft)
    if (!fields.name) return
    if (fields.kind !== 'free' && fields.defaultPrice <= 0) return
    if (fields.filesDelivered.length === 0) return

    setSaving(true)
    try {
      await createLicense.mutateAsync(fields)
      goBack()
    } finally {
      setSaving(false)
    }
  }

  return (
    <LicenseEditor
      catalog={catalog}
      draft={draft}
      onChange={setDraft}
      onCancel={goBack}
      onSave={() => void save()}
      reduce={!!reduce}
      mode="create"
      title={catalog === 'beat' ? 'New beat license' : 'New kit license'}
      saving={saving}
    />
  )
}
