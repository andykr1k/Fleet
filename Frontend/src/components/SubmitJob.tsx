// components/SubmitJob.tsx
import { useState } from 'react';
import axios from 'axios';

type SubmitJobProps = {
  onSubmitSuccess: (jobId: string) => void;
};

export default function SubmitJob({ onSubmitSuccess }: SubmitJobProps) {
  const [script, setScript] = useState('');
  const [bounty, setBounty] = useState(500);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!script.trim()) {
      alert('Please enter a valid training script');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post<{ job_id: string }>(
        'http://localhost:5001/submit_job',
        { script, bounty }
      );
      onSubmitSuccess(response.data.job_id);
      setScript('');
      setBounty(500);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : 'Failed to submit job';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 rounded-xl border border-white/10 mb-8">
      <h2 className="text-2xl font-bold mb-6">New Training Job</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Bounty ($)</label>
          <input
            type="number"
            value={bounty}
            onChange={(e) => setBounty(Math.max(0, Number(e.target.value)))}
            className="w-full p-3 bg-black/20 rounded-lg"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Training Script</label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-48 p-3 bg-black/20 rounded-lg font-mono text-sm"
            placeholder="Paste your Python training script..."
            spellCheck="false"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg transition-all ${
            isSubmitting
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Launch Training Job'}
        </button>
      </div>
    </div>
  );
}