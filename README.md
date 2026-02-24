# Luis Huesca - Portfolio

Senior Unity Developer Portfolio built with Jekyll for GitHub Pages.

## Quick Start

1. Copy all files to your GitHub repository
2. Enable GitHub Pages in repository Settings → Pages → Deploy from branch `main`
3. Site will be live at `https://yourusername.github.io/`

## Structure

```
├── _config.yml          # Jekyll config
├── _data/               # Data files (easy content editing)
│   ├── projects.yml     # Project entries
│   ├── skills.yml       # Skills categories
│   ├── experience.yml   # Work history
│   └── navigation.yml   # Nav menu items
├── _includes/           # Reusable components
├── _layouts/            # Page templates
├── assets/
│   ├── css/main.css     # Styles
│   ├── js/main.js       # Scripts
│   ├── projects/        # Project media (add your own)
│   └── resume/          # CV PDF
└── index.html           # Homepage
```

## Editing Content

### Add a New Project

Edit `_data/projects.yml` and add:

```yaml
- id: new-project
  title: Project Name
  company: Company
  role: Your Role
  short_desc: Brief description...
  full_desc: |
    Longer description for modal.
  platforms:
    - iOS
    - Android
  tech:
    - Unity
    - C#
  category: mobile  # or 'vr'
  video: /assets/projects/new-project/trailer.mp4
  thumb: /assets/projects/new-project/thumb.jpg
  screenshots:
    - /assets/projects/new-project/screen1.jpg
  responsibilities:
    - Did this
    - Did that
  challenges:
    - Solved X
  links:
    appstore: ""
```

### Update Experience

Edit `_data/experience.yml`.

### Update Skills

Edit `_data/skills.yml`.

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`

## Palette

- Background: #0B0F14 (Void Black)
- Accent: #3DF2E0 (Neon Cyan)
- Text: #E8ECF0
- Muted: #8B9AAB
