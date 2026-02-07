import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Follows Apple Human Interface Guidelines:
 * "When navigating to an entirely new page or a different section of content, 
 * the scroll position should reset to the top."
 * 
 * This prevents the "false bottom" effect where users land in the middle of a page.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Smooth instant scroll to top on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Use 'instant' for navigation, 'smooth' can feel laggy
        });
    }, [pathname]);

    return null;
}
