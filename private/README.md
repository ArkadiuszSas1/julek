# Private Storage

This directory is intended for files that should not be exposed by the web server.

In this Vite project:
- Files in the `public/` directory are served at the root path of the website.
- Files in the `src/` directory are processed/bundled by Vite.
- Files in this `private/` directory (and other directories in the root) are **not** included in the production build (`dist/`) unless they are explicitly imported in your source code.

**Note:** During development, the Vite dev server might still serve files from the root if a specific path is requested. To prevent this, ensure these files are not sensitive, or move them outside the project root if absolute privacy is required during development.
