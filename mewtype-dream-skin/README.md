# MewType dream skin

A Web GUI appearance bundle for DeepSeek Harness, drawn after the YunoSeek /
MewType visual language and cast as the five members of 夢限大みゅーたいぷ
(YUME∞MITA): Yuno, Arale, Nonoka, Ritsu and Miyako.

## What it changes

- **Five character palettes** — one alias-token layer (136 tokens per
  character) over the active theme, with separate light and dark values, so it
  composes with the built-in Light / Dark / System choice instead of replacing
  it. Every surface, border, brand accent, glass fill, markdown tint, scrollbar,
  toast, and the composer's send circle follows the chosen character.
- **Personality in the paint** — the hue is only half of it. Each character
  carries its own aurora colors, starlight palette, glow strength, and tempo:

  | Character | Color | Personality | Glow |
  |---|---|---|---|
  | 由乃 Yuno | `#EE5577` | Low-energy cool DJ; grumbles, yet more sincere about music than anyone | Medium-slow, steady |
  | 阿拉蕾 Arale | `#FFEE55` | Upbeat, praise-happy, shy, passionate vocalist | Brightest, fastest twinkle |
  | 野乃花 Nonoka | `#FFBBCC` | Easygoing mood maker on white rice and board games | Soft, medium |
  | 律 Ritsu | `#4477CC` | Earnest honor student; calm and dependable | Restrained, slow |
  | 都子 Miyako | `#9977CC` | Quiet manga artist with her puppet Maru-kun | Softest, slowest |

  The swatches are each member's representative color. On light surfaces the
  chrome ink is a deepened tone of it so text and buttons stay legible; the
  aurora, starlight, avatar ring, and portrait keep the saturated hue.
- **Official portrait wallpaper, in every phase** — the active member's standing
  artwork stays behind the conversation in sessions as well as on the blank
  home, **anchored to the right of the column and standing on its bottom edge** at low
  opacity with a soft drop shadow, faded in when the character changes. The
  `conversation.hero.frame` layer draws it at negative z-index; the stylesheet
  isolates the conversation body (`[data-conversation-content] { isolation:
  isolate }`) so the art lands above the column background and below every
  message. That isolation is the one shipped-stacking trade-off: an unportaled
  popover inside the conversation body is confined to it (portaled menus are
  unaffected).
- **Character avatar** — the mark before the New Session headline is the active
  member's portrait in a circular frame ringed with the theme accent and a tiny
  ∞ badge. It switches with the character.
- **Character placeholder** — the composer hint is replaced with that member's
  own line ("要和由乃聊点什么吗…", "Tell Arale about your day…", …) through a
  copy token and a `::before` on the host placeholder. Normal editable composers
  show it; the workspace picker, disabled, inert, and blocked composers keep the
  host guidance. The host's plan-mode hint is replaced too (no DOM signal
  distinguishes it), and the editable's aria-label keeps the host text.
- **Background effect sliders, two ways** — beside the sidebar color key, a
  compact effects button opens the portrait and ambient-effect assembly: five
  sliders for aurora strength, starlight brightness, starlight density
  (25–200%, adding deterministic extra stars above 100%), portrait strength,
  and portrait size, plus Reset. Each slider snaps to discrete stops (25%
  steps, 20% for portrait size); changing a stop eases over 460 ms through
  registered custom properties instead of jumping. The same controls also sit on the plugin page
  (Plugins → this bundle). Values are stored per browser under
  `dsh.mewtype-dream.fx` and applied live through the `--mewtype-fx-*` tokens.
- **Personality openers** — above the composer on a blank session, three
  suggested openers match the character (a late-night song for Yuno, an anime
  pick for Arale, a solid weekly plan for Ritsu, …). Clicking one fills the
  composer with that text and focuses it. They appear while the hero is showing
  and the draft is empty.
- **Character theme row** — a row in Settings → General lists the five
  characters with their color and a one-line personality note.
- **Sidebar-foot color key** — a one-click key in `sidebar.footer.action`, in the
  row above the account launcher; its ring shows all five character colors and
  the center dot the active one. It shares the shipped footer-action row and is
  hidden in the 56px collapsed rail.

The decoration persists in every conversation phase; settings, Plugins, and other
non-conversation panels show the palette only. Motion is limited to a slow aurora
breath, a star twinkle, and a portrait fade, all disabled by
`prefers-reduced-motion: reduce`. No extra requests are made and no data leaves
the page.

## Artwork

The five standing portraits and five avatars are the official YUME∞MITA
character artwork, downloaded from the reference fan site's public asset server
for this local appearance bundle. They belong to Bushiroad / 夢限大みゅーたいぷ;
this bundle is a personal, local customization and **must not be redistributed**
with that artwork — see [NOTICE.md](NOTICE.md) for the per-image source URLs and
attribution. The source files live in `assets/` and are embedded into
`client.js` as compact WebP data URLs (≈470 KB total) so the skin works offline;
replace them with your own art if you plan to share the bundle. The plugin's own
`icon.svg` and `docs/preview.svg` remain original artwork; the preview is a
schematic and deliberately omits the licensed portraits.

## Switch characters

Settings → General → **Character theme** (设置 → 通用设置 → 角色主题 / 設定 → 一般 →
キャラクターテーマ), or click the five-color ring at the sidebar foot (the row
above the account) to cycle. The choice is stored in this browser under
`dsh.mewtype-dream.cast`; a new browser starts on 由乃. Effect intensities are
separate (`dsh.mewtype-dream.fx`) and reset from the plugin page.

## Enable and disable

Install the directory as a bundle, then use **Plugins** to switch
`@local/dsh-mewtype-dream` on or off. Turning it off removes the palette layers,
the stylesheet, the dictionaries, and every slot occupant in one step; the stock
look returns without a restart.

## Layout

The palette changes no geometry. The hero avatar is a 34 × 34 badge where the
shipped fish is 34 × 25.4, so the homepage headline row can grow by about 2 px,
or by about 9 px when the headline and the mark wrap onto separate lines on a
narrow column. The openers row appears only on the blank home and adds one
32 px chip row above the composer.

## How it is built

- `index.js` is an empty Host seat: the skin is entirely a browser concern.
- `client.js` holds the pure palette engine (`BASE_TOKENS`, `NEUTRALS`, the five
  `CAST` definitions, `buildTokens`), the embedded `CAST_ART`, the character,
  locale, and effect stores, the per-occurrence blank-home context, the
  `[data-conversation-content]` isolation rule, one stylesheet, the dictionaries,
  and the seven registrations across six slots (`conversation.hero.frame`,
  `conversation.hero.brand.mark`, `conversation.input.dock`,
  `settings.general.item`, `sidebar.footer.action` for both the color key and
  the effects assembly, `plugins.bundle.config`). All resources are disposed
  with the plugin.
- Every character's text, accent, button, state, send-glyph, toast/tooltip/
  hovercard, and artwork pairs are checked for contrast in both palettes.

- **Artwork credit** — a small, non-interactive line at the window's
  bottom-right notes that the official character artwork belongs to
  Bushiroad / 夢限大みゅーたいぷ. It exists only in this local artwork build.

## Verification

Checked here: JavaScript syntax, manifest and locale JSON, contrast across all
five palettes in both schemes, and live Client slot occupancy after
installation. The rendered result in a browser — the portrait placement, the
avatar crop, the placeholder replacement, the openers row, and the exact hue of
each character — has not been visually verified in this environment.
