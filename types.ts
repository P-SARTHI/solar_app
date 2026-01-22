
export enum PanelType {
  MONOCRYSTALLINE = 'MONOCRYSTALLINE',
  POLYCRYSTALLINE = 'POLYCRYSTALLINE',
  DCR_PANELS = 'DCR_PANELS' // Domestic Content Requirement for subsidies
}

export interface SolarPanelConfig {
  type: PanelType;
  efficiency: number;
  costPerWatt: number; // INR
  lifespan: number;
  description: string;
}

export interface CalculationInput {
  monthlyConsumption: number;
  sunHoursPerDay: number;
  electricityRate: number; // INR per kWh
  state: string;
  selectedPanelType: PanelType;
}

export interface CalculationResult {
  requiredKW: number;
  totalPanels: number;
  hardwareCost: number;
  installationCost: number;
  estimatedCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  finalCost: number;
  monthlySavings: number;
  paybackPeriod: number;
  co2Saved: number;
  treesEquivalent: number;
}

export interface AIAdvice {
  summary: string;
  benefits: string[];
  recommendations: string;
}
