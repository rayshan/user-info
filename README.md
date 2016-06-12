User Info Lookup
===

> Lookup information given an username.

## [DEMO](https://shan.io/user-info/)

Currently this app only searches for an user's possible email address given a GitHub username.

Known issues:
- Due to lack of GitHub authentication, the app queries GitHub using your IP. You should hit your rate limit after using the app for a short while.
- Email is extracted from one of your push event's commit history, which may include commits from other authors. Currently the first found email is returned. A better solution would be gather all the names and emails from all the authors, and guess which is likely your true email based on some heuristics, such as based on your real name (e.g. `Ray Shan` => `ray at shan.io`).

## Development

- `npm run dev`
- Open `localhost:4000` with your favorite browser

## Production

- `npm run prod`
- Serve `index.html` and `/dist` with your favorite static asset server

## License

MIT
