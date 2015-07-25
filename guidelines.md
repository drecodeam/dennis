## Guidelines/code conventions


### Commit messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
    - A properly formed git commit subject line should always be able to complete the following sentence:
    **If applied, this commit will _your subject line here_**
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally
- Separate subject from body with a blank line
- Must be one of the following:
    - feat: A new feature
    - fix: A bug fix
    - docs: Documentation only changes
    - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    - refactor: A code change that neither fixes a bug or adds a feature
    - perf: A code change that improves performance
    - test: Adding missing tests
    - chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

**based on the following articles :**

- http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
- https://atom.io/docs/v0.186.0/contributing
