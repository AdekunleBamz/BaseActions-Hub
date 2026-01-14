// App-specific hooks
export { useFrameAutoConnect } from "./useFrameAutoConnect";
export { usePlatformStats } from "./usePlatformStats";
export { useUserStats } from "./useUserStats";
export { useUserBadges } from "./useUserBadges";
export { useGuestbook } from "./useGuestbook";
export { useSignGuestbook } from "./useSignGuestbook";

// Utility hooks
export { useCopyToClipboard } from "./useCopyToClipboard";
export { useLocalStorage } from "./useLocalStorage";
export { useDisclosure } from "./useDisclosure";

// Responsive hooks
export { 
  useMediaQuery, 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop, 
  usePrefersDarkMode, 
  usePrefersReducedMotion 
} from "./useMediaQuery";

// Event hooks
export { useDebounce, useDebouncedCallback } from "./useDebounce";
export { useOnClickOutside } from "./useOnClickOutside";
export { useIntersectionObserver, useLazyLoad } from "./useIntersectionObserver";
export { useWindowScroll } from "./useWindowScroll";
export { useKeyPress, useHotkey, useEscapeKey, useEnterKey } from "./useKeyPress";

// State hooks
export { usePrevious } from "./usePrevious";
export { useCountdown, useCountdownToDate } from "./useCountdown";
export { useAsync, useAsyncCallback } from "./useAsync";
export { useForm, formValidators } from "./useForm";

