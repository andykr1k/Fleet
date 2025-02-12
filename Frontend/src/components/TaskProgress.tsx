// components/TaskProgress.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

type TaskProgressProps = {
  jobId: string;
  onClose: () => void;
};

type Task = {
  task_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
};

export default function TaskProgress({ jobId, onClose }: TaskProgressProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/job_status/${jobId}`, {
          signal: abortController.signal
        });

        const validTasks = (response.data?.tasks || []).filter((t: any) =>
          t.task_id && ['pending', 'running', 'completed', 'failed'].includes(t.status)
        );

        setTasks(validTasks.sort((a: Task, b: Task) => 
          a.task_id.localeCompare(b.task_id)
        ));
        setError('');
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(axios.isAxiosError(err)
            ? `Error: ${err.message}`
            : 'Failed to load tasks');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    
    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, [jobId]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Job Details: {jobId}</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          ✕
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading tasks...</div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 text-red-300 rounded-lg">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No tasks found for this job
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-4">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="p-4 mb-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm">{task.task_id}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  {
                    pending: 'bg-yellow-500/20 text-yellow-300',
                    running: 'bg-blue-500/20 text-blue-300',
                    completed: 'bg-green-500/20 text-green-300',
                    failed: 'bg-red-500/20 text-red-300'
                  }[task.status]
                }`}>
                  {task.status}
                </span>
              </div>
              {task.output && (
                <div className="mt-2 p-3 bg-black/20 rounded text-sm">
                  <pre className="whitespace-pre-wrap break-words">{task.output}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}