# PromptPack Specification Documentation

Official documentation site for the PromptPack specification - the open standard for packaging, testing, and running multi-prompt conversational systems.

## 🌐 Live Site
Visit [promptpack.org](https://promptpack.org) to view the documentation.

## 🚀 Development

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command:
1. Syncs RFCs from `/rfcs/` to `/docs/rfcs/` with Docusaurus frontmatter
2. Starts a local development server and opens up a browser window

Most changes are reflected live without having to restart the server.

**Note:** RFC files in `docs/rfcs/` are auto-generated and gitignored. Edit RFCs in the root `/rfcs/` directory.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 Organization

Maintained by [AltairaLabs](https://github.com/altairalabs)
