'use client';
import { useState } from 'react';
import { cardColorPresets, colorPresets, type CardColorPreset, type ColorPreset } from '../lib/palettes';

const DEFAULT_COLORS: ColorPreset = colorPresets[0];

function isLight(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function applyCardColor(cardKey: 'modernize' | 'build' | 'ai', value: string) {
  const root = document.documentElement.style;
  const light = value.startsWith('#') ? isLight(value) : false;
  root.setProperty(`--prop-bg-${cardKey}`, value);
  root.setProperty(`--prop-border-${cardKey}`, light ? '1px solid var(--line)' : 'none');
  root.setProperty(`--prop-text-${cardKey}`, light ? 'var(--ink)' : '#fff');
  root.setProperty(`--prop-text-muted-${cardKey}`, light ? 'var(--muted)' : 'rgba(255,255,255,.82)');
  root.setProperty(`--prop-chip-bg-${cardKey}`, light ? '#edf3f5' : 'rgba(255,255,255,.16)');
  root.setProperty(`--prop-chip-text-${cardKey}`, light ? 'var(--ink)' : '#fff');
}

function applyCardPreset(preset: CardColorPreset) {
  applyCardColor('modernize', preset.modernize);
  applyCardColor('build', preset.build);
  applyCardColor('ai', preset.ai);
}

function applyColors(preset: ColorPreset) {
  const root = document.documentElement.style;
  root.setProperty('--blue', preset.blue);
  root.setProperty('--blue2', preset.blue2);
  root.setProperty('--ink', preset.ink);
  root.setProperty('--text', preset.text);
  root.setProperty('--muted', preset.muted);
  root.setProperty('--paper', preset.paper);
  // the site accent, tints and the main button follow the chosen colour
  root.setProperty('--ochre', preset.blue);
  root.setProperty('--cta', preset.cta ?? `color-mix(in srgb, ${preset.blue} 60%, #000)`);
  root.setProperty('--cta-hover', preset.ctaHover ?? `color-mix(in srgb, ${preset.blue} 48%, #000)`);
}

export default function PalettePicker({
  animated,
  onAnimatedChange,
}: {
  animated: boolean;
  onAnimatedChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<string>(DEFAULT_COLORS.title);
  const [activeCard, setActiveCard] = useState<string>(cardColorPresets[0].title);

  function reset() {
    document.documentElement.removeAttribute('style');
    setActiveColor(DEFAULT_COLORS.title);
    setActiveCard(cardColorPresets[0].title);
  }

  return (
    <div className="palette-picker">
      <button className="palette-picker-toggle" type="button" aria-label="Toggle color palette picker" onClick={() => setOpen((v) => !v)}>
        🎨
      </button>
      {open && (
        <div className="palette-picker-panel">
          <div className="palette-picker-head">
            <span>Color palette</span>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </div>

          <div className="palette-picker-row pp-anim-row">
            <span>Stack scroll animation</span>
            <label className="pp-switch">
              <input type="checkbox" checked={animated} onChange={(e) => onAnimatedChange(e.target.checked)} />
              <span className="pp-switch-track" />
            </label>
          </div>

          <div className="palette-picker-presets">
            {colorPresets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                className={['pp-preset', activeColor === preset.title ? 'active' : ''].filter(Boolean).join(' ')}
                title={preset.title}
                onClick={() => {
                  applyColors(preset);
                  setActiveColor(preset.title);
                }}
              >
                <i style={{ background: preset.blue }} />
                <i style={{ background: preset.blue2 }} />
              </button>
            ))}
          </div>

          <div className="pp-card-block">
            <span className="pp-card-label">Capability cards</span>
            <div className="pp-card-presets">
              {cardColorPresets.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  className={['pp-card-preset', activeCard === preset.title ? 'active' : ''].filter(Boolean).join(' ')}
                  title={preset.title}
                  onClick={() => {
                    applyCardPreset(preset);
                    setActiveCard(preset.title);
                  }}
                >
                  <i style={{ background: preset.modernize }} />
                  <i style={{ background: preset.build }} />
                  <i style={{ background: preset.ai }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
