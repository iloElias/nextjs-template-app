# Security Policy

## 🔒 Supported Versions

We actively support security updates for the following versions:

| Version  | Supported          |
| -------- | ------------------ |
| Latest   | :white_check_mark: |
| < Latest | :x:                |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please report it via one of the following methods:

### Preferred Method: Security Advisory

1. Go to the **Security** tab in this repository
2. Click on **"Report a vulnerability"**
3. Fill out the security advisory form with details about the vulnerability

### Alternative Method: Private Contact

If you cannot use the Security Advisory feature, please email the maintainers directly with:

- A detailed description of the vulnerability
- Steps to reproduce the issue
- Potential impact and severity assessment
- Suggested fix (if available)

## ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity and complexity

## 🛡️ Security Best Practices

When using this project:

1. **Keep dependencies updated**: Regularly update your dependencies to receive security patches
2. **Review code changes**: Review pull requests and code changes before merging
3. **Use environment variables**: Never commit sensitive information (API keys, secrets, etc.)
4. **Follow the principle of least privilege**: Grant only necessary permissions
5. **Enable security features**: Use HTTPS, enable security headers, and follow Next.js security best practices

## 📋 Security Checklist for Contributors

- [ ] No hardcoded secrets or API keys
- [ ] Input validation and sanitization implemented
- [ ] Dependencies are up to date
- [ ] Security headers configured
- [ ] Error messages don't leak sensitive information
- [ ] Authentication and authorization properly implemented
- [ ] SQL injection and XSS protections in place

## 🔍 Security Audit

We recommend running security audits regularly:

```bash
npm audit
npm audit fix
```

For more information, see [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit).

## 📚 Additional Resources

- [Next.js Security Documentation](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

Thank you for helping keep this project and its users safe!
