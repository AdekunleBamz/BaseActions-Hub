# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| V2.x    | :white_check_mark: |
| V1.x    | :x:                |

## Reporting a Vulnerability

We take security seriously at BaseActions Hub. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: [Create a private security advisory](https://github.com/AdekunleBamz/BaseActions-Hub/security/advisories/new)
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Resolution Target:** Within 30 days

### Scope

#### In Scope
- Smart contract vulnerabilities
- Frontend security issues
- Authentication/authorization bugs
- Data exposure risks
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)

#### Out of Scope
- Social engineering attacks
- Physical attacks
- Denial of service (DoS)
- Issues in third-party dependencies (report to maintainers)

## Smart Contract Security

### Audit Status
- V2 contracts are pending audit
- OpenZeppelin security patterns implemented
- ReentrancyGuard on all payable functions

### Security Features

#### Guestbook
- ReentrancyGuard on sign, tip functions
- Input validation on message length
- Rate limiting per address

#### BadgeNFT
- Ownable access control
- Soulbound option prevents transfers
- Safe mint pattern

#### Leaderboard
- View-only public functions
- Admin-only write functions
- Snapshot mechanism for fair rankings

#### BaseActionsHub
- Emergency pause functionality
- Timelocked admin actions
- Multi-sig support ready

## Best Practices for Users

### Wallet Security
- Never share your private key or seed phrase
- Use hardware wallets for large holdings
- Verify contract addresses before interacting

### Transaction Safety
- Review transaction details before signing
- Start with small amounts to test
- Use official links only

## Disclosure Policy

We follow a coordinated disclosure approach:
1. Reporter submits vulnerability
2. We verify and assess severity
3. We develop and test a fix
4. We deploy the fix
5. We credit the reporter (if desired)
6. Public disclosure after 90 days or when fixed

## Hall of Fame

Contributors who responsibly disclose security issues will be recognized here (with permission).

---

Thank you for helping keep BaseActions Hub secure! 🔒
