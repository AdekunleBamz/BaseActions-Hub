# Contributing to BaseActions Hub

Thank you for your interest in contributing to BaseActions Hub! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- A wallet with Base network support (MetaMask, Coinbase Wallet, etc.)
- Basic knowledge of React, TypeScript, and Web3

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdekunleBamz/BaseActions-Hub.git
   cd BaseActions-Hub/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── config/        # Configuration files
├── providers/     # Context providers
├── types/         # TypeScript types
└── public/        # Static assets
```

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines

- Create reusable, self-contained components
- Use the `components/ui/` folder for base UI components
- Use the `components/` folder for feature-specific components
- Export components from barrel files (`index.ts`)

### Hook Guidelines

- Keep hooks focused on a single responsibility
- Use the `use` prefix for all hook names
- Handle loading, error, and success states
- Clean up subscriptions and listeners

### Commit Messages

Follow conventional commits format:

```
type(scope): description

Examples:
feat(guestbook): add reaction system
fix(wallet): resolve connection issues
docs(readme): update installation steps
style(ui): improve button hover states
refactor(hooks): simplify useGuestbook logic
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Visual/styling changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Test your changes locally

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Add screenshots for UI changes

## Testing

### Manual Testing

- Test all affected features locally
- Test on different screen sizes
- Test wallet connections
- Verify contract interactions work

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] Accessibility preserved
- [ ] Loading states work
- [ ] Error handling works

## Smart Contract Changes

If modifying contracts:

1. Test thoroughly on testnet first
2. Document all changes
3. Update ABIs in `config/abis.ts`
4. Update contract addresses if redeployed

## Need Help?

- Check existing issues and PRs
- Open a new issue for bugs
- Use discussions for questions

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person

---

Thank you for contributing to BaseActions Hub! 🚀
