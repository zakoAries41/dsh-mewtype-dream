# dsh-mewtype-dream

An unofficial, open-source **MewType / 夢限大 dream appearance plugin** for the
[DeepSeek Harness](https://github.com/deepseek-ai) Web GUI. It recolors the whole
interface with five character themes, keeps a dreamy aurora and starlight behind
the conversation, and adds character-flavored composer hints and openers.

> **No character artwork is bundled.** The portrait feature expects artwork you
> embed yourself (see [Add your own artwork](#add-your-own-artwork)). Without it,
> the avatar falls back to the MewType loop and the background keeps the aurora
> and starlight. This repository intentionally ships no third-party illustrations —
> see [NOTICE.md](NOTICE.md).

`docs/preview.svg` is the original feature illustration: a ringed avatar, the
openers row, and the five character colors.

## Features

- **Five character palettes** — Yuno, Arale, Nonoka, Ritsu, and Miyako. Each is a
  rose/plum palette in that member's representative color with separate light and
  dark values, so it composes with the built-in Light / Dark / System preference.
  Surface, border, brand, glass, markdown, scrollbar, toast, and send-button
  tokens all follow the character.
- **Personality in the paint** — every character has its own aurora colors,
  starlight palette, glow strength, and breath/twinkle tempo.
- **Persistent background** — the aurora and starfield stay behind the
  conversation in every phase, and a character portrait sits on the right once
  you embed artwork. They ride at negative z-index; the plugin isolates the
  conversation body so the art stays above the column background and below every
  message.
- **Character avatar** — the mark before the New Session headline becomes the
  active member's avatar (or the ∞ loop when no artwork is embedded).
- **Character placeholder** — the composer hint becomes that member's own line
  (localized en/zh/ja). Workspace-picker, disabled, inert, and blocked composers
  keep the host guidance.
- **Personality openers** — three suggested prompts above the composer on a blank
  session, matched to the character; clicking one fills the composer and focuses
  it.
- **Two ways to tune it** — a compact effects assembly beside the sidebar color
  key and the same sliders on the bundle's plugin page: aurora strength,
  starlight brightness, starlight density, portrait strength, and portrait size.
  Sliders snap to discrete stops (25%, and 20% for size) and ease over 460 ms.
- **All local** — no network requests, no model requests, no analytics. Choices
  stay in this browser.

## Requirements

- DeepSeek Harness with the Web GUI (Desktop or `dsh web`).
- Install this directory as a **local bundle**: **Plugins → Add plugin** and pick
  this folder, or use the plugin manager's `install_bundle` with the directory as
  the target. Then enable it. A brand-new client build may need one page refresh.

## Characters

| Character | Color | Personality | Glow |
|---|---|---|---|
| 由乃 Yuno | `#EE5577` | Low-energy cool DJ; grumbles, yet sincere about music | Medium-slow |
| 阿拉蕾 Arale | `#FFEE55` | Upbeat, praise-happy, shy, passionate vocalist | Brightest, fastest |
| 野乃花 Nonoka | `#FFBBCC` | Easygoing mood maker on rice and board games | Soft, medium |
| 律 Ritsu | `#4477CC` | Earnest honor student; calm and dependable | Restrained, slow |
| 都子 Miyako | `#9977CC` | Quiet manga artist with her puppet Maru-kun | Softest, slowest |

Switch with **Settings → General → Character theme**, or click the five-color ring
at the sidebar foot to cycle. The choice is stored per browser
(`dsh.mewtype-dream.cast`); effect values use `dsh.mewtype-dream.fx`.

## Controls

| Where | What |
|---|---|
| Settings → General → Character theme | Five character chips with a personality note |
| Sidebar foot, five-color ring | One-click cycle through the characters |
| Sidebar foot, sliders key | Aurora, starlight brightness, starlight density, portrait strength, portrait size, reset |
| Plugins → this bundle page | The same five sliders plus reset |

## Add your own artwork

1. Prepare WebP files for each character id (`yuno`, `arale`, `nonoka`, `ritsu`,
   `miyako`):
   - `art/<id>-portrait.webp` — standing artwork, about 700 × 900 px, transparent.
   - `art/<id>-avatar.webp` — square face crop, about 160 × 160 px.
2. Put them in `art/` at the repository root (`art/` is git-ignored).
3. Run `node scripts/embed-art.mjs`; it replaces the marked `CAST_ART` block in
   `client.js` with compact data URLs, so the bundle keeps working offline.
4. Re-add/refresh the bundle. `git checkout -- client.js` restores the
   artwork-free build.

Only embed artwork you have the rights to use. The official YUME∞MITA
illustrations belong to Bushiroad and must not be redistributed — see
[NOTICE.md](NOTICE.md).

## Privacy

The plugin runs entirely in the page. It adds no HTTP requests and no model
requests, and stores only two local preferences:
`dsh.mewtype-dream.cast` (character) and `dsh.mewtype-dream.fx` (effect values).
Disabling the bundle removes the palette layer, stylesheet, dictionaries, and all
slot contributions; the stock look returns without a restart.

## Limitations

- To keep the background visible in active sessions, the plugin isolates the
  conversation body (`[data-conversation-content] { isolation: isolate }`). An
  unportaled popover opened inside that body is confined to its stacking context;
  portaled menus are unaffected.
- The placeholder replacement has no DOM signal for the host's plan-mode hint, so
  plan mode also shows the character line; workspace picking, disabled, and
  blocked states keep their own guidance.
- The decoration appears in conversation panels only — Settings, Plugins, and
  other non-conversation pages keep the palette alone.

## Development

- `client.js` is the whole browser half: a pure palette engine between the
  `CAST-PALETTE` markers, the `CAST_ART` block between the `CAST-ART` markers,
  the stores, the stylesheet, and six slot registrations
  (`conversation.hero.frame`, `conversation.hero.brand.mark`,
  `conversation.input.dock`, `settings.general.item`, `sidebar.footer.action`
  twice, `plugins.bundle.config`).
- `node scripts/check-contrast.mjs` extracts the palette engine and checks every
  character against the text, accent, button, state, send-glyph, toast/tooltip/
  hovercard, and artwork contrast floors in both palettes.
- `scripts/embed-art.mjs` produces the artwork-full build from `art/`.

## License

Code and original artwork (icon, preview, aurora, starlight, ∞ badge) are released
under the [MIT License](LICENSE). Bundled-by-you character artwork is not covered.
MewType, YUME∞MITA, BanG Dream!, and DeepSeek Harness are the property of their
respective owners; this project is unofficial and unaffiliated. The visual
language was inspired by the [YunoSeek community site](https://yunoseek.ownbangdream.asia/).

## 中文简介

梦限大（MewType）风格的 DSH Web 界面外观插件，开源免费（MIT）。提供五位角色的配色、
背景极光与星屑、角色头像、角色专属输入框提示、性格推荐对话，以及侧栏底部和插件页的
效果滑块。**仓库不包含任何第三方角色插画**：把你自己拥有使用权的立绘放进 `art/` 并运行
`node scripts/embed-art.mjs` 即可启用背景立绘；不嵌入时头像会回退为 ∞ 标记。官方
YUME∞MITA 立绘版权归 Bushiroad，请勿再分发。
