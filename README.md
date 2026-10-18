# Haunted Shade

> *"He swore ghosts weren't real. Now he's the thing he mocked."*

A top-down stealth-horror game where you play the ghost of Professor Gartner. A family has bought your house, and you have three days to drive them out. Sunlight burns you, the family fights back, and the way you haunt them decides how the story ends.

**[PLAY IN YOUR BROWSER](https://YOUR-USERNAME.github.io/haunted-shade/)** | **[WATCH THE TRAILER](YOUR-YOUTUBE-LINK)** | **[ITCH.IO PAGE](YOUR-ITCH-LINK)**


## Game Jam

- **NasconEvent:** Vibe Code Game Dev
- **Themes used:** Shadow,Time
- **Dates:** 16th October 2026 to 18th October 2026

## The Story

Professor Gartner spent his life in his house and swore ghosts were nonsense. He died in a fire at 4:59 and woke up as the thing he mocked, and now sunlight burns him. The Itadori family (Dad, Mom and Kid) has bought the house. If they last three days, the deed is theirs.

Drive them out, or make them stay. There are **7 endings** to find.

## How the Themes Fit

- **Shadow:** The sun burns you. Furniture shade and closed curtains are your only safe places.
- **Time:** A day clock counts down to sunset.

## How to Play

### Controls

| Key | Action |
|---|---|
| WASD / Arrow keys | Float around the house |
| Hold F near a glowing object | Haunt it |
| F at a window | Open or close the curtains |
| F at a light switch | Turn the lights on or off |
| E | Poltergeist noise |
| Shift | Dash |
| M | Mute |
| Esc | Menu |

### Goals

| Day | Title | Goal |
|---|---|---|
| 1 | First Light | Fill Dad's three fear pips |
| 2 | Stopped Clock | Get two family members to 2+ fear pips at the same time |
| 3 | Sunset | Get all three to 2+ fear pips at once, then make the final choice |

### Mechanics

- **Haunting:** Hold F for 1.5 seconds. It costs 12 spirit and scares people in the room.
- **Poltergeist (E):** It costs 15 spirit and pulls the whole family toward the object. It also scares anyone close to you.
- **Light flicker:** Toggle a switch 4 times quickly to drive everyone out of that room for 15 seconds.
- **Sunlight:** Sun beams drain spirit. Hide in furniture shade or close the curtains.
- **Safe zones:** Rest next to a haunted object to recharge fast.
- **Being seen:** If the family sees you in sunlight or a lit room, the seen bar fills. At 100 you are exorcised, and above 50 they turn the lights on and open curtains.
- **Fear fades:** Fear pips fade faster each day, so chain your scares.
- **Memories:** Haunting key objects (the clock, dusty mirror, toy shelf, bookshelf and wardrobe) shows a memory and builds sympathy.
- **Echoes:** Collect glowing wisps for points. Gold ones are worth 50.

## Endings

There are seven endings, and the Endings menu tracks which ones you have found. Your choices on Day 3 and the sympathy you built up decide the outcome. One ending is a secret.

## Features

- A three-day campaign with a day clock and a final choice
- 7 endings with an unlock tracker, saved in your browser
- Dynamic sunlight, furniture shadows and a family that reacts to fear
- A ghost customizer with three wraiths and three faces
- Collectible echoes and a saved best score
- A spooky look with desaturated colors and a flickering vignette

## Team

| Name | Role | Links |
|---|---|---|
| Amna Farooq| Program and Design|  |
| Hafsa Ayesha| Art Assets and Sound Design | |
| Ummara Amin | Game Idea and Game Design | |

## Run Locally

The game is plain HTML, CSS and JavaScript, so it needs no build step.

1. Download or clone this repository.
2. Open `index.html` in a browser.

Some browsers block local image loading from `file://`. If the portraits or ghost parts don't show up, serve the folder instead, for example with `python -m http.server` and then open `http://localhost:8000`.

## Project Structure

    index.html        Entry page
    js/
      assets.js       Embedded sprite sheets
      data.js         Rooms, walls, windows, objects
      story.js        Intro, memories, days, endings
      audio.js        Sound and music with beep fallbacks
      people.js       Family AI and collectibles
      ui.js           Menus, how to play, customizer
      game.js         State, update, draw, game loop
    fonts/            DigitalDisco font
    audio/            Sound effects and music
    NPC_2/            Gartner portrait expressions
    Ghost/            Wraith character parts

## Credits

### Art
- Ghost characters: https://craftpix.net/freebies/free-wraith-tiny-style-2d-sprites/
- Gartner portraits: https://craftpix.net/freebies/free-medieval-npc-avatars-pixel-pack-for-dialogue/
- House tiles and furniture: https://penzilla.itch.io

### Audio
- Music: https://pixabay.com/
- Sound effects: https://pixabay.com/

### Font
- DigitalDisco: https://www.dafont.com/digital-disco.font
- License: CC BY 4.0

### Tools
- Built with plain JavaScript and the HTML5 canvas
- Trailer recorded with OBS Studio and edited in flexClip

## License

The game code is released under the [MIT License](LICENSE). Art, audio and fonts belong to their respective creators and are used under the licenses listed above. They are not covered by the MIT License.

## Contact

[Email or social link]
