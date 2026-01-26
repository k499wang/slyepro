import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthCardProps = {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-2xl shadow-black/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-light tracking-tight text-white">{title}</CardTitle>
        <CardDescription className="text-zinc-500 font-light">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">{children}</CardContent>
      {footer ? (
        <CardFooter className="border-t border-white/5 pt-6 text-sm text-zinc-500 font-light">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  )
}
