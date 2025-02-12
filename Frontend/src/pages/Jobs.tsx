// pages/Jobs.tsx
import { useState } from 'react';
import Header from '../components/Header';
import SubmitJob from '../components/SubmitJob';
import TaskProgress from '../components/TaskProgress';

type Job = {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleJobSubmit = (jobId: string) => {
    setJobs(jobs => [...jobs, { id: jobId, status: 'pending' }]);
  };

  return (
    <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header title="Jobs" />
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-8">
        {/* Main Content */}
        <div>
          <SubmitJob onSubmitSuccess={handleJobSubmit} />
          
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-6">Active Jobs</h2>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedJob === job.id 
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono">{job.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      {
                        pending: 'bg-yellow-500/20 text-yellow-300',
                        running: 'bg-blue-500/20 text-blue-300',
                        completed: 'bg-green-500/20 text-green-300',
                        failed: 'bg-red-500/20 text-red-300'
                      }[job.status]
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Progress Sidebar */}
        <div className={`lg:sticky lg:top-8 lg:h-[calc(100vh-6rem)] transition-opacity ${
          selectedJob ? 'opacity-100' : 'opacity-0 lg:opacity-100'
        }`}>
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 h-full">
            {selectedJob ? (
              <TaskProgress 
                jobId={selectedJob} 
                onClose={() => setSelectedJob(null)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}