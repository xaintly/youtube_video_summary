# Contributing to YouTube Claude Summary

First off, thanks for considering contributing! 

## Ways to Contribute

- Report bugs
- Suggest features
- Improve documentation
- Submit pull requests
- Star the project!

## Reporting Bugs

**Before submitting a bug report:**
- Check existing issues to avoid duplicates
- Test with the latest version
- Gather details: Firefox version, extension version, error messages

**When creating a bug report, include:**
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser console errors (F12)

## Suggesting Features

**Feature requests should include:**
- Clear description of the feature
- Use case / problem it solves
- Potential implementation approach (if you have ideas)
- Examples from other extensions (if applicable)

## Pull Requests

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a pull request

### Code Guidelines

**JavaScript:**
- Use modern ES6+ syntax
- Add comments for complex logic
- Follow existing code style
- Avoid unnecessary dependencies

**HTML/CSS:**
- Maintain existing structure and naming conventions
- Ensure responsive design
- Test UI changes in different popup sizes

**Testing:**
- Test on multiple YouTube videos (different lengths, languages)
- Verify all three Claude models work
- Test configuration save/load
- Check caching behavior

### Commit Messages

Use clear, descriptive commit messages:

```
✅ Good:
- "Add playlist support for batch summarization"
- "Fix: Prevent duplicate API calls for cached summaries"
- "Docs: Update model comparison table with latest pricing"

❌ Bad:
- "fix bug"
- "update"
- "changes"
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on Firefox
```

## Development Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/youtube-claude-summary.git
   cd youtube-claude-summary
   ```

2. **Load in Firefox:**
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `manifest.json`

3. **Make changes and reload:**
   - Edit code
   - Click "Reload" in about:debugging
   - Test your changes

## Code Review Process

1. Maintainer reviews PR
2. Feedback provided (if needed)
3. You address feedback
4. PR approved and merged
5. Changes included in next release

## Feature Ideas

Some features we'd love help with:

- [ ] Dark mode support
- [ ] Export summaries (PDF, Markdown)
- [ ] Timestamp links in summaries
- [ ] Playlist batch processing
- [ ] Custom prompt templates
- [ ] Summary history/archive
- [ ] Keyboard shortcuts
- [ ] Multiple language UI support
- [ ] Chrome/Edge compatibility
- [ ] Settings import/export

## Questions?

- Open an issue with the "question" label
- Check existing documentation first
- Be respectful and patient

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Recognition

Contributors will be:
- Listed in release notes
- Credited in README (if substantial contribution)
- Given our sincere thanks!

---

**Thank you for contributing!** Every contribution, no matter how small, helps make this project better.
