import Header from "../components/Header";

const NotFound = () => (
  <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <Header title="Not Found" />
    <div className="text-center mt-24">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl text-gray-400">Page not found</p>
    </div>
  </div>
);
export default NotFound;