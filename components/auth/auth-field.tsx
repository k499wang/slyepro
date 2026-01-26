import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthFieldProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

export function AuthField({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  required = true,
}: AuthFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-zinc-400 font-light text-sm">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-white/20 focus:ring-0 focus:bg-zinc-900 transition-all"
      />
    </div>
  )
}
