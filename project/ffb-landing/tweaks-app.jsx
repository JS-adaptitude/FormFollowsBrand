// Tweaks island for Form Follows Brand landing.
// Owns body[data-hero] and body[data-accent]; persists via useTweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "a",
  "accent": "grad"
}/*EDITMODE-END*/;

function FFBTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply to <body> whenever tweaks change
  React.useEffect(() => {
    document.body.setAttribute('data-hero', t.hero);
    document.body.setAttribute('data-accent', t.accent);
    // ensure the newly-shown hero's reveal elements aren't stuck hidden
    requestAnimationFrame(() => {
      if (window.__revealVisibleHero) window.__revealVisibleHero();
    });
  }, [t.hero, t.accent]);

  return (
    <TweaksPanel>
      <TweakSection label="Hero direction" />
      <TweakRadio
        label="Layout"
        value={t.hero}
        options={[
          { value: 'a', label: 'Split' },
          { value: 'b', label: 'Manifesto' },
        ]}
        onChange={(v) => setTweak('hero', v)}
      />
      <TweakSection label="Accent treatment" />
      <TweakRadio
        label="Signal"
        value={t.accent}
        options={[
          { value: 'grad', label: 'Gradient' },
          { value: 'cerise', label: 'Cerise' },
          { value: 'brick', label: 'Brick' },
        ]}
        onChange={(v) => setTweak('accent', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<FFBTweaks />);
