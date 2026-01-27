# Components Reference

Complete documentation for UI components in BaseActions Hub.

## Layout Components

### Layout
Main layout wrapper with header and footer.

```tsx
import { Layout } from '@/components';

export default function Page() {
  return (
    <Layout>
      <main>Your content</main>
    </Layout>
  );
}
```

### PageHeader
Consistent page headers with title and description.

```tsx
import { PageHeader } from '@/components';

<PageHeader 
  title="Leaderboard"
  description="See who's leading the community"
  icon={<TrophyIcon />}
/>
```

---

## Form Components

### Button
Versatile button with multiple variants.

```tsx
import { Button } from '@/components/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowIcon />}>Continue</Button>
```

### Input
Text input with validation support.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Textarea
Multi-line text input.

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Message"
  placeholder="Write your message..."
  value={message}
  onChange={setMessage}
  maxLength={500}
  showCount
/>
```

---

## Display Components

### Card
Container component with variants.

```tsx
import { Card } from '@/components/ui';

<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content here</Card.Content>
  <Card.Footer>Footer actions</Card.Footer>
</Card>

// Variants
<Card variant="elevated" />
<Card variant="outlined" />
<Card variant="glass" />
```

### Badge
Status indicators and labels.

```tsx
import { Badge } from '@/components/ui';

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// NFT Rarity
<Badge rarity="legendary">Legendary</Badge>
<Badge rarity="epic">Epic</Badge>
<Badge rarity="rare">Rare</Badge>
```

### Avatar
User avatars with fallbacks.

```tsx
import { Avatar } from '@/components/ui';

<Avatar src={user.avatar} alt={user.name} />
<Avatar address={user.wallet} /> // Generates identicon
<Avatar size="sm" />
<Avatar size="lg" />
```

---

## Feedback Components

### Toast
Toast notifications.

```tsx
import { useToast } from '@/hooks';

function Component() {
  const toast = useToast();
  
  const handleClick = () => {
    toast.success('Operation completed!');
    toast.error('Something went wrong');
    toast.info('Did you know?');
    toast.warning('Be careful!');
  };
}
```

### LoadingState
Loading indicators.

```tsx
import { LoadingState } from '@/components';

<LoadingState />
<LoadingState variant="spinner" />
<LoadingState variant="skeleton" />
<LoadingState variant="pulse" />
<LoadingState text="Loading signatures..." />
```

### EmptyState
Empty state displays.

```tsx
import { EmptyState } from '@/components';

<EmptyState
  icon={<InboxIcon />}
  title="No signatures yet"
  description="Be the first to sign this guestbook!"
  action={<Button>Sign Now</Button>}
/>
```

### ErrorState
Error displays.

```tsx
import { ErrorState } from '@/components';

<ErrorState
  error={error}
  onRetry={handleRetry}
/>
```

---

## Web3 Components

### WalletButton
Wallet connection button.

```tsx
import { WalletButton } from '@/components';

<WalletButton />
<WalletButton showBalance />
<WalletButton showNetwork />
```

### AddressDisplay
Formatted wallet addresses.

```tsx
import { AddressDisplay } from '@/components';

<AddressDisplay address="0x1234...5678" />
<AddressDisplay address={address} copyable />
<AddressDisplay address={address} link />
```

### TransactionModal
Transaction progress display.

```tsx
import { TransactionModal } from '@/components';

<TransactionModal
  isOpen={isOpen}
  status={txStatus}
  hash={txHash}
  onClose={handleClose}
/>
```

---

## Overlay Components

### Modal
Modal dialogs.

```tsx
import { Modal } from '@/components';

<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>
    <Modal.Title>Confirm Action</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to proceed?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

### Tooltip
Hover tooltips.

```tsx
import { Tooltip } from '@/components/ui';

<Tooltip content="Helpful information">
  <Button>Hover me</Button>
</Tooltip>
```

### Popover
Click popovers.

```tsx
import { Popover } from '@/components/ui';

<Popover>
  <Popover.Trigger>
    <Button>Click me</Button>
  </Popover.Trigger>
  <Popover.Content>
    Popover content here
  </Popover.Content>
</Popover>
```

---

## Feature Components

### SignatureCard
Display a guestbook signature.

```tsx
import { SignatureCard } from '@/components';

<SignatureCard
  signature={signature}
  onReaction={handleReaction}
  onTip={handleTip}
  onPin={handlePin}
/>
```

### BadgeDisplay
Display a badge NFT.

```tsx
import { BadgeDisplay } from '@/components';

<BadgeDisplay
  badge={badge}
  showProgress
  onClick={handleClick}
/>
```

### RankBadge
Display user rank.

```tsx
import { RankBadge } from '@/components';

<RankBadge rank={1} />
<RankBadge rank={user.rank} showChange changeAmount={+5} />
```

---

For more components, explore the [components directory](/frontend/components/).
