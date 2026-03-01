'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNavigationLoading } from '@/components/providers/navigation-loading-provider'
import { ReactNode, MouseEvent } from 'react'

interface LoadingLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const router = useRouter()
  const { startLoading } = useNavigationLoading()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Allow anchor links to work normally
    if (href.startsWith('#')) {
      if (onClick) onClick(e)
      return
    }

    e.preventDefault()

    if (onClick) onClick(e)

    startLoading()
    router.push(href)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
