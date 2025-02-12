// pages/Jobs.tsx
import { useState } from "react";
import Header from "../components/Header";
import SubmitJob from "../components/SubmitJob";
import TaskProgress from "../components/TaskProgress";

type Job = {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleJobSubmit = (jobId: string) => {
    setJobs((jobs) => [...jobs, { id: jobId, status: "pending" }]);
  };

  return (
    <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header title="Jobs" />

      <div className="mt-8">
        {/* Job Submission Form */}
        <SubmitJob onSubmitSuccess={handleJobSubmit} />

        {/* Active Jobs List */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-6">Active Jobs</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`rounded-lg transition-all ${
                  selectedJob === job.id
                    ? "bg-white/10 border border-blue-500/30"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
              >
                <div
                  onClick={() =>
                    setSelectedJob((prev) => (prev === job.id ? null : job.id))
                  }
                  className="p-4 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-sm">{job.id}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          {
                            pending: "bg-yellow-500/20 text-yellow-300",
                            running: "bg-blue-500/20 text-blue-300",
                            completed: "bg-green-500/20 text-green-300",
                            failed: "bg-red-500/20 text-red-300",
                          }[job.status]
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {selectedJob === job.id ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

                {/* Task Progress - Inline Details */}
                {selectedJob === job.id && (
                  <div className="border-t border-white/10 p-4">
                    <TaskProgress
                      jobId={job.id}
                      onClose={() => setSelectedJob(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
