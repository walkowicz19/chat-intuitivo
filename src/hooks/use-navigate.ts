'use client'

import { useRouter } from 'next/navigation'

export function useNavigate() {
  const router = useRouter()
  
  const navigate = (path: string) => {
    router.push(path)
  }
  
  return navigate
}