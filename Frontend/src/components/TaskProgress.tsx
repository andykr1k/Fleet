import { useState, useEffect } from 'react'
import axios from 'axios'

type Task = {
  task_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: string
}

export default function TaskProgress({ jobId }: { jobId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/job_status/${jobId}`, {
          signal: abortController.signal
        })

        if (!response.data?.tasks) {
          throw new Error('Invalid response format')
        }

        const rawTasks = response.data.tasks
        const validTasks = rawTasks.filter((t: any) =>
          t.task_id && ['pending', 'running', 'completed', 'failed'].includes(t.status)
        )

        const sortedTasks = validTasks.sort((a: Task, b: Task) => {
          try {
            return parseInt(a.task_id.split('-')[1]) - parseInt(b.task_id.split('-')[1])
          } catch {
            return a.task_id.localeCompare(b.task_id)
          }
        })

        setTasks(sortedTasks)
        setError('')
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(axios.isAxiosError(err)
            ? `Failed to fetch status: ${err.message}`
            : 'Unknown error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchStatus()

    // Set up polling
    const interval = setInterval(fetchStatus, 2000)
    return () => {
      abortController.abort()
      clearInterval(interval)
    }
  }, [jobId])

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }

  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-xl font-semibold mb-4">
        Job Progress: <code className="font-mono">{jobId}</code>
      </h2>

      {isLoading ? (
        <div className="text-gray-500">Loading task statuses...</div>
      ) : error ? (
        <div className="text-red-500 p-3 bg-red-50 rounded">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-500">No tasks found for this job</div>
      ) : (
        tasks.map(task => (
          <div key={task.task_id} className="p-3 border rounded bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-gray-600">
                {task.task_id}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                {task.status.toUpperCase()}
              </span>
            </div>

            {task.output && (
              <div className="mt-4 p-3 bg-gray-50 rounded border text-sm">
                <div className="text-gray-500 text-xs mb-1">Output:</div>
                <pre className="whitespace-pre-wrap break-words font-mono">
                  {task.output}
                </pre>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}