"use client";

import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export default function BeforeAfter({
  before,
  after,
  alt,
  labelBefore,
  labelAfter,
  hint,
  aspect = "aspect-[4/3]",
}) {
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(55);
  const simulated = before === after;

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  const onKeyDown = (e) => {
    let next = null;
    if (e.key === "ArrowRight") next = pos + 5;
    else if (e.key === "ArrowLeft") next = pos - 5;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next !== null) {
      e.preventDefault();
      setPos(Math.min(100, Math.max(0, next)));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={hint}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onKeyDown={onKeyDown}
      className={`relative ${aspect} w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl shadow-[var(--shadow-card)] ring-1 ring-brand-line`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover saturate-[1.04]"
      />
      <div className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`absolute inset-y-0 start-0 h-full object-cover ${simulated ? "grayscale brightness-[0.78] contrast-[1.12]" : ""}`}
          style={{ width: `${(100 / pos) * 100}%` }}
        />
      </div>

      <span className="absolute start-3 top-3 z-10 rounded-full bg-brand-ink/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        {labelBefore}
      </span>
      <span className="absolute end-3 top-3 z-10 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-brand-ink">
        {labelAfter}
      </span>

      <div className="absolute inset-y-0 z-10" style={{ insetInlineStart: `${pos}%` }}>
        <div className="h-full w-0.5 -translate-x-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.45)] rtl:translate-x-1/2" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white text-brand-ink shadow-[var(--shadow-lifted)] rtl:translate-x-1/2">
          <MoveHorizontal size={20} />
        </div>
      </div>

      <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[0.7rem] font-bold text-brand-ink shadow-[var(--shadow-soft)]">
        <MoveHorizontal size={13} /> {hint}
      </span>
    </div>
  );
}
