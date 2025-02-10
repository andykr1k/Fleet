import { useState } from 'react'
import axios from 'axios'

type JobSubmission = {
  script: string
  bounty: number
}

export default function SubmitJob() {
  const [script, setScript] = useState<string>('print("Training model...")')
  const [bounty, setBounty] = useState<number>(50000)

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await axios.post<{ job_id: string }>(
        'http://localhost:5000/submit_job',
        { script, bounty } as JobSubmission
      )
      alert(`Job submitted! ID: ${response.data.job_id}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Submission failed: ${error.message}`)
      } else {
        alert('Unknown error occurred')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Submit Training Job</h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Bounty ($)</label>
        <input
          type="number"
          value={bounty}
          onChange={(e) => setBounty(Number(e.target.value))}
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
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Submit Job
      </button>
    </div>
  )
}