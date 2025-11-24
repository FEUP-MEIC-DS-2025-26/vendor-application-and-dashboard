// Lightweight global hotkeys hook
// Supports: r = refresh, n = navigate to register, h or ? = help
import { useEffect } from "react";

export interface GlobalHotkeysOptions {
  onRefresh?: () => void;
  onRegister?: () => void;
  onHelp?: () => void;
  /**
   * Optional mapping from a single-character key to a handler for quick actions.
   * Example: { p: () => openProduct(), o: () => navigate('/orders') }
   */
  quickActionHandlers?: Record<string, () => void>;
  disabled?: boolean;
}

export default function useGlobalHotkeys(options: GlobalHotkeysOptions) {
  const { onRefresh, onRegister, onHelp, quickActionHandlers, disabled } = options || {};

  useEffect(() => {
    if (disabled) return;

    function shouldIgnoreEvent(target: EventTarget | null) {
      if (!target || !(target instanceof Element)) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || target.getAttribute("contenteditable") === "true") {
        return true;
      }
      // also ignore if inside an editable element
      if ((target as HTMLElement).isContentEditable) return true;
      return false;
    }

    function handler(e: KeyboardEvent) {
      if (shouldIgnoreEvent(e.target)) return;

      const key = (e.key || "").toLowerCase();

      // First check quick-action handlers (single character keys like 'p', 'o')
      if (quickActionHandlers && quickActionHandlers[key]) {
        e.preventDefault();
        try {
          quickActionHandlers[key]();
        } catch (err) {
          // swallow - handlers should handle their own errors
          console.error('Quick action handler error for key', key, err);
        }
        return;
      }

      switch (key) {
        case "r":
          e.preventDefault();
          onRefresh && onRefresh();
          break;
        case "n":
          e.preventDefault();
          onRegister && onRegister();
          break;
        case "h":
        case "?":
          e.preventDefault();
          onHelp && onHelp();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handler, { passive: false });

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onRefresh, onRegister, onHelp, disabled]);
}
