
import { CalculationInput, CalculationResult, PanelType } from '../types';
import { PANEL_CONFIGS, STANDARD_PANEL_WATTAGE, SYSTEM_LOSS_FACTOR, LABOR_COST_PER_WATT } from '../constants';

export const calculateSolarMetrics = (input: CalculationInput): CalculationResult => {
  const { monthlyConsumption, sunHoursPerDay, electricityRate, state, selectedPanelType } = input;
  
  // 1. Daily consumption
  const dailyKwh = monthlyConsumption / 30;

  // 2. Required KW capacity
  const requiredKW = dailyKwh / (sunHoursPerDay * SYSTEM_LOSS_FACTOR);
  const roundedKW = Math.ceil(requiredKW * 2) / 2; // Round to nearest 0.5kW

  // 3. Number of panels
  const totalPanels = Math.ceil((roundedKW * 1000) / STANDARD_PANEL_WATTAGE);

  // 4. Costs
  const config = PANEL_CONFIGS[selectedPanelType];
  const systemWattage = roundedKW * 1000;
  
  const hardwareCost = systemWattage * config.costPerWatt;
  const installationCost = systemWattage * LABOR_COST_PER_WATT;
  const estimatedCost = hardwareCost + installationCost;
  
  // 5. PM Surya Ghar: Muft Bijli Yojana Subsidy Logic
  let centralSubsidy = 0;
  if (roundedKW >= 3) {
    centralSubsidy = 78000;
  } else if (roundedKW >= 2) {
    centralSubsidy = 60000;
  } else if (roundedKW >= 1) {
    centralSubsidy = 30000;
  }

  // 6. State Specific Add-ons (e.g. UP State Subsidy)
  let stateSubsidy = 0;
  if (state === "Uttar Pradesh") {
    // UP often provides additional ₹15,000-₹30,000 state subsidy for domestic consumers
    stateSubsidy = Math.min(roundedKW * 15000, 30000);
  }

  const finalCost = Math.max(estimatedCost - (centralSubsidy + stateSubsidy), 0);

  // 7. Savings
  const monthlySavings = monthlyConsumption * electricityRate;
  const paybackPeriod = finalCost / (monthlySavings * 12);

  // 8. Environmental Impact
  const co2Saved = monthlyConsumption * 12 * 0.8; // India grid is more carbon intensive
  const treesEquivalent = Math.round(co2Saved / 21);

  return {
    requiredKW: roundedKW,
    totalPanels,
    hardwareCost,
    installationCost,
    estimatedCost,
    centralSubsidy,
    stateSubsidy,
    finalCost,
    monthlySavings,
    paybackPeriod,
    co2Saved,
    treesEquivalent
  };
};
