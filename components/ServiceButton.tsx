"use client";

export function ServiceButton() {
  return (
    <button
      type="button"
      data-track="Service plan"
      className="btn btnRed btnFull"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("ctwp:service"));
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      Check service for my copier
    </button>
  );
}
