/**
 * Live SVG thumbnail that visually represents the Material List document.
 * Update this component when the document design changes — it auto-reflects on the package card.
 */
export default function MaterialListThumbnail() {
  const divs = [
    { label: "DIV 2", name: "Site Work", rows: ["Excavation", "Septic System", "Driveway"] },
    { label: "DIV 3", name: "Concrete", rows: ["Concrete Slab", "Perimeter Footing", "Rebar #4"] },
    { label: "DIV 6", name: "Wood Framing", rows: ["2×6 Studs 16\" OC", "LVL Beams", "Roof Trusses"] },
    { label: "DIV 7", name: "Thermal & Moisture", rows: ["Wall Insulation R-20", "Roofing Material", "House Wrap"] },
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-stone-200 bg-white shadow-sm select-none">
      {/* Document header */}
      <div className="bg-amber-600 px-3 py-2 flex items-center justify-between">
        <div>
          <div className="text-white font-black text-xs leading-tight">Material List + Spec Sheet</div>
          <div className="text-amber-200 text-[9px] leading-tight">Buildwell · ibuildwell.com</div>
        </div>
        <div className="text-right">
          <div className="text-white font-black text-sm">142</div>
          <div className="text-amber-200 text-[9px]">line items</div>
        </div>
      </div>

      {/* Assumptions strip */}
      <div className="bg-stone-50 border-b border-stone-200 px-3 py-1.5">
        <div className="text-[8px] font-bold text-stone-500 uppercase tracking-wide mb-1">Project Assumptions</div>
        <div className="space-y-0.5">
          {["Total area: 2,400 sq ft · 2 stories", "Climate zone: Cold — IECC R-21 walls", "Foundation: Full basement"].map((line) => (
            <div key={line} className="flex items-center gap-1">
              <span className="text-amber-500 text-[8px]">•</span>
              <span className="text-[8px] text-stone-500">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Division tables */}
      <div className="divide-y divide-stone-100">
        {divs.map((div) => (
          <div key={div.label} className="px-3 py-2">
            {/* Division header */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{div.label}</span>
              <span className="text-[9px] font-black text-stone-800">{div.name}</span>
            </div>
            {/* Table header */}
            <div className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-x-2 mb-0.5 border-b border-stone-100 pb-0.5">
              {["Item", "Specification", "Qty", "Unit"].map((h) => (
                <div key={h} className="text-[7px] font-semibold text-stone-400 uppercase tracking-wide">{h}</div>
              ))}
            </div>
            {/* Rows */}
            {div.rows.map((row, i) => (
              <div key={row} className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-x-2 py-0.5">
                <div className="text-[8px] font-semibold text-stone-800 truncate">{row}</div>
                <div
                  className="text-[7px] text-stone-400 truncate"
                  style={{ filter: i >= 1 ? "blur(2px)" : "none", userSelect: "none" }}
                >
                  {i === 0 ? "Machine excavation, 4 ft" : "████████████████"}
                </div>
                <div
                  className="text-[8px] font-bold text-stone-700 text-right"
                  style={{ filter: i >= 1 ? "blur(2px)" : "none" }}
                >
                  {i === 0 ? "120" : "██"}
                </div>
                <div className="text-[7px] text-stone-400" style={{ filter: i >= 1 ? "blur(2px)" : "none" }}>
                  {i === 0 ? "cu yd" : "██"}
                </div>
              </div>
            ))}
            <div className="text-[7px] text-stone-400 mt-1 text-center">
              + {Math.floor(Math.random() * 8) + 5} more items in this division
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-stone-100 px-3 py-1.5 border-t border-stone-200">
        <div className="text-[7px] text-stone-400 leading-tight">
          AI-generated preliminary estimate for planning purposes only. Review with licensed engineer before construction.
        </div>
      </div>
    </div>
  );
}
