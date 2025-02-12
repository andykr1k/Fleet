import { Link } from 'react-router-dom';
import Header from "../components/Header";

const Dashboard = () => {
  // Mock data - replace with real data from your API
  const metrics = [
    { label: 'Active Jobs', value: '4', color: 'bg-blue-500' },
    { label: 'Completed Tasks', value: '1.2k', color: 'bg-green-500' },
    { label: 'GPU Utilization', value: '78%', color: 'bg-purple-500' },
    { label: 'Total Earnings', value: '$2,450', color: 'bg-yellow-500' },
  ];

  const recentJobs = [
    { id: 'job_123', status: 'running', progress: 65 },
    { id: 'job_456', status: 'pending', progress: 20 },
    { id: 'job_789', status: 'completed', progress: 100 },
  ];

  const systemHealth = [
    { label: 'CPU Load', value: '42%', color: 'bg-green-500' },
    { label: 'Memory Usage', value: '64%', color: 'bg-yellow-500' },
    { label: 'Network', value: '1.2 Gbps', color: 'bg-blue-500' },
  ];

  return (
    <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header title="Dashboard" />
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 ${metric.color} rounded-full`} />
              <div>
                <div className="text-sm text-gray-400">{metric.label}</div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Jobs</h2>
            <Link to="/jobs" className="text-blue-400 hover:text-blue-300 text-sm">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <Link 
                key={index}
                to={`/jobs/${job.id}`}
                className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-sm">{job.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      job.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      job.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-2 bg-white/10 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all" 
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{job.progress}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-6">System Health</h2>
          <div className="space-y-6">
            {systemHealth.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-full ${metric.color} rounded-full transition-all`}
                    style={{ width: metric.value.replace('%', '') + '%' }}
                  />
                </div>
              </div>
            ))}
            
            {/* Network Activity */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium mb-4">Network Nodes</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex-1 h-24 bg-white/5 rounded-lg border border-white/10">
                    {/* Replace with actual node status */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { id: 1, text: 'Job "training-123" completed successfully', time: '2h ago' },
            { id: 2, text: 'New GPU node connected from London', time: '4h ago' },
            { id: 3, text: 'Earnings updated: +$42.50', time: '1d ago' },
          ].map(activity => (
            <div 
              key={activity.id}
              className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
            >
              <span className="text-gray-400">{activity.text}</span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;