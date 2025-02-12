// pages/Account.tsx
import Header from "../components/Header";

const Account = () => (
  <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <Header title="Account" />
    
    <div className="grid lg:grid-cols-3 gap-8 mt-8">
      {/* Profile Section */}
      <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-white/20"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">Change Photo</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">John Doe</h3>
              <p className="text-gray-400">john@fleet.ai</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full p-3 bg-black/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full p-3 bg-black/20 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue="john@fleet.ai"
                className="w-full p-3 bg-black/20 rounded-lg"
              />
            </div>
          </div>
          
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
            Update Profile
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6 h-fit">
        <h2 className="text-xl font-semibold mb-6">Security</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Password</h3>
            <button className="w-full p-3 bg-black/20 rounded-lg hover:bg-black/30 transition">
              Change Password
            </button>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Two-Factor Auth</h3>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-gray-400">Not enabled</span>
              <button className="text-blue-400 hover:text-blue-300">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Account;