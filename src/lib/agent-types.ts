export type Mode = "qloo" | "llm";
export type Neighborhood = {
  name: string;
  borough: string;
  rent: "$" | "$$" | "$$$";
  tags: string[];
  why: string;
  lat?: number | undefined;
  lng?: number | undefined;
};
export type Place = {
  name: string;
  category: string;
  neighborhood: string;
  tags: string[];
  reason: string;
  image?: string | undefined;
  imageAlt?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
};
export type AgentStep = { label: string; ms: number };
export type NeighborhoodMatch = Neighborhood & { image?: string; imageAlt?: string; scoreAvailable?: boolean; score: number; matched: string[]; rentRange: string };
export type AgentResult = {
  summary: string;
  neighborhoods: NeighborhoodMatch[];
  places: Place[];
  plan: { week: string; items: string[] }[];
  steps: AgentStep[];
  mode: Mode;
  city: string;
  spoken: string;
  source?: "qloo" | "sample";
  trip?: "moving" | "visiting";
  status?: "ok" | "unavailable" | "error";
  alternatives?: { name: string; reason: string }[];
};

