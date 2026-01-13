import { Calendar } from 'lucide-react';

export function ProjectHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold mb-8">My Projects</h1>
      
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold">Residential Construction</h2>
            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
              In Progress
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>22 Jan 2024</span>
          </div>
        </div>
        
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          Schedule Inspection
        </button>
      </div>
    </div>
  );
}