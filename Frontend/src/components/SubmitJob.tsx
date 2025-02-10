import { useState } from 'react'
import axios from 'axios'
import TaskProgress from './TaskProgress'

type JobSubmission = {
  script: string
  bounty: number
}

export default function SubmitJob() {
  const [script, setScript] = useState<string>('print("Training model...")')
  const [bounty, setBounty] = useState<number>(50000)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (): Promise<void> => {
    if (!script.trim()) {
      alert('Please enter a valid training script')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post<{ job_id: string }>(
        'http://localhost:5000/submit_job',
        { script, bounty }
      )
      setActiveJobId(response.data.job_id)
    } catch (error) {
      let errorMessage = 'Failed to submit job'
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message
      }
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (activeJobId) {
    return <TaskProgress jobId={activeJobId} />
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Submit Training Job</h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Bounty ($)</label>
        <input
          type="number"
          value={bounty}
          onChange={(e) => setBounty(Math.max(0, Number(e.target.value)))}
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Training Script</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full h-48 p-2 border rounded font-mono text-sm"
          placeholder="Paste your Python training script..."
          spellCheck="false"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`bg-blue-500 text-white px-4 py-2 rounded transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Job'}
      </button>
    </div>
  )
}