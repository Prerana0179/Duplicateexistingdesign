import { Sidebar } from '../components/Sidebar';
import { CollapsibleProject } from '../components/CollapsibleProject';

export function MyProjectsPage() {
  return (
    <>
      {/* Navigation Sidebar */}
      <Sidebar activeItem="Projects" />
      
      {/* Main Content - offset by sidebar width */}
      <div style={{ paddingLeft: '112px' }}>
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-8">My Projects</h1>
          
          {/* Collapsible Project Section */}
          <CollapsibleProject />
        </div>
      </div>
    </>
  );
}