# 🤝 Contributing to EduSmart

Thank you for your interest in contributing to EduSmart! This document provides guidelines for contributing to the project.

## 📋 How to Contribute

### 1. Fork the Repository
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/edusmart_27_09.git
cd edusmart_27_09
```

### 2. Create a Branch
```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-description
```

### 3. Make Changes
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes
```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new learning style detection algorithm"

# Push to your fork
git push origin feature/your-feature-name
```

### 5. Create a Pull Request
- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Provide a clear description of your changes

## 🎯 Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **TypeScript**: Use ESLint and Prettier
- **Commits**: Use conventional commit messages

### Testing
```bash
# Test ML API
python -m pytest tests/

# Test Frontend
cd apps/web
npm test
```

### Documentation
- Update README.md for major changes
- Add JSDoc comments for new functions
- Update API documentation

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Python version, Node version

### Feature Requests
For feature requests, please include:
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you think it should work
- **Alternatives**: Other solutions you've considered

## 🔧 Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- pnpm 8+

### Setup
```bash
# Clone and setup
git clone <repository-url>
cd edusmart_27_09

# Python setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Node.js setup
pnpm install

# Start development servers
python prediction_api.py  # Terminal 1
pnpm dev                  # Terminal 2
```

## 📝 Commit Message Format

Use conventional commits:
```
feat: add new feature
fix: fix a bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 🏷️ Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** your changes
5. **Commit** with conventional messages
6. **Push** to your fork
7. **Create** a pull request

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions
- **Email**: For security issues

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md
- Release notes

Thank you for contributing to EduSmart! 🚀
