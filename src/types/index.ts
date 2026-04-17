export type StructureType =
  | "SINGLE_FAMILY_HOME"
  | "CONTAINER_HOME"
  | "BARNDOMINIUM"
  | "BARN"
  | "LOG_CABIN"
  | "A_FRAME"
  | "SHED"
  | "WORKSHOP"
  | "GARAGE"
  | "TINY_HOME"
  | "DOME_HOME"
  | "QUONSET_HUT"
  | "SILO"
  | "POLE_BARN"
  | "EARTHSHIP"
  | "PASSIVE_SOLAR";

export interface StructureOption {
  value: StructureType;
  label: string;
  description: string;
  icon: string;
  category: "Residential" | "Agricultural" | "Specialty" | "Outbuilding" | "Sustainable";
  costLevel: 1 | 2 | 3 | 4;
  costNote: string;
  image?: string;
}

export interface QuestionStep {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "radio" | "textarea";
  options?: { value: string; label: string }[];
  placeholder?: string;
  unit?: string;
  required?: boolean;
}

export interface ProjectAnswers {
  [key: string]: string | number | string[];
}

export interface ProjectSummary {
  structureType: StructureType;
  squareFootage: number;
  bedrooms?: number;
  bathrooms?: number;
  stories?: number;
  foundationType?: string;
  roofType?: string;
  exteriorMaterial?: string;
  sustainabilityFeatures?: string[];
  estimatedBudget?: string;
}
