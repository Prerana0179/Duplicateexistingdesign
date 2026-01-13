import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MyProjectsPage } from './pages/MyProjectsPage';
import { VendorProfile } from './pages/VendorProfile';
import { ChatPage } from './pages/ChatPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleProvider } from './contexts/RoleContext';
import { VendorSelectionProvider } from './contexts/VendorSelectionContext';

export default function App() {
  return (
    <RoleProvider>
      <VendorSelectionProvider>
        <BrowserRouter>
          <Routes>
            {/* Full-screen chat route (no global header/footer) */}
            <Route path="/chat/arvind" element={<ChatPage />} />
            
            {/* Regular routes with global header/footer */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Global Header - Fixed at Top */}
                <Header />
                
                {/* Toast Notifications */}
                <Toaster 
                  position="top-right" 
                  offset="76px"
                  toastOptions={{
                    style: {
                      right: '24px',
                    }
                  }}
                />
                
                {/* Routes - Main Content */}
                <div className="flex-1" style={{ paddingTop: '64px' }}>
                  <Routes>
                    <Route path="/" element={<MyProjectsPage />} />
                    <Route path="/vendor/:vendorId" element={<VendorProfile />} />
                  </Routes>
                </div>
                
                {/* Global Footer - Full Width */}
                <Footer />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </VendorSelectionProvider>
    </RoleProvider>
  );
}