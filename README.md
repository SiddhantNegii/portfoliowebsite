# Siddhant's Room

My portfolio as a small 3D room you can walk around in. Built with React, Vite and three.js.

- **MacBook**: about, experience, education, certifications, skills
- **Monitor**: projects
- **Arcade cabinet**: favourite anime, games and movies. Browse it like an arcade: arrow keys or the joystick move, Enter or any cabinet button selects, Esc goes back
- **Couch**: hobbies
- **Fridge**: favourite food
- **Telephone**: contact
- **Floor lamp**: switches the whole site between night (the default) and day
- **The cat**: wanders around, meows now and then, and yawns and snores through naps on the couch. Click to pet him; drag to pick him up and drop him anywhere, even on top of the fridge
- **Sound**: every sound is synthesized in the browser with Web Audio (no audio files); the mute choice is remembered

There is also a plain list view (top right) with the same content, and the site falls back to it when WebGL isn't available.

## Editing content

Everything on the site comes from [`content.json`](content.json) in the repo root. Edit it, push, and Vercel rebuilds the site.

- `site`: browser tab title, search and link-preview descriptions, and the no-JavaScript fallback text
- `profile`: name, headline, tagline, email
- `hoverLabels`: tooltips for the cat and the lamp
- `room`: one entry per object (`macbook`, `monitor`, `arcade`, `couch`, `fridge`, `phone`). Their order sets the order of the buttons along the bottom. Each has a hover `label`, a `jump` button label, an `eyebrow`, a `title` and a list of `sections`. `macbook.screen` holds the lines on the laptop's terminal.

The arcade's channels are its sections that have `chips`. The monitor's screen lists the first five projects under `monitor`.

A section can hold any of these fields:

| Field    | Shows                                     |
| -------- | ----------------------------------------- |
| `h`      | section heading                           |
| `p`      | paragraph                                 |
| `list`   | bullet list                               |
| `chips`  | tag chips (an empty list hides the section) |
| `more`   | adds an "and a lot more" line after the chips |
| `stats`  | `[number, label]` tiles                   |
| `groups` | named groups of chips                     |
| `items`  | entries with title `t`, subtitle `s`, optional `links`, `list`, `live` |
| `email`  | email address with a copy button         |
| `links`  | `[label, url]` buttons                    |
| `coin`   | blinking arcade-style line                |

JSON is strict: use double quotes, no trailing commas, no comments. If the file is broken, `npm run build` fails and points at the line.

The 3D scene lives in `src/scene/`: `objects.js` builds the furniture and camera views, `cat.js` is the cat, and `Room.js` handles the camera, clicks and day/night lighting.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

On Vercel, import the repo with the **Vite** preset: build command `npm run build`, output directory `dist`. No environment variables needed.
