import { APP_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-zinc-600 font-light text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
