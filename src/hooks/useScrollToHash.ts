import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle smooth scrolling to hash targets on page load or navigation.
 * Uses scrollIntoView with smooth behavior for a premium feel.
 */
export const useScrollToHash = (offset: number = 100) => {
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure DOM is ready after route change
    const timer = setTimeout(() => {
      if (location.hash) {
        const targetId = location.hash.slice(1); // Remove the #
        const element = document.getElementById(targetId);
        
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash, offset]);
};

/**
 * Utility function for programmatic smooth scrolling to a hash target.
 * Use when navigating from the same page.
 */
export const scrollToSection = (sectionId: string, offset: number = 100) => {
  const element = document.getElementById(sectionId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default useScrollToHash;
