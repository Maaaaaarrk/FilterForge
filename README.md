# Filter Forge

![Filter Forge](splash.png)

The complete unofficial guide to Project Diablo 2 item filters.

**[Live Site](https://maaaaaarrk.github.io/FilterForge/)** | **[Report an Issue](https://github.com/Maaaaaarrk/FilterForge/issues)**

## What is Filter Forge?

Filter Forge is a community resource for [Project Diablo 2](https://www.projectdiablo2.com/) item filters. It helps players understand, choose, customize, and create their own loot filters.

## Features

### FAQ
Searchable FAQ with 75+ questions covering everything from installation to advanced syntax. Real-time search with tags, two-level accordion (groups + questions), auto-expand on few results, and deep-linkable via `?search=term` or `#question-id`.

### Build My Filter
A 7-step wizard that generates a complete custom filter based on your choices:
- Class selection (Amazon, Sorceress, Necromancer, Paladin, Barbarian, Druid, Assassin)
- Experience level / strictness (New, Casual, Experienced, Endgame)
- Notification preferences (map icons, sounds, big notifications)
- Extra info (socket counts, item level, vendor price, crafting info, ethereal tags)
- Runeword base highlighting
- Consumable hiding options

### Filter Editor
Full-featured editor for creating and modifying `.filter` files:
- **Visual Rule Builder** — click-to-build filter rules with conditions, colors, map icons, sounds
- **Code Editor** — with line numbers, tab support, and auto-save to localStorage
- **Live Preview** — test rules against 19 predefined items to see matches and colors
- **Import from Author** — download filters directly from community authors (9 authors, 43+ filters)
- **Import/Export** — import `.filter` files from disk or export your work
- **Templates** — starter, endgame, rune, crafting, and mapping templates

### Community Filters
Browse all community-maintained filters available in the PD2 launcher, with links to their GitHub repositories.

### Getting Started Guide
Step-by-step tutorial covering filter installation, in-game setup, basic syntax, and first edits.

## Tech Stack

- Pure HTML/CSS/JS — no frameworks, no build step
- Static site deployable to GitHub Pages
- All data inline or in local JSON files (works from `file://`)
- Dark Diablo 2 themed design with gold accents

## Running Locally

Open `index.html` directly in a browser — all features work from `file://` protocol.

For full functionality (live community filter fetching), you can also serve via HTTP:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying

Push to GitHub and enable Pages (Settings > Pages > Source: GitHub Actions). The included workflow at `.github/workflows/deploy-pages.yml` handles deployment automatically.

## Content Sources

- Filter syntax documentation based on the [PD2 Wiki - Item Filtering](https://wiki.projectdiablo2.com/wiki/Item_Filtering)
- Community filter list from [PD2 LootFilters](https://github.com/Project-Diablo-2/LootFilters)
- Filter patterns analyzed from community filters by Wolfie, Kryszard, Kassahi, Erazure, HiimFilter, Dauracul, Sven, PreyInstinct, and Phyx10n

## Contributing

Contributions are welcome! Please [open an issue](https://github.com/Maaaaaarrk/FilterForge/issues) for bugs, suggestions, or new FAQ questions.

## License

This is a community project for Project Diablo 2. Not affiliated with Blizzard Entertainment.
