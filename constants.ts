
import { PanelType, SolarPanelConfig } from './types.ts';

export const PANEL_CONFIGS: Record<PanelType, SolarPanelConfig> = {
  [PanelType.MONOCRYSTALLINE]: {
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 0.20,
    costPerWatt: 32, // INR approx
    lifespan: 25,
    description: "High performance. Best for cities with limited roof space like Delhi or Mumbai."
  },
  [PanelType.POLYCRYSTALLINE]: {
    type: PanelType.POLYCRYSTALLINE,
    efficiency: 0.16,
    costPerWatt: 26,
    lifespan: 20,
    description: "Budget-friendly. Widely used in rural solar installations."
  },
  [PanelType.DCR_PANELS]: {
    type: PanelType.DCR_PANELS,
    efficiency: 0.19,
    costPerWatt: 35,
    lifespan: 25,
    description: "Made in India. Mandatory for availing PM Surya Ghar subsidies."
  }
};

export const INDIAN_STATES = [
  "Uttar Pradesh", "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", 
  "Rajasthan", "Delhi", "West Bengal", "Madhya Pradesh", "Haryana"
];

export const STANDARD_PANEL_WATTAGE = 540; // 540W is now standard in India
export const SYSTEM_LOSS_FACTOR = 0.75; // Higher losses due to dust/heat in India
export const LABOR_COST_PER_WATT = 12; // Approx ₹10-15 per watt in India
