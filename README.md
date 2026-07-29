# Site4Site Backend

Site4Site Backend is the REST API that powers the Site4Site personal digital
library. It lets authenticated users organize useful websites, manage everyday
tasks, and build personal anime, movie, and game collections.

## Features

### 🔗 Site Management

Organize websites into personal sections.

- Create sections with a title and description.
- Add websites with a name, URL, and personal note.
- Fetch sections together with their saved websites.
- Edit section and website information.
- Delete individual websites or an entire section.
- Automatically delete a section's websites when the section is removed.

### ✅ Task Management

Manage a personal list of everyday tasks.

- Add new tasks.
- Fetch tasks with the most recently updated items first.
- Mark tasks as completed or incomplete.
- Edit existing tasks.
- Delete tasks that are no longer needed.

### 🎬 Anime Discovery and Tracking

Search for anime and maintain a personal collection.

- Search anime by title.
- Fetch genres for a selected anime.
- Save anime with its title, image, episode count, and genres.
- Track anime as:
  - Watching
  - Plan to watch
  - Completed
- Record watched episodes, a personal rating, and notes.
- Update or remove saved anime.

### 🍿 Movie Discovery and Tracking

Find movies and save them to a personal watchlist.

- Search movies by title.
- Fetch detailed information for a selected movie.
- Save movie details, ratings, plot, genre, and runtime.
- Track movies as:
  - Watched
  - Plan to watch
- Add and update personal notes.
- Update a movie's status or remove it from the collection.

### 🎮 Game Discovery and Tracking

Explore games and build a personal game library.

- Search for games and view their details.
- View game screenshots and trailers.
- Track games as:
  - Playing
  - Completed
  - Dropped
  - Wishlist
- Save a personal rating, review, and favourite status.
- Update or remove saved games.

### 🔐 API and Security

- Authenticate protected requests with Supabase access tokens.
- Keep every user's saved content separate.
- Store tasks, sections, websites, anime, movies, and games in MongoDB.
- Prevent duplicate tasks and entertainment items for the same user.
- Rate-limit public searches and authenticated data operations.
- Cache external search results for faster responses and fewer API calls.
- Apply timeouts when communicating with external services.
- Restrict frontend access through a configurable CORS allowlist.
- Validate requests and return clear error messages.
- Provide consistent success and error responses.
- Expose a health-check endpoint for uptime monitoring.

Site4Site Backend keeps every user's content separate while providing one API
for websites, tasks, anime, movies, and games.
