import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { CITIES, flagForCountry, resolveCity, searchCities, type CityResolution } from "@/lib/cities";
import { Button } from "./Button";

export function CityPicker({
  value,
  onResolve,
  onSearch,
  compact = false,
  id,
}: {
  value: CityResolution | null;
  onResolve: (r: CityResolution) => void;
  onSearch?: (r: CityResolution) => void;
  compact?: boolean;
  id?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const pick = (name: string, search = false) => {
    let r = resolveCity(name);
    if (!r) {
      const top = searchCities(name)[0];
      if (top) r = resolveCity(top.name);
    }
    if (!r) {
      setError("We couldn't locate that city. Check the spelling or choose a suggestion.");
      return;
    }
    onResolve(r);
    if (search) onSearch?.(r);
    setError("");
    setQuery("");
    setOpen(false);
  };
  return (
    <div ref={boxRef} className={`relative min-w-0 ${compact ? "max-w-52" : "w-full"}`}>
      <div className="city-picker-input">
        {value && (
          <span className="emoji shrink-0" aria-hidden="true">
            {flagForCountry(value.city.country)}
          </span>
        )}
        <input
          id={id}
          aria-label="Destination city"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              pick(searchCities(query)[0]?.name ?? query, true);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={value?.city.name ?? "Pick a city"}
          autoComplete="off"
        />
        <button
          type="button"
          aria-label={open ? "Hide cities" : "Show cities"}
          aria-expanded={open}
          onClick={() => { setError(""); setOpen((o) => !o); }}
          className="-my-2 -mr-2 flex h-11 w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {error && <p role="alert" className="city-picker-dropdown absolute left-0 top-full z-50 mt-3 w-72 max-w-[80vw] rounded-xl p-3 text-xs text-foreground">{error}</p>}
      {open && !error && (
        <div className="city-picker-dropdown absolute left-0 top-full z-50 mt-3 max-h-64 w-72 max-w-[80vw] overflow-auto rounded-xl p-2 text-foreground">
          {query.trim() && searchCities(query).length === 0 ? (
            <Button
              variant="plain"
              type="button"
              onClick={() => pick(query)}
              className="w-full rounded-lg p-3 text-left text-xs"
            >
              Use “{query.trim()}”
            </Button>
          ) : (
            (query.trim() ? searchCities(query) : CITIES.slice(0, 8)).map((c) => (
              <Button
                variant="plain"
                type="button"
                key={c.name}
                onClick={() => pick(c.name)}
                className="flex w-full items-start gap-2 rounded-lg p-3 text-left text-xs hover:bg-secondary"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {c.name}
                  <small className="block text-muted-foreground">
                    {c.country}
                    
                  </small>
                </span>
              </Button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
