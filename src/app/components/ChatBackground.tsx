// WhatsApp-style chat wallpaper using tools doodle image
// Dense pattern with construction, plumbing, painting, and mechanical tools
import toolsPattern from "figma:asset/bef55ccf1d2f72ac4658bce6aa121381cd1d5b5f.png";

// Background styling for WhatsApp-like chat wallpaper
export const CHAT_BACKGROUND_STYLE = {
  backgroundColor: '#EFE7DC',
  backgroundImage: `url(${toolsPattern})`,
  backgroundRepeat: 'repeat',
  backgroundSize: '320px 320px', // Small icons, high density
  backgroundPosition: 'center',
  opacity: 1, // Full opacity for container, image opacity handled via filter
};

// CSS filter to apply subtle opacity to the background pattern
export const CHAT_BACKGROUND_PATTERN_OVERLAY = {
  position: 'relative' as const,
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${toolsPattern})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '320px 320px',
    opacity: 0.08, // 8% opacity for subtle WhatsApp effect
    pointerEvents: 'none',
    zIndex: 0,
  }
};

// Simple background pattern URL for inline use
export const CHAT_BACKGROUND_PATTERN = `url(${toolsPattern})`;
