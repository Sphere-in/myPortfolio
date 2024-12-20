import dynamic from 'next/dynamic'

const SubmissionsContent = dynamic(() => import('../myComponents/SubmissionsContent'), {
  ssr: false,
})

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-[#001a1a] text-[#00FFB2]">
      <SubmissionsContent />
    </div>
  )
}

