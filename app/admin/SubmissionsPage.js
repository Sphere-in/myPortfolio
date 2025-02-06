// import dynamic from 'next/dynamic'

// const SubmissionsContent = dynamic(() => import('../myComponents/SubmissionsContent'), {
//   ssr: false,
// })

// export default function SubmissionsPage() {
//   return (
//     <div className="min-h-screen bg-[#001a1a] text-[#00FFB2]">
//       <SubmissionsContent />
//     </div>
//   )
// }

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const SubmissionsClient = dynamic(() => import('./Submission-Client'), {
  ssr: false,
})

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-[#001a1a] text-[#00FFB2]">
      <Suspense fallback={<div>Loading...</div>}>
        <SubmissionsClient />
      </Suspense>
    </div>
  )
}

