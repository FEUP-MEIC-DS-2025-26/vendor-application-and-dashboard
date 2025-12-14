import React from 'react';

/**
 * Theme integration utility for microfrontend
 * 
 * This allows the host application to communicate its theme preference
 * to the vendor microfrontend via data attributes or system preferences.
 */

export type Theme = 'light' | 'dark' | 'auto';

/**
 * Apply theme to the microfrontend container
 * @param theme - 'light', 'dark', or 'auto' (follows system preference)
 */
export function applyTheme(theme: Theme = 'auto'): void {
  const root = document.documentElement;
  
  if (theme === 'auto') {
    // Remove data-theme attribute to use system preference
    root.removeAttribute('data-theme');
  } else {
    // Set explicit theme
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Listen for theme changes from the host application
 * The host can dispatch a custom event to change the theme
 */
export function listenForThemeChanges(): () => void {
  const handleThemeChange = (event: Event) => {
    const customEvent = event as CustomEvent<{ theme: Theme }>;
    applyTheme(customEvent.detail.theme);
  };

  window.addEventListener('mips-theme-change', handleThemeChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('mips-theme-change', handleThemeChange);
  };
}

/**
 * Get current theme preference
 */
export function getCurrentTheme(): Theme {
  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme') as Theme | null;
  
  if (dataTheme) {
    return dataTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * React hook for theme integration (optional)
 */
export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(getCurrentTheme());

  React.useEffect(() => {
    const cleanup = listenForThemeChanges();
    
    // Also listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (!document.documentElement.hasAttribute('data-theme')) {
        setThemeState(getCurrentTheme());
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      cleanup();
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const setTheme = React.useCallback((newTheme: Theme) => {
    applyTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    setTheme,
  };
}

