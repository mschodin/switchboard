'use client'

import { useState, useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { endpointSchema } from '@/lib/validators'
import { submitEndpointRequest } from '@/actions/requests'
import { createEndpoint } from '@/actions/endpoints'
import { uploadEndpointIcon } from '@/actions/upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TagSelect } from '@/components/tags/tag-select'
import { PROTOCOL_OPTIONS } from '@/lib/constants'
import { Loader2, Upload, X } from 'lucide-react'
import type { EndpointFormData } from '@/lib/validators'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface EndpointFormProps {
  mode: 'submit' | 'create'
  onSuccess?: () => void
  defaultValues?: Partial<EndpointFormData>
}

export function EndpointForm({ mode, onSuccess, defaultValues }: EndpointFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(
    defaultValues?.iconUrl ?? null
  )
  const [isUploadingIcon, setIsUploadingIcon] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EndpointFormData>({
    resolver: zodResolver(endpointSchema),
    defaultValues: {
      protocol: 'HTTPS',
      ...defaultValues,
    },
  })

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeIcon = () => {
    setIconFile(null)
    setIconPreview(null)
  }

  const onSubmit = async (data: EndpointFormData) => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        let iconUrl = data.iconUrl

        // Upload icon if provided
        if (iconFile) {
          setIsUploadingIcon(true)
          const uploadFormData = new FormData()
          uploadFormData.append('file', iconFile)
          const uploadResult = await uploadEndpointIcon(uploadFormData)
          setIsUploadingIcon(false)

          if (uploadResult.error) {
            setError(uploadResult.error.root?.[0] ?? 'Failed to upload icon')
            return
          }

          iconUrl = uploadResult.data?.url ?? null
        }

        // Submit form
        const formData = new FormData()
        formData.append('company', data.company)
        formData.append('title', data.title)
        if (data.description) formData.append('description', data.description)
        formData.append('protocol', data.protocol)
        formData.append('address', data.address)
        if (data.ports) formData.append('ports', data.ports.join(', '))
        if (iconUrl) formData.append('iconUrl', iconUrl)
        data.tagIds.forEach((tagId) => formData.append('tagIds', tagId))

        const result =
          mode === 'submit'
            ? await submitEndpointRequest(formData)
            : await createEndpoint(formData)

        if (result.error) {
          setError(result.error.root?.[0] ?? 'Failed to save endpoint')
        } else {
          setSuccess(true)
          reset()
          setIconFile(null)
          setIconPreview(null)
          onSuccess?.()

          if (mode === 'submit') {
            router.push('/my-submissions')
          } else {
            router.push('/')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>
            {mode === 'submit'
              ? 'Endpoint submitted for review!'
              : 'Endpoint created successfully!'}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (Optional)</Label>
        <div className="flex items-center gap-4">
          {iconPreview ? (
            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
              <Image src={iconPreview} alt="Icon preview" fill className="object-cover" />
              <button
                type="button"
                onClick={removeIcon}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="h-16 w-16 rounded-md border border-dashed flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <Input
              id="icon"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleIconChange}
              disabled={isPending || isUploadingIcon}
            />
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, SVG, or WebP. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company Name *</Label>
        <Input
          id="company"
          placeholder="Acme Corp"
          {...register('company')}
          disabled={isPending}
        />
        {errors.company && (
          <p className="text-sm text-destructive">{errors.company.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Endpoint Title *</Label>
        <Input
          id="title"
          placeholder="User Authentication API"
          {...register('title')}
          disabled={isPending}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what this API endpoint does..."
          rows={4}
          {...register('description')}
          disabled={isPending}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Max 1000 characters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="protocol">Protocol *</Label>
          <Controller
            name="protocol"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  {PROTOCOL_OPTIONS.map((protocol) => (
                    <SelectItem key={protocol} value={protocol}>
                      {protocol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.protocol && (
            <p className="text-sm text-destructive">{errors.protocol.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ports">Ports (Optional)</Label>
          <Input
            id="ports"
            placeholder="80, 443, 8080"
            {...register('ports')}
            disabled={isPending}
          />
          {errors.ports && (
            <p className="text-sm text-destructive">{errors.ports.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Comma-separated list
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="https://api.example.com/v1/users"
          {...register('address')}
          disabled={isPending}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Categories *</Label>
        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <TagSelect
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
        {errors.tagIds && (
          <p className="text-sm text-destructive">{errors.tagIds.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending || isUploadingIcon || success}
          className="flex-1"
        >
          {isPending || isUploadingIcon ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploadingIcon ? 'Uploading...' : 'Saving...'}
            </>
          ) : mode === 'submit' ? (
            'Submit for Review'
          ) : (
            'Create Endpoint'
          )}
        </Button>
      </div>
    </form>
  )
}
