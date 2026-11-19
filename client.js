/**
 * MewType dream skin — browser half.
 *
 * Three contributions, all owned by this module:
 *  1. A palette layer over the active theme (`ctx.theme.overrideTokens`). The
 *     layer is built per band member: each of the five MewType characters owns
 *     a hue, an accent pair for the artwork, and a glow tempo, so switching
 *     character changes the whole atmosphere, not just one accent.
 *  2. A home decoration layer in `conversation.hero.frame`: the aurora and the
 *     starlight behind the blank-session content. The Conversation root
 *     isolates stacking on the home, which is what makes negative z-index art
 *     land above its background and below its content. A separate
 *     `conversation.hero.brand.mark` occupant replaces the headline fish with
 *     the dream mark.
 *  3. One preference row in Settings → General (`settings.general.item`) listing
 *     the five characters with their color and personality; the choice is kept
 *     in this browser and applied without a reload.
 *
 * The palette follows the YunoSeek / MewType dream language: rose ink on
 * character-tinted plum surfaces, periwinkle and starlight accents. Surface and
 * accent values are derived from each character's representative color by the
 * pure functions below, in both palettes, so the artwork and the chrome always
 * belong to the same character.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-mewtype-dream',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Theme layer identity; also the bundle package name. */
    const SKIN_ID = '@local/dsh-mewtype-dream'
    /** Stylesheet element id, kept stable so an HMR reload can replace it. */
    const STYLE_ID = 'mewtype-dream-skin'
    /** Browser-local storage key for the chosen character. */
    const STORAGE_KEY = 'dsh.mewtype-dream.cast'
    /** Client locale namespace owned by this plugin. */
    const LOCALE_NS = 'mewtype-dream'

    /* ==== CAST-PALETTE-START ==== */
    /**
     * Character-invariant tokens: typography ink, semantic states, glass labels,
     * and the neutral skeleton/track fills. Everything that should follow the
     * character hue lives in {@link buildTokens} instead.
     */
    const BASE_TOKENS = {
      '--dsw-alias-label-primary': { light: '#241a2a', dark: '#f4eef7' },
      '--dsw-alias-label-secondary': { light: '#5f5268', dark: '#c9bed2' },
      '--dsw-alias-label-tertiary': { light: '#7d6e89', dark: '#9c90a6' },
      '--dsw-alias-label-caption': { light: '#8f8199', dark: '#7f7489' },
      '--dsw-alias-label-dimmed': { light: '#e9e1ee', dark: '#322b3a' },
      '--dsw-alias-label-primary-dimmed': { light: '#1b1420', dark: '#f6f1f8' },
      '--dsw-alias-label-primary-inverted': { light: '#ffffff', dark: '#1b1420' },
      '--dsw-alias-label-primary-bluish': { light: '#4b3b78', dark: '#d9ccf0' },
      '--dsw-alias-label-on-color': { light: '#ffffff', dark: '#14101a' },
      '--dsw-alias-label-primary-foreground': { light: '#ffffff', dark: '#14101a' },
      '--dsw-alias-label-shimmer': {
        light: 'rgba(36, 26, 42, 0.24)',
        dark: 'rgba(255, 240, 248, 0.42)',
      },
      '--dsw-alias-brand-primary-invert': { light: '#241a2a', dark: '#f4eef7' },
      '--dsw-alias-button-contrast-fill': { light: '#4a3a50', dark: '#f4eef7' },
      '--dsw-alias-button-ghost-active-fill': { light: '#f5ebf5', dark: '#2e2634' },
      '--dsw-alias-button-ghost-active-hover': { light: '#efe3f0', dark: '#382e3f' },
      '--dsw-alias-button-ghost-active-border': { light: '#a6799a', dark: '#9c8aa6' },
      '--dsw-alias-interactive-bg-hover-danger': {
        light: 'rgba(214, 60, 94, 0.07)',
        dark: 'rgba(255, 138, 160, 0.14)',
      },
      '--dsw-alias-state-business-primary': { light: '#4b6fd6', dark: '#7c9bff' },
      '--dsw-alias-state-business-tertiary': { light: '#e7edff', dark: '#2b3350' },
      '--dsw-alias-state-done-primary': { light: '#7a5bd6', dark: '#b49bfa' },
      '--dsw-alias-state-error-primary': { light: '#c62f52', dark: '#ff8aa0' },
      '--dsw-alias-state-error-secondary': { light: '#e86a84', dark: '#ffa9b8' },
      '--dsw-alias-state-idle-primary': { light: '#d3c8d9', dark: '#5e5364' },
      '--dsw-alias-state-success-primary': { light: '#1a7048', dark: '#48c98d' },
      '--dsw-alias-state-success-secondary': { light: '#45c08a', dark: '#6fdea9' },
      '--dsw-alias-state-success-tertiary': { light: '#e3f7ed', dark: '#173a2a' },
      '--dsw-alias-state-warn-label': { light: '#9c6109', dark: '#e7b25f' },
      '--dsw-alias-state-warn-primary': { light: '#e9a23b', dark: '#f6c15a' },
      '--dsw-alias-state-warn-secondary': { light: '#f2b857', dark: '#ffd27a' },
      '--dsw-alias-state-warn-tertiary': { light: '#fef3dd', dark: '#3a3020' },
      '--dsw-alias-chart-tools': { light: '#8b7be8', dark: '#b8a9ff' },
      '--dsw-alias-chart-system': { light: '#b9afc2', dark: '#8b7f94' },
      '--dsw-alias-trajectory-accent': { light: '#5b7de0', dark: '#7c9bff' },
      '--dsw-alias-bg-skeleton': {
        light: 'rgba(91, 60, 96, 0.06)',
        dark: 'rgba(255, 235, 246, 0.07)',
      },
      '--dsw-specific-file-upload-track': {
        light: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(0, 0, 0, 0.08)',
      },
      '--dsw-alias-label-document-preview': { light: '#6b5c72', dark: '#c9bed2' },
      '--dsw-alias-toast-label': { light: '#ffffff', dark: '#ffffff' },
      '--dsw-alias-toast-action': { light: '#ffb6d3', dark: '#ffb6d3' },
      '--dsw-alias-tooltip-label': { light: '#ffffff', dark: '#ffffff' },
      '--dsw-alias-hovercard-label-primary': { light: '#ffffff', dark: '#ffffff' },
      '--dsw-alias-hovercard-label-secondary': { light: '#e4dce8', dark: '#e4dce8' },
      '--dsw-alias-hovercard-label-tertiary': { light: '#b6a7be', dark: '#b6a7be' },
      '--dsw-alias-hovercard-state-done': { light: '#b49bfa', dark: '#b49bfa' },
      '--dsw-alias-hovercard-state-error': { light: '#ff8aa0', dark: '#ff8aa0' },
      '--dsw-alias-switch-thumb': { light: '#ffffff', dark: '#e9dfee' },
    }

    /**
     * Neutral anchors the character hue is mixed into. Only the surface and
     * chrome families live here; ink and state colors stay in `BASE_TOKENS`.
     */
    const NEUTRALS = {
      light: {
        layer2: '#fdf9fe',
        layer3: '#f8f2fa',
        overlay: '#f0eaf3',
        module: '#f7f1f9',
        multi: '#f7f1f9',
        docPreview: '#f6f0f8',
        sidebar: '#faf5fb',
        navActive: '#f3e7f2',
        selector: '#f5eef7',
        tip: '#fbf4fd',
        bubble: '#fdeff5',
        bubbleHi: '#f9dce9',
        guide: '#eadce9',
        login: '#faf5fb',
        card: '#ffffff',
        cardHover: '#fdf6fa',
        menu: '#fffafd',
        menuHeader: '#fdf7fb',
        borderSeed: '#543052',
        hoverSeed: '#78466e',
        code: '#f9f3fa',
        codeBanner: '#f4ecf6',
        codeUnsel: '#f7f0f9',
        inline: '#f5eef6',
        tag: '#f1e8f3',
        citation: '#f3eaf5',
        placeholder: '#f5eff6',
        scroll1: '#eadfec',
        scroll2: '#dfd2e2',
        scrollHover1: '#ddcee1',
        scrollHover2: '#d0bed5',
        toast: '#3b2b42',
        illustrationBg: '#fbf7fb',
        illustrationSurface: '#f3e7f2',
        illustrationBacking: '#e7d6e9',
        illustrationDetail: '#dcc6e0',
        dimmedButton: '#f6e3ec',
      },
      dark: {
        layer1: '#1b1620',
        layer2: '#221c28',
        layer3: '#2a2330',
        overlay: '#2e2735',
        module: '#201a25',
        multi: '#241e29',
        docPreview: '#1a151f',
        sidebar: '#16111a',
        navActive: '#2a2230',
        selector: '#251e2a',
        tip: '#221b27',
        bubble: '#2b2130',
        bubbleHi: '#3a2c41',
        guide: '#3a2e40',
        login: '#1b151f',
        input: '#201a25',
        card: '#1e1823',
        cardHover: '#251e2a',
        menu: '#2c2432',
        menuHeader: '#2c2432',
        borderSeed: '#ffe8f4',
        hoverSeed: '#ffebf6',
        code: '#1d1720',
        codeBanner: '#241c28',
        codeUnsel: '#211a25',
        inline: '#2a2130',
        tag: '#2a2130',
        citation: '#2a2130',
        placeholder: '#241d28',
        scroll1: '#3a3040',
        scroll2: '#4a3b52',
        scrollHover1: '#4e4156',
        scrollHover2: '#5c4c66',
        toast: '#2a2231',
        illustrationBg: '#221b26',
        illustrationSurface: '#3a2e40',
        illustrationBacking: '#4a3b52',
        illustrationDetail: '#6a5874',
        dimmedButton: '#3a2b38',
      },
    }

    /**
     * The five members of 夢限大みゅーたいぷ / YUME∞MITA. `color`, `accent` and
     * `third` are the character's representative inks: the first drives the
     * chrome, the other two drive the starlight and the mark gradient. The
     * glow values are the personality: brighter and faster for the livewire
     * vocalist, dimmer and slower for the quiet ones.
     */
    const CAST = [
      {
        id: 'yuno',
        color: '#ee5577',
        accent: '#ffd966',
        third: '#9db4ff',
        auroraLight: '0.55',
        auroraDark: '0.85',
        starsLight: '0.5',
        starsDark: '0.8',
        scale: '1.02',
        auroraDuration: '10s',
        twinkleDuration: '7.5s',
      },
      {
        id: 'arale',
        color: '#ffee55',
        accent: '#ff9f45',
        third: '#7fd4ff',
        auroraLight: '0.68',
        auroraDark: '1',
        starsLight: '0.6',
        starsDark: '0.95',
        scale: '1.06',
        auroraDuration: '7s',
        twinkleDuration: '4.4s',
      },
      {
        id: 'nonoka',
        color: '#ffbbcc',
        accent: '#ff7fa8',
        third: '#ffd966',
        auroraLight: '0.6',
        auroraDark: '0.9',
        starsLight: '0.55',
        starsDark: '0.85',
        scale: '1.03',
        auroraDuration: '9s',
        twinkleDuration: '6.4s',
      },
      {
        id: 'ritsu',
        color: '#4477cc',
        accent: '#7fb6ff',
        third: '#ffd966',
        auroraLight: '0.48',
        auroraDark: '0.72',
        starsLight: '0.45',
        starsDark: '0.7',
        scale: '1.01',
        auroraDuration: '12s',
        twinkleDuration: '9s',
      },
      {
        id: 'miyako',
        color: '#9977cc',
        accent: '#c9a7ff',
        third: '#ffd966',
        auroraLight: '0.44',
        auroraDark: '0.68',
        starsLight: '0.4',
        starsDark: '0.6',
        scale: '1',
        auroraDuration: '13s',
        twinkleDuration: '10.5s',
      },
    ]

    /** Parse `#rrggbb` into an RGB triplet. @param hex - color. @returns channels. */
    function parseHex(hex) {
      const value = parseInt(hex.trim().slice(1), 16)
      return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
    }

    /** Format an RGB triplet as `#rrggbb`. @param rgb - channels. @returns color. */
    function toHex(rgb) {
      return '#' + rgb.map((channel) => {
        const clamped = Math.max(0, Math.min(255, Math.round(channel)))
        return clamped.toString(16).padStart(2, '0')
      }).join('')
    }

    /**
     * Mix two colors.
     * @param from - starting color.
     * @param to - ending color.
     * @param amount - 0 keeps `from`, 1 returns `to`.
     * @returns the mixed color.
     */
    function mix(from, to, amount) {
      const a = parseHex(from)
      const b = parseHex(to)
      return toHex([
        a[0] + (b[0] - a[0]) * amount,
        a[1] + (b[1] - a[1]) * amount,
        a[2] + (b[2] - a[2]) * amount,
      ])
    }

    /** @param hex - color. @param alpha - 0..1. @returns an `rgba()` string. */
    function alpha(hex, amount) {
      const [r, g, b] = parseHex(hex)
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + amount + ')'
    }

    /** WCAG relative luminance of a color. @param hex - color. @returns 0..1. */
    function luminance(hex) {
      const channel = (value) => {
        const v = value / 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      }
      const rgb = parseHex(hex)
      return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])
    }

    /**
     * Contrast ratio between two opaque colors.
     * @param a - first color.
     * @param b - second color.
     * @returns the ratio, 1..21.
     */
    function contrast(a, b) {
      const first = luminance(a)
      const second = luminance(b)
      const high = Math.max(first, second)
      const low = Math.min(first, second)
      return (high + 0.05) / (low + 0.05)
    }

    /**
     * Nudge a color until it reaches a contrast floor against a background.
     * @param color - starting color.
     * @param background - color it must stay legible on.
     * @param minimum - required contrast ratio.
     * @param toward - direction to move in (dark ink on light surfaces, or white on dark).
     * @returns the adjusted color.
     */
    function readable(color, background, minimum, toward) {
      let amount = 0
      let current = color
      while (contrast(current, background) < minimum && amount < 0.96) {
        amount += 0.03
        current = mix(color, toward, amount)
      }
      return current
    }

    /**
     * Build the complete token map for one character: the invariant base plus
     * every surface, border, brand, glass, and artwork value derived from the
     * character inks and the neutral anchors.
     * @param cast - one entry of {@link CAST}.
     * @returns token name → `{ light, dark }` pairs.
     */
    function buildTokens(cast) {
      const L = NEUTRALS.light
      const D = NEUTRALS.dark
      const hue = cast.color

      // Tinted canvases first: every ink threshold is measured on them.
      const lightBase = mix('#fbf7fb', hue, 0.05)
      const darkBase = mix('#131017', hue, 0.06)
      // The tinted chips are the least forgiving backgrounds each ink meets:
      // the light count badge and the dark count badge, both composited over the
      // already-tinted sidebar.
      const lightChip = mix(mix(L.sidebar, hue, 0.05), hue, 0.2)
      const darkCanvas = mix(D.overlay, hue, 0.08)
      const darkChip = mix(mix(D.sidebar, hue, 0.05), hue, 0.16)
      const lightWorst = luminance(lightChip) < luminance(lightBase) ? lightChip : lightBase
      const darkWorst = luminance(darkChip) > luminance(darkCanvas) ? darkChip : darkCanvas

      // Chrome ink. The light button carries white text, the dark one dark text;
      // `label-on-color` follows the same split, so the send glyph flips with
      // the palette instead of staying white on a pale character fill.
      const ink = readable(hue, lightWorst, 4.5, '#151018')
      const bright = readable(hue, darkWorst, 4.5, '#ffffff')
      const hoverInk = mix(ink, '#151018', 0.12)
      const hoverBright = mix(bright, '#ffffff', 0.14)

      // Artwork inks only need the 3:1 graphic floor.
      const artLight = readable(hue, lightBase, 3, '#151018')
      const artDark = readable(hue, darkBase, 3, '#ffffff')
      const accentLight = readable(cast.accent, lightBase, 3, '#151018')
      const accentDark = readable(cast.accent, darkBase, 3, '#ffffff')
      const thirdLight = readable(cast.third, lightBase, 3, '#151018')
      const thirdDark = readable(cast.third, darkBase, 3, '#ffffff')

      // Pale hues (the yellow and the pastel pink) all but vanish over a light
      // canvas at a fixed alpha, which would invert the intended personality
      // hierarchy; deepen and strengthen their light-mode glow in proportion to
      // how light the hue is.
      const hueLum = luminance(hue)
      const glowDepth = 0.08 + 0.18 * hueLum
      const glowAlpha = (0.38 + 0.16 * hueLum).toFixed(2)
      const glowAccentDepth = 0.07 + 0.14 * hueLum
      const glowAccentAlpha = (0.24 + 0.1 * hueLum).toFixed(2)
      const glowThirdDepth = 0.06 + 0.1 * hueLum
      const glowThirdAlpha = (0.16 + 0.08 * hueLum).toFixed(2)

      const tokens = { ...BASE_TOKENS }

      /**
       * Add one token.
       * @param name - CSS variable.
       * @param light - light value.
       * @param darkMode - dark value.
       */
      const put = (name, light, darkMode) => {
        tokens[name] = { light, dark: darkMode }
      }

      // ---- surfaces ---------------------------------------------------------
      put('--dsw-alias-bg-base', lightBase, darkBase)
      put('--dsw-alias-bg-layer-1', mix('#ffffff', hue, 0.02), mix(D.layer1, hue, 0.05))
      put('--dsw-alias-bg-layer-2', mix(L.layer2, hue, 0.05), mix(D.layer2, hue, 0.06))
      put('--dsw-alias-bg-layer-3', mix(L.layer3, hue, 0.06), mix(D.layer3, hue, 0.07))
      put('--dsw-alias-bg-overlay', mix(L.overlay, hue, 0.06), mix(D.overlay, hue, 0.08))
      put('--dsw-alias-bg-module-platform', mix(L.module, hue, 0.05), mix(D.module, hue, 0.06))
      put('--dsw-alias-bg-multi-select', mix(L.multi, hue, 0.05), mix(D.multi, hue, 0.07))
      put('--dsw-alias-bg-document-preview', mix(L.docPreview, hue, 0.05), mix(D.docPreview, hue, 0.06))
      put('--dsw-alias-bg-document-selection', alpha(hue, 0.38), alpha(hue, 0.38))
      put('--dsw-specific-sidebar-fill', mix(L.sidebar, hue, 0.05), mix(D.sidebar, hue, 0.05))
      put('--dsw-specific-sidebar-nav-item-active', mix(L.navActive, hue, 0.12), mix(D.navActive, hue, 0.14))
      put('--dsw-specific-sidebar-nav-item-active-accent', alpha(hue, 0.2), alpha(hue, 0.16))
      put('--dsw-specific-input-major', mix('#ffffff', hue, 0.015), mix(D.input, hue, 0.07))
      put('--dsw-specific-selector', mix(L.selector, hue, 0.06), mix(D.selector, hue, 0.08))
      put('--dsw-specific-tip', mix(L.tip, hue, 0.05), mix(D.tip, hue, 0.06))
      put('--dsw-specific-bubble', mix(L.bubble, hue, 0.32), mix(D.bubble, hue, 0.16))
      put('--dsw-specific-bubble-highlight', mix(L.bubbleHi, hue, 0.3), mix(D.bubbleHi, hue, 0.22))
      put('--dsw-specific-guide-hero', mix(L.guide, hue, 0.12), mix(D.guide, hue, 0.14))
      put('--dsw-specific-login-input', mix(L.login, hue, 0.04), mix(D.login, hue, 0.05))
      put('--dsw-specific-sidebar-right-flash', ink, bright)
      put('--dsw-alias-card-fill', mix('#ffffff', hue, 0.02), mix(D.card, hue, 0.06))
      put('--dsw-alias-card-fill-hover', mix(L.cardHover, hue, 0.06), mix(D.cardHover, hue, 0.08))
      put('--dsw-alias-card-tile-fill', alpha(mix('#ffffff', hue, 0.06), 0.55), alpha(mix('#ffffff', hue, 0.06), 0.05))
      put('--dsw-alias-button-elevated-fill', mix('#ffffff', hue, 0.02), mix('#2a2330', hue, 0.07))
      put('--dsw-alias-button-floating-fill', mix('#ffffff', hue, 0.02), mix('#241e29', hue, 0.07))
      put('--dsw-alias-button-floating-hover', mix('#f7f0f8', hue, 0.06), mix('#2e2634', hue, 0.08))
      put('--dsw-alias-menu-icon', mix('#5a4a60', hue, 0.15), mix('#e4dce8', hue, 0.12))
      put('--dsw-alias-illustration-background', mix(L.illustrationBg, hue, 0.1), mix(D.illustrationBg, hue, 0.12))
      put('--dsw-alias-illustration-surface', mix(L.illustrationSurface, hue, 0.18), mix(D.illustrationSurface, hue, 0.2))
      put('--dsw-alias-illustration-backing', mix(L.illustrationBacking, hue, 0.24), mix(D.illustrationBacking, hue, 0.24))
      put('--dsw-alias-illustration-detail', mix(L.illustrationDetail, hue, 0.3), mix(D.illustrationDetail, hue, 0.24))
      put('--dsw-alias-illustration-inset',
        'var(--dsw-alias-illustration-surface)', 'var(--dsw-alias-illustration-backing)')
      put('--dsw-alias-illustration-shadow',
        'var(--dsw-alias-illustration-surface)', 'var(--dsw-alias-illustration-backing)')

      // ---- glass ------------------------------------------------------------
      put('--dsw-menu-surface-fill', alpha(mix(L.menu, hue, 0.05), 0.76), alpha(mix(D.menu, hue, 0.06), 0.66))
      put('--dsw-alias-menu-group-header-fill', alpha(mix(L.menuHeader, hue, 0.05), 0.94), alpha(mix(D.menuHeader, hue, 0.06), 0.94))

      // ---- borders and focus ------------------------------------------------
      const lightBorder = mix(L.borderSeed, hue, 0.2)
      const darkBorder = mix(D.borderSeed, hue, 0.12)
      put('--dsw-alias-border-l1', alpha(lightBorder, 0.06), alpha(darkBorder, 0.07))
      put('--dsw-alias-border-l2', alpha(lightBorder, 0.1), alpha(darkBorder, 0.12))
      put('--dsw-alias-border-l2-darkmode-thin', alpha(lightBorder, 0.1), alpha(darkBorder, 0.07))
      put('--dsw-alias-border-l3', alpha(lightBorder, 0.14), alpha(darkBorder, 0.16))
      put('--dsw-alias-border-l4', alpha(lightBorder, 0.18), alpha(darkBorder, 0.2))
      put('--dsw-alias-border-selected', ink, bright)
      put('--dsw-focus-ring-color', ink, bright)

      // ---- brand and buttons ------------------------------------------------
      put('--dsw-alias-brand-primary', ink, bright)
      put('--dsw-alias-brand-text', ink, mix(bright, '#ffffff', 0.18))
      put('--dsw-alias-brand-primary-new-colorprimary-new-color', ink, bright)
      put('--dsw-alias-button-primary-fill', ink, bright)
      put('--dsw-alias-button-primary-hover', hoverInk, hoverBright)
      put('--dsw-alias-button-primary-dimmed', mix(L.dimmedButton, hue, 0.35), mix(D.dimmedButton, hue, 0.3))
      put('--dsw-alias-button-info-fill', ink, bright)
      put('--dsw-alias-button-info-hover', hoverInk, hoverBright)
      put('--dsw-alias-link', ink, bright)

      // ---- thinking and interactive fills ----------------------------------
      put('--dsw-alias-label-deep-diving', ink, bright)
      put('--dsw-alias-label-deep-diving-shimmer', mix(ink, '#ffffff', 0.45), mix(bright, '#ffffff', 0.35))
      put('--dsw-alias-interactive-bg-hover',
        alpha(mix(L.hoverSeed, hue, 0.25), 0.06), alpha(mix(D.hoverSeed, hue, 0.15), 0.07))
      put('--dsw-alias-interactive-bg-hover-solid', mix(L.layer3, hue, 0.08), mix(D.layer3, hue, 0.1))
      put('--dsw-alias-interactive-bg-active',
        alpha(mix(L.hoverSeed, hue, 0.25), 0.12), alpha(mix(D.hoverSeed, hue, 0.15), 0.13))
      put('--dsw-alias-interactive-bg-hover-accent',
        alpha(mix(L.hoverSeed, hue, 0.25), 0.15), alpha(mix(D.hoverSeed, hue, 0.15), 0.18))

      // ---- markdown and code chrome ----------------------------------------
      put('--dsw-alias-markdown-code-block', mix(L.code, hue, 0.06), mix(D.code, hue, 0.08))
      put('--dsw-alias-markdown-code-block-banner', mix(L.codeBanner, hue, 0.07), mix(D.codeBanner, hue, 0.08))
      put('--dsw-alias-markdown-code-segment-selected', mix('#ffffff', hue, 0.03), mix(D.layer2, hue, 0.06))
      put('--dsw-alias-markdown-code-segment-unselected', mix(L.codeUnsel, hue, 0.07), mix(D.codeUnsel, hue, 0.08))
      put('--dsw-alias-markdown-inline-code', mix(L.inline, hue, 0.07), mix(D.inline, hue, 0.08))
      put('--dsw-alias-markdown-tag', mix(L.tag, hue, 0.08), mix(D.tag, hue, 0.08))
      put('--dsw-alias-markdown-citation', mix(L.citation, hue, 0.08), mix(D.citation, hue, 0.08))
      put('--dsw-alias-markdown-placeholder', mix(L.placeholder, hue, 0.05), mix(D.placeholder, hue, 0.06))
      const triggerLight = mix(L.code, hue, 0.06)
      const triggerDark = mix(D.code, hue, 0.08)
      put('--dsw-alias-turn-trigger-bg', triggerLight, triggerDark)
      put('--dsw-alias-turn-trigger-bg-hover',
        alpha(mix(L.hoverSeed, hue, 0.25), 0.06), alpha(mix(D.hoverSeed, hue, 0.15), 0.07))

      // ---- charts, scrollbars, floating surfaces ---------------------------
      put('--dsw-alias-chart-messages', artLight, artDark)
      put('--dsw-alias-scrollbar-bg-l1', mix(L.scroll1, hue, 0.15), mix(D.scroll1, hue, 0.14))
      put('--dsw-alias-scrollbar-bg-l2', mix(L.scroll2, hue, 0.18), mix(D.scroll2, hue, 0.16))
      put('--dsw-alias-scrollbar-hover-l1', mix(L.scrollHover1, hue, 0.18), mix(D.scrollHover1, hue, 0.16))
      put('--dsw-alias-scrollbar-hover-l2', mix(L.scrollHover2, hue, 0.2), mix(D.scrollHover2, hue, 0.18))
      put('--dsw-alias-toast-bg', '#3b2b42', '#2a2231')
      put('--dsw-alias-tooltip-bg', '#3b2b42', '#2a2231')
      put('--dsw-alias-tooltip-key-bg', mix('#3b2b42', '#ffffff', 0.18), mix('#2a2231', '#ffffff', 0.18))
      put('--dsw-alias-hovercard-bg', '#3b2b42', '#2a2231')

      // ---- artwork ---------------------------------------------------------
      put('--mewtype-ink-strong', artLight, artDark)
      put('--mewtype-ink-accent', accentLight, accentDark)
      put('--mewtype-halo-color', artLight, artDark)
      put('--mewtype-star-0', artLight, artDark)
      put('--mewtype-star-1', accentLight, accentDark)
      put('--mewtype-star-2', thirdLight, thirdDark)
      put('--mewtype-aurora-a', alpha(mix(cast.color, '#151018', glowDepth), glowAlpha), alpha(cast.color, 0.46))
      put('--mewtype-aurora-b', alpha(mix(cast.accent, '#151018', glowAccentDepth), glowAccentAlpha), alpha(cast.accent, 0.32))
      put('--mewtype-aurora-c', alpha(mix(cast.third, '#151018', glowThirdDepth), glowThirdAlpha), alpha(cast.third, 0.22))
      put('--mewtype-ink-soft',
        readable(mix(artLight, '#ffffff', 0.35), lightBase, 3, '#151018'),
        readable(mix(artDark, '#ffffff', 0.2), darkBase, 3, '#ffffff'))
      put('--mewtype-aurora-opacity', cast.auroraLight, cast.auroraDark)
      put('--mewtype-stars-opacity', cast.starsLight, cast.starsDark)
      put('--mewtype-aurora-scale', cast.scale, cast.scale)
      put('--mewtype-aurora-duration', cast.auroraDuration, cast.auroraDuration)
      put('--mewtype-twinkle-duration', cast.twinkleDuration, cast.twinkleDuration)

      return tokens
    }
    /* ==== CAST-PALETTE-END ==== */

    /* ==== CAST-ART-START ==== */
    /**
     * Character artwork is not bundled: this repository ships no third-party
     * illustrations. Run `node scripts/embed-art.mjs` after placing your own
     * WebP files in `art/`, or leave this empty and the avatar falls back to the
     * MewType loop.
     */
    const CAST_ART = {}
    /* ==== CAST-ART-END ==== */

    /** Character chosen when nothing valid is stored. */
    const DEFAULT_CAST = 'yuno'

    /** Client-side dictionaries for the settings row. */
    const DICTIONARIES = {
      en: {
        'title': 'Character theme',
        'group': 'MewType character theme',
        'name.yuno': 'Yuno',
        'name.arale': 'Arale',
        'name.nonoka': 'Nonoka',
        'name.ritsu': 'Ritsu',
        'name.miyako': 'Miyako',
        'mood.yuno': 'The low-energy cool DJ: acts like everything is a hassle, yet is more sincere about music than anyone.',
        'mood.arale': 'The upbeat vocalist: delighted by praise, shy, and fiercely passionate about what she loves.',
        'mood.nonoka': 'The easygoing mood maker: runs on white rice and board games, and puts everyone at ease.',
        'mood.ritsu': 'The earnest honor student: calm and dependable, with a taste for birdwatching and radio calisthenics.',
        'mood.miyako': 'The quiet manga artist: holds her puppet Maru-kun and supports the band with a pen.',
        'quick.label': 'Theme',
        'quick.switch': 'Switch character theme',
        'placeholder.yuno': 'Say something to Yuno…',
        'placeholder.arale': 'Tell Arale about your day…',
        'placeholder.nonoka': 'Chat with Nonoka about anything…',
        'placeholder.ritsu': 'Hand your idea to Ritsu…',
        'placeholder.miyako': 'Tell Miyako what you picture…',
        'suggest.group': 'Suggested openers',
        'suggest.yuno.0': 'Pick a song for a late night',
        'suggest.yuno.1': 'Sum this up in one line — no fluff',
        'suggest.yuno.2': 'Help me untangle this thought',
        'suggest.arale.0': 'Recommend an anime I can finish today',
        'suggest.arale.1': 'Cheer me up like a hype vocalist',
        'suggest.arale.2': 'Write a short cheer for me',
        'suggest.nonoka.0': 'Keep me company for a while',
        'suggest.nonoka.1': 'Suggest a cozy game for tonight',
        'suggest.nonoka.2': 'Make me a low-effort plan',
        'suggest.ritsu.0': 'Turn my week into a solid plan',
        'suggest.ritsu.1': 'Explain this concept clearly',
        'suggest.ritsu.2': 'Suggest a starter outdoor hobby',
        'suggest.miyako.0': 'Give me a manga storyboard idea',
        'suggest.miyako.1': 'Say something gentle and quiet',
        'suggest.miyako.2': 'Make this paragraph more vivid',
        'fx.title': 'Background effects',
        'fx.note': 'Drag the sliders to tune the ambient background; the values stay in this browser.',
        'fx.aurora': 'Aurora',
        'fx.stars': 'Starlight',
        'fx.density': 'Starlight density',
        'fx.portrait': 'Portrait',
        'fx.size': 'Portrait size',
        'fx.reset': 'Reset',
      },
      zh: {
        'title': '角色主题',
        'group': '梦限大角色主题',
        'name.yuno': '由乃',
        'name.arale': '阿拉蕾',
        'name.nonoka': '野乃花',
        'name.ritsu': '律',
        'name.miyako': '都子',
        'mood.yuno': '懒洋洋的酷系 DJ：嘴上嫌麻烦，其实比谁都认真做音乐。',
        'mood.arale': '元气主唱：一被夸就开心，怕生却对喜欢的东西无比热情。',
        'mood.nonoka': '随性的气氛担当：白米饭和桌游就是能量来源，走到哪都让人放松。',
        'mood.ritsu': '认真的优等生：冷静可靠，观鸟、登山和广播体操都是她的爱好。',
        'mood.miyako': '安静的内向漫画家：抱着玩偶「丸君」，用画笔悄悄撑住乐队。',
        'quick.label': '配色',
        'quick.switch': '切换角色配色',
        'placeholder.yuno': '要和由乃聊点什么吗…',
        'placeholder.arale': '跟阿拉蕾说说今天的事…',
        'placeholder.nonoka': '和野乃花随便聊聊吧…',
        'placeholder.ritsu': '把想法交给律来整理…',
        'placeholder.miyako': '把脑海里的画面讲给都子听…',
        'suggest.group': '推荐开场',
        'suggest.yuno.0': '帮我挑一首深夜听的歌',
        'suggest.yuno.1': '用一句话总结，别啰嗦',
        'suggest.yuno.2': '陪我把这个想法理清楚',
        'suggest.arale.0': '推荐一部今天就能追完的动画',
        'suggest.arale.1': '用主唱的方式给我打打气',
        'suggest.arale.2': '帮我写一句应援口号',
        'suggest.nonoka.0': '陪我随便聊一会儿',
        'suggest.nonoka.1': '推荐今晚就能玩的小游戏',
        'suggest.nonoka.2': '帮我定一个不用太努力的计划',
        'suggest.ritsu.0': '把这周排成一份靠谱的计划',
        'suggest.ritsu.1': '有条理地解释一个概念',
        'suggest.ritsu.2': '推荐一个适合入门的户外爱好',
        'suggest.miyako.0': '给我一个漫画分镜的点子',
        'suggest.miyako.1': '安静地给我一句温柔的鼓励',
        'suggest.miyako.2': '把这段文字改得更有画面感',
        'fx.title': '背景效果',
        'fx.note': '拖动滑块调整背景氛围；数值保存在本浏览器。',
        'fx.aurora': '极光',
        'fx.stars': '星屑',
        'fx.density': '星屑密度',
        'fx.portrait': '立绘',
        'fx.size': '立绘大小',
        'fx.reset': '重置',
      },
      ja: {
        'title': 'キャラクターテーマ',
        'group': '夢限大キャラクターテーマ',
        'name.yuno': 'ユノ',
        'name.arale': 'あられ',
        'name.nonoka': 'ののか',
        'name.ritsu': '律',
        'name.miyako': '都子',
        'mood.yuno': '省エネでクールな DJ。面倒くさがりだけど、音楽には誰よりも真剣。',
        'mood.arale': '元気なボーカル。褒められると嬉しくて、人見知りだけど好きなものには一直線。',
        'mood.nonoka': 'のんびりムードメーカー。白ごはんとボードゲームがエネルギー源で、いるだけで場がゆるむ。',
        'mood.ritsu': '真面目な優等生。冷静で頼れる、探鳥や登山、ラジオ体操が好き。',
        'mood.miyako': 'おとなしい現役マンガ家。ぬいぐるみの丸くんを抱えて、静かにバンドを支える。',
        'quick.label': '配色',
        'quick.switch': 'キャラクターテーマを切り替え',
        'placeholder.yuno': 'ユノに何か話してみる？',
        'placeholder.arale': 'あられに今日のこと話してみる？',
        'placeholder.nonoka': 'ののかとゆるっと話そう…',
        'placeholder.ritsu': '律に考えをまとめてもらおう…',
        'placeholder.miyako': '都子に浮かんだ景色を話してみる？',
        'suggest.group': 'おすすめの切り出し',
        'suggest.yuno.0': '深夜に聴く曲を選んで',
        'suggest.yuno.1': 'ひと言でまとめて。前置きなしで',
        'suggest.yuno.2': 'この考えを整理するのを手伝って',
        'suggest.arale.0': '今日中に見終わるアニメを教えて',
        'suggest.arale.1': 'ボーカルみたいに元気づけて',
        'suggest.arale.2': '応援コールを考えて',
        'suggest.nonoka.0': 'しばらく一緒に話してて',
        'suggest.nonoka.1': '今夜遊べるゆるいゲームは？',
        'suggest.nonoka.2': 'がんばりすぎない計画を立てて',
        'suggest.ritsu.0': 'この一週間をきちんと計画して',
        'suggest.ritsu.1': 'わかりやすく順序立てて説明して',
        'suggest.ritsu.2': '初心者向けのアウトドア趣味は？',
        'suggest.miyako.0': 'マンガのコマ割りのアイデアをちょうだい',
        'suggest.miyako.1': '静かにやさしく励まして',
        'suggest.miyako.2': 'この文章を情景豊かにして',
        'fx.title': '背景エフェクト',
        'fx.note': 'スライダーで背景の雰囲気を調整できます。値はこのブラウザに保存されます。',
        'fx.aurora': 'オーロラ',
        'fx.stars': '星屑',
        'fx.density': '星屑の密度',
        'fx.portrait': '立ち絵',
        'fx.size': '立ち絵サイズ',
        'fx.reset': 'リセット',
      },
    }

    /** Four-point sparkle path centered on (12, 12), used by every mark. */
    const SPARKLE_PATH = 'M12 1C12.9 6.2 17.8 11.1 23 12C17.8 12.9 12.9 17.8 12 23'
      + 'C11.1 17.8 6.2 12.9 1 12C6.2 11.1 11.1 6.2 12 1Z'

    /**
     * Home starlight. Coordinates live in the 1440 x 900 aurora viewBox, so the
     * field stretches with the column instead of pixel-matching one window.
     * Index 0 is x, 1 y, 2 radius, 3 ink slot, 4 sparkle scale (0 = dot).
     */
    const STARS = [
      [132, 208, 2.2, 0, 0],
      [268, 96, 1.6, 2, 0],
      [412, 168, 1.2, 1, 0],
      [96, 372, 1.8, 2, 0],
      [226, 468, 1.3, 0, 0],
      [344, 300, 0, 1, 0.42],
      [520, 118, 1.5, 0, 0],
      [604, 246, 1.1, 2, 0],
      [700, 132, 1.9, 1, 0],
      [812, 288, 1.2, 0, 0],
      [930, 148, 1.6, 2, 0],
      [1046, 236, 1.1, 1, 0],
      [1152, 104, 0, 0, 0.5],
      [1268, 214, 1.7, 2, 0],
      [1372, 322, 1.2, 0, 0],
      [1408, 452, 1.8, 1, 0],
      [1300, 486, 1.1, 0, 0],
      [1120, 388, 1.4, 2, 0],
      [1042, 512, 0, 1, 0.36],
      [886, 424, 1.2, 0, 0],
      [742, 502, 1.5, 2, 0],
      [560, 402, 1.1, 1, 0],
      [420, 512, 1.4, 0, 0],
      [288, 604, 1.2, 2, 0],
      [158, 542, 1.7, 1, 0],
      [64, 660, 1.1, 0, 0],
      [1180, 648, 1.4, 2, 0],
      [1320, 604, 0, 1, 0.4],
      [182, 122, 1.3, 1, 0],
      [352, 64, 1.1, 2, 0],
      [498, 236, 1.6, 0, 0],
      [646, 92, 1.2, 2, 0],
      [806, 62, 1.4, 1, 0],
      [962, 88, 1.1, 0, 0],
      [1108, 168, 1.5, 2, 0],
      [1218, 296, 1.2, 0, 0],
      [1338, 154, 1.3, 1, 0],
      [1404, 236, 1.1, 2, 0],
      [46, 268, 1.2, 2, 0],
      [126, 434, 1.4, 1, 0],
      [238, 352, 1.1, 2, 0],
      [332, 570, 1.5, 0, 0],
      [668, 386, 0, 2, 0.32],
      [944, 320, 1.2, 1, 0],
      [1264, 420, 0, 0, 0.3],
    ]

    /** Curated stars; density above 100% appends deterministic extras. */
    const BASE_STARS = STARS.length
    const STAR_POOL = (() => {
      const pool = STARS.slice()
      let seed = 0x9e3779b9
      const next = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return seed / 0x100000000
      }
      while (pool.length < BASE_STARS * 2) {
        const sparkle = pool.length % 11 === 0
        pool.push([
          Math.round(20 + next() * 1400),
          Math.round(110 + next() * 730),
          sparkle ? 0 : 0.8 + next() * 1.4,
          pool.length % 3,
          sparkle ? 0.22 + next() * 0.24 : 0,
        ])
      }
      return pool
    })()


    /**
     * Find a cast entry by id.
     * @param id - candidate id.
     * @returns the entry, or the default one when unknown.
     */
    function castById(id) {
      return CAST.find((entry) => entry.id === id) || CAST[0]
    }

    /**
     * Read the stored character id, tolerating blocked storage.
     * @returns a valid cast id.
     */
    function readStoredCast() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return CAST.some((entry) => entry.id === stored) ? stored : DEFAULT_CAST
      } catch (error) {
        return DEFAULT_CAST
      }
    }

    /**
     * Persist the chosen character, tolerating blocked storage.
     * @param id - cast id to store.
     */
    function writeStoredCast(id) {
      try {
        window.localStorage.setItem(STORAGE_KEY, id)
      } catch (error) {
        // A blocked storage keeps the choice for this page only.
      }
    }

    /**
     * Tiny external store so the settings row and the palette effect observe the
     * same selection.
     * @returns the current id, a writer, and the subscription pair.
     */
    function createCastStore() {
      let current = readStoredCast()
      const listeners = new Set()
      return {
        getSnapshot: () => current,
        set(id) {
          const next = castById(id).id
          if (next === current) return
          current = next
          writeStoredCast(next)
          for (const listener of [...listeners]) listener()
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => { listeners.delete(listener) }
        },
      }
    }

    /** Effect-intensity knobs, persisted per browser. */
    const FX_STORAGE_KEY = 'dsh.mewtype-dream.fx'
    const FX_DEFAULTS = { aurora: 1, stars: 1, density: 1, portrait: 1, size: 1 }
    /** Discrete stops per knob: strong/weak levels, never a stepless value. */
    const FX_SPECS = {
      aurora: { min: 0, max: 2, step: 0.25 },
      stars: { min: 0, max: 2, step: 0.25 },
      density: { min: 0.25, max: 2, step: 0.25 },
      portrait: { min: 0, max: 2, step: 0.25 },
      size: { min: 0.6, max: 1.6, step: 0.2 },
    }

    /**
     * Snap a value onto one knob's discrete stops.
     * @param key - knob name.
     * @param value - candidate value.
     * @returns one legal stop.
     */
    function snapFx(key, value) {
      const spec = FX_SPECS[key]
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return FX_DEFAULTS[key]
      const clamped = Math.min(spec.max, Math.max(spec.min, numeric))
      return Math.round((clamped - spec.min) / spec.step) * spec.step + spec.min
    }

    /**
     * Read the stored effect intensities, clamping unknown or broken values.
     * @returns the effect values.
     */
    function readStoredFx() {
      const result = { ...FX_DEFAULTS }
      try {
        const raw = window.localStorage.getItem(FX_STORAGE_KEY)
        const parsed = raw === null ? {} : JSON.parse(raw)
        for (const key of Object.keys(FX_DEFAULTS)) {
          if (Number.isFinite(Number(parsed[key]))) result[key] = snapFx(key, parsed[key])
        }
      } catch (error) {
        return { ...FX_DEFAULTS }
      }
      return result
    }

    /**
     * Persist the effect intensities, tolerating blocked storage.
     * @param fx - current values.
     */
    function writeStoredFx(fx) {
      try {
        window.localStorage.setItem(FX_STORAGE_KEY, JSON.stringify(fx))
      } catch (error) {
        // A blocked storage keeps the values for this page only.
      }
    }

    /**
     * External store for the effect sliders.
     * @returns the values, a patch writer, and the subscription pair.
     */
    function createFxStore() {
      let current = readStoredFx()
      const listeners = new Set()
      return {
        getSnapshot: () => current,
        set(patch) {
          const next = { ...current }
          for (const [key, value] of Object.entries(patch)) {
            if (!(key in FX_DEFAULTS)) continue
            next[key] = snapFx(key, value)
          }
          current = next
          writeStoredFx(next)
          for (const listener of [...listeners]) listener()
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => { listeners.delete(listener) }
        },
      }
    }

    const CSS = `
/* The effect knobs are registered numbers so a stop change eases instead of
   snapping: the aura, starlight, portrait opacity, and portrait width all read
   these values through calc(). */
@property --mewtype-fx-aurora {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

@property --mewtype-fx-stars {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

@property --mewtype-fx-portrait {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

@property --mewtype-fx-size {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

body {
  transition:
    --mewtype-fx-aurora 460ms cubic-bezier(0.22, 1, 0.36, 1),
    --mewtype-fx-stars 460ms cubic-bezier(0.22, 1, 0.36, 1),
    --mewtype-fx-portrait 460ms cubic-bezier(0.22, 1, 0.36, 1),
    --mewtype-fx-size 460ms cubic-bezier(0.22, 1, 0.36, 1);
}

body {
  --mewtype-portrait-opacity: 0.16;
}

body[data-ds-dark-theme] {
  --mewtype-portrait-opacity: 0.24;
}

/* The conversation body owns a stacking context so the negative-z-index
   decoration stays above the column background and below every message in
   every phase, not only on the blank home. */
[data-conversation-content] {
  isolation: isolate;
}

/* ---- settings row -------------------------------------------------------- */
/* Same rhythm as the shipped preference rows: hairline-separated group, 14/22
   title, then a wrapping control row. */
.mewtype-cast {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
}

.mewtype-cast__title {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
}

.mewtype-cast__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.mewtype-cast__chip {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.mewtype-cast__chip--on {
  background: var(--dsw-alias-bg-module-platform);
  border-color: var(--dsw-alias-border-selected);
}

@media (hover: hover) {
  .mewtype-cast__chip:hover:not(.mewtype-cast__chip--on) {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}

/* The swatch is the only preview of the palette that is about to be applied, so
   it keeps a ring in a text token: a pale member color on a light panel would
   otherwise have almost no edge. */
.mewtype-cast__dot {
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  corner-shape: round;
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.16),
    0 0 0 1px var(--dsw-alias-label-tertiary);
}

.mewtype-cast__mood {
  min-height: 36px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}

/* ---- sidebar-foot quick switch ------------------------------------------- */
/* The shipped footer action owns the row at full width; entries may shrink so
   the color key fits beside it, right above the account row. Only the shrink
   capability is overridden, so the shipped action keeps its own sizing. */
[data-slot='sidebar.footer.action'] > :not(.mewtype-quick) {
  flex-shrink: 1;
  min-width: 0;
}

[data-slot='sidebar.footer.action'] > .mewtype-quick {
  flex: 0 0 auto;
}

.mewtype-quick {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  margin-inline-start: 8px;
  padding: 0 10px;
  border: none;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

@media (hover: hover) {
  .mewtype-quick:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

.mewtype-quick__swatch {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  corner-shape: round;
  /* A text-token outline keeps the wheel readable on a light sidebar, where the
     pale member colors (yellow, pastel pink) would otherwise have no edge. */
  box-shadow: 0 0 0 1px var(--dsw-alias-label-tertiary);
}

/* Five character colors as a ring, the active one as the center dot. */
.mewtype-quick__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  corner-shape: round;
  background: conic-gradient(
    from -90deg,
    #ee5577 0 20%,
    #ffee55 20% 40%,
    #ffbbcc 40% 60%,
    #4477cc 60% 80%,
    #9977cc 80% 100%
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4.5px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4.5px));
}

.mewtype-quick__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  corner-shape: round;
  /* The active chrome ink, so the dot stays legible in both palettes. */
  background: var(--dsw-alias-brand-primary);
}

/* ---- home frame layer ---------------------------------------------------- */
/* The Conversation root isolates stacking on the home only, so a negative
   z-index lands above its background and below all of its content. */
.mewtype-dream-layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}

/* Sized by height, not by width: a width-derived box collapses on a narrow
   column and would sit entirely below the clip. */
.mewtype-dream-aurora {
  position: absolute;
  left: 50%;
  bottom: -8%;
  width: min(1480px, 140%);
  height: clamp(220px, 34vh, 460px);
  transform: translateX(-50%);
  background:
    radial-gradient(ellipse 58% 70% at 50% 100%, var(--mewtype-aurora-a, rgba(242, 92, 155, 0.34)) 0%, var(--mewtype-aurora-b, rgba(237, 134, 161, 0.18)) 42%, transparent 74%),
    radial-gradient(ellipse 44% 60% at 22% 96%, var(--mewtype-aurora-c, rgba(124, 155, 255, 0.24)) 0%, transparent 72%),
    radial-gradient(ellipse 36% 54% at 82% 94%, var(--mewtype-aurora-b, rgba(255, 217, 102, 0.14)) 0%, transparent 72%);
  opacity: calc(var(--mewtype-aurora-opacity, 0.62) * var(--mewtype-fx-aurora, 1));
  animation: mewtype-dream-breathe var(--mewtype-aurora-duration, 9s) ease-in-out infinite;
}

.mewtype-dream-stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: calc(var(--mewtype-stars-opacity, 0.5) * var(--mewtype-fx-stars, 1));
}

.mewtype-dream-star {
  animation: mewtype-dream-twinkle var(--mewtype-twinkle-duration, 6.4s) ease-in-out infinite;
}

.mewtype-dream-star--0 {
  fill: var(--mewtype-star-0, #f25c9b);
}

.mewtype-dream-star--1 {
  fill: var(--mewtype-star-1, #ffd966);
}

.mewtype-dream-star--2 {
  fill: var(--mewtype-star-2, #9db4ff);
}

.mewtype-dream-star:nth-child(3n + 1) {
  animation-delay: -1.7s;
}

.mewtype-dream-star:nth-child(3n + 2) {
  animation-delay: -3.4s;
}

.mewtype-dream-star:nth-child(3n) {
  animation-delay: -5.1s;
}

/* ---- plugin-page effect sliders ------------------------------------------ */
.mewtype-fx {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0 8px;
}

.mewtype-fx__title {
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
}

.mewtype-fx__note {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}

.mewtype-fx__row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 52px;
  align-items: center;
  gap: 12px;
}

.mewtype-fx__label {
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
}

.mewtype-fx__slider {
  width: 100%;
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary);
}

.mewtype-fx__value {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.mewtype-fx__reset {
  align-self: flex-start;
  height: 30px;
  padding: 0 12px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

@media (hover: hover) {
  .mewtype-fx__reset:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

/* ---- sidebar-foot effects dock ------------------------------------------- */
[data-slot='sidebar.footer.action'] > .mewtype-fx-trigger {
  flex: 0 0 auto;
}

.mewtype-fx-trigger {
  align-self: center;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-inline-start: 4px;
  padding: 0;
  border: none;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.mewtype-fx-trigger[aria-expanded='true'] {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

@media (hover: hover) {
  .mewtype-fx-trigger:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

.mewtype-fx-trigger__glyph {
  display: block;
  width: 16px;
  height: 16px;
}

/* Anchored by measured trigger geometry so the sidebar's overflow cannot clip
   it; the surface reuses the host menu material. */
.mewtype-fx-pop {
  position: fixed;
  z-index: 60;
  box-sizing: border-box;
  width: 300px;
  max-width: calc(100vw - 16px);
  padding: 14px 16px 12px;
  border-radius: var(--dsw-radius-xl);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-overlay));
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.18));
  -webkit-backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
  backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
}

/* ---- cast avatar --------------------------------------------------------- */
.mewtype-avatar {
  position: relative;
  display: block;
  flex: none;
  border-radius: 50%;
  corner-shape: round;
  box-shadow:
    0 0 0 1.5px var(--dsw-alias-brand-primary),
    0 0 14px color-mix(in srgb, var(--dsw-alias-brand-primary) 38%, transparent);
}

.mewtype-avatar__image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  corner-shape: round;
  object-fit: cover;
}

/* No artwork embedded (the publishable build): a branded ring and loop. */
.mewtype-avatar__fallback {
  display: block;
  width: 100%;
  height: 100%;
  color: var(--dsw-alias-brand-primary);
}

.mewtype-avatar__badge {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 13px;
  height: 13px;
  color: var(--dsw-alias-brand-primary);
}

/* ---- cast portrait ------------------------------------------------------- */
/* Anchored to the right of the column and standing on its bottom edge, sized
   against the column so a narrower transcript or an open right panel shrinks it
   with the content. */
.mewtype-dream-portrait {
  position: absolute;
  right: clamp(0px, 1.5%, 28px);
  bottom: -6%;
  width: calc(min(64%, 680px) * var(--mewtype-fx-size, 1));
  height: auto;
  max-height: 92%;
  object-fit: contain;
  object-position: right bottom;
  opacity: calc(var(--mewtype-portrait-opacity, 0.16) * var(--mewtype-fx-portrait, 1));
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 26px 60px rgba(0, 0, 0, 0.18));
  animation: mewtype-portrait-in 520ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

@media (max-width: 767px) {
  .mewtype-dream-portrait {
    right: 0;
    width: min(74vw, 360px);
    max-height: 60%;
    bottom: -4%;
    opacity: calc(var(--mewtype-portrait-opacity, 0.16) * var(--mewtype-fx-portrait, 1) * 0.8);
  }
}

@keyframes mewtype-portrait-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(1.02);
  }

  to {
    opacity: calc(var(--mewtype-portrait-opacity, 0.16) * var(--mewtype-fx-portrait, 1));
    transform: none;
  }
}

/* ---- cast openers -------------------------------------------------------- */
.mewtype-suggest {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: var(--dsh-composer-card-max-width, 760px);
  margin: 0 auto 10px;
  padding: 0 16px;
}

.mewtype-suggest__chip {
  box-sizing: border-box;
  max-width: 100%;
  height: 32px;
  padding: 0 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}

@media (hover: hover) {
  .mewtype-suggest__chip:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

/* ---- cast placeholder ---------------------------------------------------- */
/* The host hint text is replaced visually by the active member's line, carried
   in through the copy token. The editor itself marks the states that must keep
   the host guidance: the workspace picker carries aria-haspopup on the editor,
   and disabled, inert, or blocked composers carry aria-disabled there. */
[data-composer-card]:not(:has([data-placeholder][aria-haspopup='menu'])):not(:has([data-placeholder][aria-disabled])) [data-composer-placeholder] {
  font-size: 0;
}

[data-composer-card]:not(:has([data-placeholder][aria-haspopup='menu'])):not(:has([data-placeholder][aria-disabled])) [data-composer-placeholder]::before {
  content: var(--mewtype-placeholder, '');
  font-size: var(--dsh-content-font-size, 14px);
  letter-spacing: 0.01em;
}

@keyframes mewtype-dream-breathe {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: calc(var(--mewtype-aurora-opacity, 0.62) * 0.72 * var(--mewtype-fx-aurora, 1));
  }

  50% {
    transform: translateX(-50%) scale(var(--mewtype-aurora-scale, 1.035));
    opacity: calc(var(--mewtype-aurora-opacity, 0.62) * var(--mewtype-fx-aurora, 1));
  }
}

@keyframes mewtype-dream-twinkle {
  0%, 100% {
    opacity: 0.24;
  }

  50% {
    opacity: 0.92;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mewtype-dream-aurora {
    animation: none;
  }

  .mewtype-dream-star {
    animation: none;
    opacity: 0.6;
  }

  .mewtype-dream-portrait {
    animation: none;
  }

  body {
    transition: none;
  }
}
`

    /**
     * The cast avatar in the blank-home headline: the active member's portrait,
     * ringed in the theme accent, with a tiny infinity badge.
     * @param props.size - requested square edge in pixels.
     * @param props.className - host geometry class for the surrounding mark.
     * @returns the avatar element tree.
     */
    function CastAvatar(props) {
      const selected = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      const cast = castById(selected)
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 34
      const className = props.className === undefined
        ? 'mewtype-avatar'
        : 'mewtype-avatar ' + props.className
      const art = CAST_ART[cast.id]
      return h('span', {
        className,
        style: { width: size + 'px', height: size + 'px' },
        'aria-hidden': 'true',
      },
      art === undefined
        ? h('svg', {
          className: 'mewtype-avatar__fallback',
          viewBox: '0 0 34 34',
          fill: 'none',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('circle', { cx: 17, cy: 17, r: 16, fill: 'currentColor', fillOpacity: 0.22 }),
        h('path', {
          d: 'M17 17C13 9.6 5 8.6 5 17C5 25.4 13 24.4 17 17C21 9.6 29 8.6 29 17C29 25.4 21 24.4 17 17Z',
          stroke: 'currentColor',
          strokeWidth: 2.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }))
        : h('img', {
          key: cast.id,
          className: 'mewtype-avatar__image',
          src: art.avatar,
          alt: '',
          draggable: false,
        }),
      h('svg', {
        className: 'mewtype-avatar__badge',
        viewBox: '0 0 16 16',
        'aria-hidden': 'true',
        focusable: 'false',
      },
      h('circle', { cx: 8, cy: 8, r: 8, fill: 'currentColor' }),
      h('path', {
        d: 'M8 8C6.5 5.4 3.2 5 3.2 8C3.2 11 6.5 10.6 8 8C9.5 5.4 12.8 5 12.8 8C12.8 11 9.5 10.6 8 8Z',
        fill: 'none',
        stroke: 'var(--dsw-alias-label-primary-foreground)',
        strokeWidth: 1.4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      })))
    }


    /**
     * The home starlight field.
     * @returns the starfield element tree.
     */
    function StarField(props) {
      const fx = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      const density = Number(fx.density)
      const count = Math.max(0, Math.min(
        STAR_POOL.length,
        Math.round(BASE_STARS * (Number.isFinite(density) ? density : 1)),
      ))
      return h('svg', {
        className: 'mewtype-dream-stars',
        viewBox: '0 0 1440 900',
        preserveAspectRatio: 'xMidYMid slice',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      }, STAR_POOL.slice(0, count).map(function (star, index) {
        const key = 'mewtype-star-' + index
        const className = 'mewtype-dream-star mewtype-dream-star--' + star[3]
        if (star[4] > 0) {
          const scale = star[4]
          return h('path', {
            key,
            className,
            d: SPARKLE_PATH,
            transform: 'translate(' + (star[0] - 12 * scale) + ' ' + (star[1] - 12 * scale)
              + ') scale(' + scale + ')',
          })
        }
        return h('circle', {
          key,
          className,
          cx: star[0],
          cy: star[1],
          r: star[2],
        })
      }))
    }

    /**
     * The `conversation.hero.frame` layer: renders the aurora and starlight
     * behind the blank-session home and passes the wrapped scroll body through.
     * The layer is skipped outside the home, where the Conversation root no
     * longer isolates stacking for negative z-index art.
     * @param props.hero - whether the body shows the blank standalone home.
     * @param props.children - the wrapped Conversation scroll body.
     * @returns the layer element tree.
     */
    /**
     * Per-occurrence blank-home flag. The frame layer wraps the scroll body in
     * this provider, so each Conversation instance (main or embedded) reports
     * its own phase to the composer seats inside it.
     */
    const HeroContext = React.createContext(false)

    /**
     * The `conversation.hero.frame` layer: the active member's portrait, the
     * aurora, and the starlight behind the conversation in every phase, plus the
     * wrapped scroll body. The layer rides at negative z-index; the stylesheet
     * isolates the conversation body so that art stays behind the transcript.
     * @param props.hero - whether the body shows the blank standalone home.
     * @param props.store - character store.
     * @param props.fxStore - effect store (starlight density).
     * @param props.children - the wrapped Conversation scroll body.
     * @returns the layer element tree.
     */
    function HomeFrameLayer(props) {
      const selected = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      const hero = props.hero === true
      const cast = castById(selected)
      const portrait = CAST_ART[cast.id] === undefined ? undefined : CAST_ART[cast.id].portrait
      const layer = h('div', { className: 'mewtype-dream-layer', 'aria-hidden': 'true' },
        h('div', { className: 'mewtype-dream-aurora' }),
        portrait === undefined ? null : h('img', {
          key: cast.id,
          className: 'mewtype-dream-portrait',
          src: portrait,
          alt: '',
          draggable: false,
        }),
        h(StarField, { store: props.fxStore }))
      // The decoration is persistent: the stylesheet isolates the conversation
      // body, so negative z-index art stays behind every message in every phase.
      if (!hero) return h(React.Fragment, null, layer, props.children)
      return h(React.Fragment, null,
        layer,
        h(HeroContext.Provider, { value: true }, props.children))
    }


    /**
     * One preference row for the character choice.
     * @param props.store - character store (snapshot, writer, subscription).
     * @param props.locale - client locale face (snapshot, subscription).
     * @param props.t - translate function bound to this plugin's namespace.
     * @returns the row element tree.
     */
    function CastRow(props) {
      const selected = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      // The locale snapshot is observed only so the row re-renders on a switch.
      React.useSyncExternalStore(props.locale.subscribe, props.locale.getSnapshot)
      const t = props.t
      return h('div', { className: 'mewtype-cast' },
        h('div', { className: 'mewtype-cast__title' }, t('title')),
        h('div', { className: 'mewtype-cast__row', role: 'group', 'aria-label': t('group') },
          CAST.map((cast) => h('button', {
            key: cast.id,
            type: 'button',
            className: 'mewtype-cast__chip'
              + (cast.id === selected ? ' mewtype-cast__chip--on' : ''),
            'aria-pressed': cast.id === selected,
            onClick: () => { props.store.set(cast.id) },
          },
          h('span', {
            className: 'mewtype-cast__dot',
            style: { background: cast.color },
            'aria-hidden': 'true',
          }),
          h('span', null, t('name.' + cast.id))))),
        h('div', { className: 'mewtype-cast__mood', 'aria-live': 'polite' }, t('mood.' + selected)))
    }

    /**
     * The one-click color key in the sidebar foot. It cycles the cast in order;
     * the ring shows all five character colors and the center dot the active one.
     * @param props.wide - whether the sidebar renders wide content.
     * @param props.store - character store (snapshot, writer, subscription).
     * @param props.locale - client locale face (snapshot, subscription).
     * @param props.t - translate function bound to this plugin's namespace.
     * @returns the button, or nothing in the 56px rail (one action fits there).
     */
    function QuickSwitch(props) {
      const selected = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      // The locale snapshot is observed only so the labels re-translate.
      React.useSyncExternalStore(props.locale.subscribe, props.locale.getSnapshot)
      if (props.wide !== true) return null
      const cast = castById(selected)
      const index = CAST.findIndex((entry) => entry.id === cast.id)
      const next = CAST[(index + 1) % CAST.length]
      const t = props.t
      const name = t('name.' + cast.id)
      const switchLabel = t('quick.switch')
      return h('button', {
        type: 'button',
        className: 'mewtype-quick',
        title: switchLabel + ' · ' + name + ' → ' + t('name.' + next.id),
        'aria-label': switchLabel + ' · ' + name,
        onClick: () => { props.store.set(next.id) },
      },
      h('span', {
        className: 'mewtype-quick__swatch',
        'aria-hidden': 'true',
      },
      h('span', { className: 'mewtype-quick__ring' }),
      h('span', { className: 'mewtype-quick__dot' })),
      h('span', { className: 'mewtype-quick__label' }, t('quick.label')))
    }

    /**
     * Character-flavored openers above the composer on a blank session.
     * @param props.store - character store.
     * @param props.locale - client locale face (snapshot, subscription).
     * @param props.t - translate function bound to this plugin's namespace.
     * @param props.input - point-in-time input state supplied by the owner.
     * @param props.inputActions - composer actions supplied by the slot framework.
     * @returns the openers row, or nothing outside the blank home.
     */
    function CastSuggestions(props) {
      const selected = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      const hero = React.useContext(HeroContext)
      React.useSyncExternalStore(props.locale.subscribe, props.locale.getSnapshot)
      const draft = props.input === undefined ? '' : (props.input.draft || '')
      if (!hero || draft !== '') return null
      const cast = castById(selected)
      const t = props.t
      return h('div', {
        className: 'mewtype-suggest',
        role: 'group',
        'aria-label': t('suggest.group'),
      }, [0, 1, 2].map((index) => h('button', {
        key: index,
        type: 'button',
        className: 'mewtype-suggest__chip',
        onClick: (event) => {
          const actions = props.inputActions
          if (actions === undefined) return
          actions.setDraft(t('suggest.' + cast.id + '.' + index))
          // `InputActions` has no focus entry; focus the editor of this
          // conversation so the caret lands in the prefilled draft.
          try {
            const scope = event.currentTarget.closest('[data-conversation-content]')
            const editor = scope === null ? null : scope.querySelector('[data-composer-card] [data-placeholder]')
            if (editor !== null && typeof editor.focus === 'function') editor.focus()
          } catch (error) {
            // Focus is best effort; the draft is already in place.
          }
        },
      }, t('suggest.' + cast.id + '.' + index))))
    }

    /**
     * Bundle-page controls for the background effect intensity.
     * @param props.view - the view the plugin page asks for.
     * @param props.store - effect store.
     * @param props.locale - client locale face (snapshot, subscription).
     * @param props.t - translate function bound to this plugin's namespace.
     * @returns the summary line or the slider form.
     */
    function EffectsPanel(props) {
      const fx = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot)
      React.useSyncExternalStore(props.locale.subscribe, props.locale.getSnapshot)
      const t = props.t
      const percent = (value) => Math.round(value * 100) + '%'
      if (props.view !== 'page') {
        return h('span', null,
          t('fx.aurora') + ' ' + percent(fx.aurora) + ' · '
          + t('fx.stars') + ' ' + percent(fx.stars) + ' · '
          + t('fx.density') + ' ' + percent(fx.density) + ' · '
          + t('fx.portrait') + ' ' + percent(fx.portrait) + ' · '
          + t('fx.size') + ' ' + percent(fx.size))
      }
      const rows = ['aurora', 'stars', 'density', 'portrait', 'size']
        .map((key) => [key, FX_SPECS[key]])
      return h('div', { className: 'mewtype-fx' },
        h('div', { className: 'mewtype-fx__title' }, t('fx.title')),
        h('div', { className: 'mewtype-fx__note' }, t('fx.note')),
        rows.map(([key, spec]) => h('label', { key, className: 'mewtype-fx__row' },
          h('span', { className: 'mewtype-fx__label' }, t('fx.' + key)),
          h('input', {
            className: 'mewtype-fx__slider',
            type: 'range',
            min: spec.min,
            max: spec.max,
            step: spec.step,
            value: fx[key],
            'aria-label': t('fx.' + key),
            onChange: (event) => {
              const value = Number(event.target.value)
              if (Number.isFinite(value)) props.store.set({ [key]: value })
            },
          }),
          h('span', { className: 'mewtype-fx__value' }, percent(fx[key])))),
        h('button', {
          type: 'button',
          className: 'mewtype-fx__reset',
          onClick: () => { props.store.set({ ...FX_DEFAULTS }) },
        }, t('fx.reset')))
    }

    /**
     * The background-effects assembly beside the footer color key: a compact
     * trigger that opens the portrait and ambient-effect sliders above itself.
     * @param props.wide - whether the sidebar renders wide content.
     * @param props.store - effect store.
     * @param props.locale - client locale face (snapshot, subscription).
     * @param props.t - translate function bound to this plugin's namespace.
     * @returns the trigger and, while open, the slider panel.
     */
    function EffectsDock(props) {
      React.useSyncExternalStore(props.locale.subscribe, props.locale.getSnapshot)
      const [open, setOpen] = React.useState(false)
      const triggerRef = React.useRef(null)
      const panelRef = React.useRef(null)
      const [anchor, setAnchor] = React.useState(undefined)
      // A collapsed rail cannot host the panel; forget the open state with it.
      React.useEffect(() => {
        if (props.wide !== true) setOpen(false)
      }, [props.wide])
      React.useLayoutEffect(() => {
        if (!open) return undefined
        const place = () => {
          const trigger = triggerRef.current
          if (trigger === null) return
          const rect = trigger.getBoundingClientRect()
          setAnchor({
            left: Math.max(8, Math.min(rect.left, window.innerWidth - 308)),
            bottom: Math.max(8, window.innerHeight - rect.top + 8),
          })
        }
        place()
        window.addEventListener('resize', place)
        return () => { window.removeEventListener('resize', place) }
      }, [open])
      React.useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (event) => {
          const target = event.target
          if (panelRef.current !== null && panelRef.current.contains(target)) return
          if (triggerRef.current !== null && triggerRef.current.contains(target)) return
          setOpen(false)
        }
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return
          setOpen(false)
          const trigger = triggerRef.current
          if (trigger !== null) trigger.focus()
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown)
        }
      }, [open])
      if (props.wide !== true) return null
      const t = props.t
      return h(React.Fragment, null,
        h('button', {
          ref: triggerRef,
          type: 'button',
          className: 'mewtype-fx-trigger',
          title: t('fx.title'),
          'aria-label': t('fx.title'),
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          onClick: () => { setOpen((value) => !value) },
        },
        h('svg', {
          className: 'mewtype-fx-trigger__glyph',
          viewBox: '0 0 16 16',
          fill: 'none',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11',
          stroke: 'currentColor',
          strokeWidth: 1.3,
          strokeLinecap: 'round',
        }),
        h('circle', { cx: 5.5, cy: 4.5, r: 1.9, fill: 'currentColor' }),
        h('circle', { cx: 10, cy: 8, r: 1.9, fill: 'currentColor' }),
        h('circle', { cx: 6.5, cy: 11.5, r: 1.9, fill: 'currentColor' }))),
        open && anchor !== undefined
          ? h('section', {
            ref: panelRef,
            className: 'mewtype-fx-pop',
            role: 'dialog',
            'aria-label': t('fx.title'),
            style: anchor,
          }, h(EffectsPanel, { view: 'page', store: props.store, locale: props.locale, t }))
          : null)
    }

    return {
      inject: ['slots', 'theme', 'locale'],
      apply(ctx) {
        const store = createCastStore()
        const fxStore = createFxStore()
        const t = ctx.locale.bind(LOCALE_NS)
        const localeFace = {
          getSnapshot: () => ctx.locale.getSnapshot(),
          subscribe: (listener) => ctx.locale.subscribe(listener),
        }

        ctx.effect(() => {
          const disposers = Object.entries(DICTIONARIES).map(
            ([locale, dict]) => ctx.locale.register(LOCALE_NS, locale, dict),
          )
          return () => { for (const dispose of disposers) dispose() }
        }, 'mewtype-dream: cast dictionaries')

        ctx.effect(() => {
          let disposeLayer
          let disposeCopy
          const applyCast = () => {
            const cast = castById(store.getSnapshot())
            const hint = JSON.stringify(t('placeholder.' + cast.id))
            disposeLayer = ctx.theme.overrideTokens(SKIN_ID, buildTokens(cast))
            disposeCopy = ctx.theme.overrideTokens(SKIN_ID + ':copy', {
              '--mewtype-placeholder': { light: hint, dark: hint },
            })
          }
          applyCast()
          const unsubscribeStore = store.subscribe(applyCast)
          const unsubscribeLocale = ctx.locale.subscribe(applyCast)
          return () => {
            unsubscribeStore()
            unsubscribeLocale()
            disposeLayer()
            disposeCopy()
          }
        }, 'mewtype-dream: cast palette')

        ctx.effect(() => {
          let disposeFx
          const applyFx = () => {
            const fx = fxStore.getSnapshot()
            const pair = (value) => ({ light: String(value), dark: String(value) })
            disposeFx = ctx.theme.overrideTokens(SKIN_ID + ':fx', {
              '--mewtype-fx-aurora': pair(fx.aurora.toFixed(2)),
              '--mewtype-fx-stars': pair(fx.stars.toFixed(2)),
              '--mewtype-fx-portrait': pair(fx.portrait.toFixed(2)),
              '--mewtype-fx-size': pair(fx.size.toFixed(2)),
            })
          }
          applyFx()
          const unsubscribe = fxStore.subscribe(applyFx)
          return () => {
            unsubscribe()
            disposeFx()
          }
        }, 'mewtype-dream: effect intensities')

        ctx.effect(() => {
          const style = document.createElement('style')
          style.id = STYLE_ID
          style.setAttribute('data-mewtype-dream', '')
          style.textContent = CSS
          document.head.append(style)
          return () => { style.remove() }
        }, 'mewtype-dream: stylesheet')

        ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
          name: 'conversation.hero.frame',
          id: 'mewtype-dream-backdrop',
          // Outermost layer, so the shipped whale decoration paints above the
          // aurora instead of being covered by it.
          order: -1,
        }, (owner) => h(HomeFrameLayer, { ...owner, store, fxStore })))
        ctx.slots.inject('conversation.hero.brand.mark', () => ctx.slots.register({
          name: 'conversation.hero.brand.mark',
        }, (owner) => h(CastAvatar, { ...owner, store })))
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock',
          id: 'mewtype-openers',
          order: 5,
        }, (owner) => h(CastSuggestions, { ...owner, store, locale: localeFace, t })))
        ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
          name: 'plugins.bundle.config',
          key: '@local/dsh-mewtype-dream',
        }, (owner) => h(EffectsPanel, { ...owner, store: fxStore, locale: localeFace, t })))
        ctx.slots.inject('settings.general.item', () => ctx.slots.register({
          name: 'settings.general.item',
          id: 'mewtype-cast',
          order: 13,
        }, () => h(CastRow, { store, locale: localeFace, t })))
        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'mewtype-quick-switch',
          order: 30,
        }, (owner) => h(QuickSwitch, { ...owner, store, locale: localeFace, t })))
        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'mewtype-fx-dock',
          order: 31,
        }, (owner) => h(EffectsDock, { ...owner, store: fxStore, locale: localeFace, t })))
      },
    }
  },
})
