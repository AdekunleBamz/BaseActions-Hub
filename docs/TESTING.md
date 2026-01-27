# Testing Guide

This guide covers testing strategies and best practices for BaseActions Hub.

## Testing Strategy

### Unit Testing
Test individual functions, hooks, and components in isolation.

### Integration Testing
Test how components work together and interact with contracts.

### E2E Testing
Test complete user flows from start to finish.

## Frontend Testing

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from '@/hooks';

describe('useDisclosure', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('opens on onOpen', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.onOpen());
    expect(result.current.isOpen).toBe(true);
  });

  it('closes on onClose', () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.onClose());
    expect(result.current.isOpen).toBe(false);
  });
});
```

## Contract Testing

### Using Foundry

```solidity
// test/Guestbook.t.sol
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/Guestbook.sol";

contract GuestbookTest is Test {
    Guestbook guestbook;
    address user = address(0x1);
    
    function setUp() public {
        guestbook = new Guestbook();
        vm.deal(user, 1 ether);
    }
    
    function testSign() public {
        vm.prank(user);
        guestbook.sign{value: 0.000001 ether}(address(this), "Hello!");
        
        assertEq(guestbook.signatureCount(), 1);
    }
    
    function testSignRequiresFee() public {
        vm.prank(user);
        vm.expectRevert("Insufficient fee");
        guestbook.sign(address(this), "Hello!");
    }
}
```

### Running Tests

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Run tests
forge test

# Run tests with gas report
forge test --gas-report

# Run specific test
forge test --match-test testSign
```

## Manual Testing Checklist

### Wallet Connection
- [ ] Connect with MetaMask
- [ ] Connect with Coinbase Wallet
- [ ] Connect with WalletConnect
- [ ] Disconnect wallet
- [ ] Switch networks

### Guestbook
- [ ] Sign guestbook with message
- [ ] View existing signatures
- [ ] Add reaction to signature
- [ ] Pin signature (owner only)
- [ ] Edit signature (within time limit)
- [ ] Tip a signer

### Leaderboard
- [ ] View top rankings
- [ ] Check user stats
- [ ] Verify point calculations
- [ ] Test streak bonuses

### Badges
- [ ] View badge collection
- [ ] Check badge progress
- [ ] Claim eligible badges
- [ ] View badge details

### Error Handling
- [ ] Insufficient balance error
- [ ] Transaction rejection
- [ ] Network errors
- [ ] Contract errors

### Responsiveness
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Form labels associated
- [ ] Error messages announced

## Performance Testing

- [ ] Page load < 3s
- [ ] First contentful paint < 1.5s
- [ ] Time to interactive < 3.5s
- [ ] No layout shifts
- [ ] Images optimized

---

For more testing best practices, see the [React Testing Library docs](https://testing-library.com/docs/react-testing-library/intro/).
