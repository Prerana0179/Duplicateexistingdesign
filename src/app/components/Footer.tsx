/**
 * Footer Component - Full-width website footer (matches live TatvaOps)
 * 
 * LAYOUT RULES (DO NOT CHANGE):
 * - Width: 100% of viewport (edge-to-edge)
 * - Position: Bottom of page layout (root level, NOT inside content)
 * - Height: Fixed (~64-72px)
 * - Background: #111111 (dark charcoal, same as live website)
 * 
 * PLACEMENT:
 * - Must be at ROOT level (same as Sidebar, not inside content wrapper)
 * - Should span full screen width
 * - Should feel like a global website footer
 * 
 * REFERENCE: https://qa.tatvaops.com/my-projects
 */
export function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-gray-400 py-5 border-t border-gray-800">
      <div className="px-6 flex items-center justify-between">
        {/* Left Side - Copyright */}
        <div className="text-sm">
          © 2026 TatvaOps. All rights reserved.
        </div>
        
        {/* Right Side - Links */}
        <div className="flex items-center gap-8 text-sm">
          <a 
            href="#privacy" 
            className="hover:text-gray-200 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#about" 
            className="hover:text-gray-200 transition-colors"
          >
            About Us
          </a>
          <a 
            href="#terms" 
            className="hover:text-gray-200 transition-colors"
          >
            Terms & Conditions
          </a>
          <a 
            href="#contact" 
            className="hover:text-gray-200 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}