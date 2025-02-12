// pages/Settings.tsx
import Header from "../components/Header";

const Settings = () => (
  <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <Header title="Settings" />
    
    <div className="grid lg:grid-cols-3 gap-8 mt-8">
      {/* General Settings */}
      <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6">Preferences</h2>
        <div className="space-y-6">
          <div className="p-4 bg-black/20 rounded-lg">
            <h3 className="font-medium mb-2">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox text-blue-500" defaultChecked />
                <span>Push Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span>SMS Alerts</span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-black/20 rounded-lg">
            <h3 className="font-medium mb-2">API Keys</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="font-mono text-sm">••••••••••••</span>
                <button className="text-red-400 hover:text-red-300 text-sm">
                  Revoke
                </button>
              </div>
              <button className="w-full p-3 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition">
                Generate New API Key
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-6 h-fit">
        <h2 className="text-xl font-semibold mb-6 text-red-400">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-red-300 mb-4">
              This will permanently delete your account and all associated data.
            </p>
            <button className="w-full p-3 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;