# Custom Hooks Reference

Complete documentation for all custom hooks in BaseActions Hub.

## Web3 Hooks

### useGuestbookV2

Hook for interacting with the Guestbook contract.

```typescript
import { useGuestbookV2 } from '@/hooks';

function Component() {
  const {
    signatures,
    loading,
    error,
    sign,
    addReaction,
    pinSignature,
    editSignature,
    tipSigner,
    refresh
  } = useGuestbookV2(guestbookAddress);
}
```

#### Returns
| Property | Type | Description |
|----------|------|-------------|
| `signatures` | `Signature[]` | Array of signatures |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error if any |
| `sign` | `(message: string) => Promise<void>` | Sign the guestbook |
| `addReaction` | `(id: number, type: ReactionType) => Promise<void>` | Add reaction |
| `pinSignature` | `(id: number) => Promise<void>` | Pin a signature |
| `editSignature` | `(id: number, message: string) => Promise<void>` | Edit signature |
| `tipSigner` | `(id: number, amount: bigint) => Promise<void>` | Tip signer |
| `refresh` | `() => void` | Refresh data |

---

### useLeaderboardV2

Hook for leaderboard data and rankings.

```typescript
import { useLeaderboardV2 } from '@/hooks';

function Component() {
  const {
    rankings,
    userStats,
    userRank,
    loading,
    refresh
  } = useLeaderboardV2();
}
```

---

### useBadgesV2

Hook for badge tracking and claiming.

```typescript
import { useBadgesV2 } from '@/hooks';

function Component() {
  const {
    badges,
    unclaimedBadges,
    progress,
    loading,
    claimBadge
  } = useBadgesV2(userAddress);
}
```

---

## UI Hooks

### useDisclosure

Hook for managing open/close state.

```typescript
import { useDisclosure } from '@/hooks';

function Component() {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  
  return (
    <button onClick={onToggle}>
      {isOpen ? 'Close' : 'Open'}
    </button>
  );
}
```

---

### useDebounce

Hook for debouncing values.

```typescript
import { useDebounce } from '@/hooks';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    // Search with debouncedQuery
  }, [debouncedQuery]);
}
```

---

### useLocalStorage

Hook for persisting state to localStorage.

```typescript
import { useLocalStorage } from '@/hooks';

function Component() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
}
```

---

### useClipboard

Hook for copying to clipboard.

```typescript
import { useClipboard } from '@/hooks';

function Component() {
  const { copy, copied, error } = useClipboard();
  
  return (
    <button onClick={() => copy('Hello!')}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

---

### useMediaQuery

Hook for responsive design.

```typescript
import { useMediaQuery } from '@/hooks';

function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
}
```

---

### useIntersectionObserver

Hook for intersection observer.

```typescript
import { useIntersectionObserver } from '@/hooks';

function Component() {
  const ref = useRef(null);
  const { isIntersecting } = useIntersectionObserver(ref, {
    threshold: 0.5
  });
}
```

---

### useCountdown

Hook for countdown timer.

```typescript
import { useCountdown } from '@/hooks';

function Component() {
  const { seconds, minutes, hours, isRunning, start, stop, reset } = useCountdown({
    initialTime: 60,
    onComplete: () => console.log('Done!')
  });
}
```

---

### useAsync

Hook for async operations.

```typescript
import { useAsync } from '@/hooks';

function Component() {
  const { data, loading, error, execute } = useAsync(fetchData);
  
  useEffect(() => {
    execute();
  }, []);
}
```

---

### useForm

Hook for form state management.

```typescript
import { useForm } from '@/hooks';

function Component() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = 'Required';
      return errors;
    },
    onSubmit: (values) => console.log(values)
  });
}
```

---

## Utility Hooks

### usePrevious

Get the previous value of a state.

```typescript
import { usePrevious } from '@/hooks';

function Component() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
}
```

---

### useOnClickOutside

Detect clicks outside an element.

```typescript
import { useOnClickOutside } from '@/hooks';

function Component() {
  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOpen(false));
}
```

---

### useKeyPress

Detect key presses.

```typescript
import { useKeyPress } from '@/hooks';

function Component() {
  const escPressed = useKeyPress('Escape');
  
  useEffect(() => {
    if (escPressed) setIsOpen(false);
  }, [escPressed]);
}
```

---

For more hooks, see the [hooks directory](/frontend/hooks/).
