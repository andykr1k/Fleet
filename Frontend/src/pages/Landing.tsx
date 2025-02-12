import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-8 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fleet.ai
            </span>
          </div>
          <Link  to="/authentication" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-lg border border-white/10">
            Sign In
          </Link>
        </nav>

        <div className="py-20 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            The Distributed Intelligence Layer
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Accelerate AI development with our global compute network. 
            <span className="block mt-2 text-blue-300/80">
              Train models faster. Earn rewards instantly.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/authentication" className="px-8 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all duration-200 font-medium glow-effect border border-blue-400/20">
              Start Training →
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 backdrop-blur-lg">
              Explore Network
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-20">
          {[
            {
              icon: '⚡',
              title: 'Global Compute',
              description: 'Access distributed GPU clusters worldwide.'
            },
            {
              icon: '💸',
              title: 'Earn Rewards',
              description: 'Monetize idle hardware resources.'
            },
            {
              icon: '🔒',
              title: 'Secure Runtime',
              description: 'Isolated Docker environments ensure safe execution.'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 backdrop-blur-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-6 text-2xl relative overflow-hidden">
                <span className="z-10">{feature.icon}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            Fleet.ai connects AI researchers and developers with idle compute power across the globe, enabling faster model training at a fraction of the cost.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Deploy Your Model",
                description: "Upload your training script and define resource needs."
              },
              {
                step: "2",
                title: "Tap Into Global GPUs",
                description: "Our distributed network allocates the best available nodes."
              },
              {
                step: "3",
                title: "Train & Scale",
                description: "Run your models with high efficiency and instant scalability."
              }
            ].map((item, index) => (
              <div key={index} className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
                <div className="text-3xl font-bold text-blue-300 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Get Started Today
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            Join thousands of AI researchers and engineers who are accelerating their models with Fleet.ai.
          </p>
          <Link to="/authentication" className="px-8 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all duration-200 font-medium glow-effect border border-blue-400/20">
            Start Training →
          </Link>
        </div>
      </div>
    </div>
  );
};
