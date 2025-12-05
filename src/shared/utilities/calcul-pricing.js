/**
 * PRICING CALCULATION MODULE
 * Calculates total cost including installation fees for elevator installations
 */

import { UNIT_PRICES, INSTALL_PERCENT_FEES, FORMATTER } from "../resources/data.js";

export const calculTotalPricing = (numberOfElevators, tier) => {
    // Validate input parameters
    if (!Number.isInteger(numberOfElevators) || numberOfElevators <= 0) {
        throw new Error('Number of elevators must be a positive integer');
    }

    // Validate tier parameter
    if (!tier || typeof tier !== 'string') {
        throw new Error('Tier must be a valid string');
    }

    // Validate pricing data exists (internal data integrity check)
    const unitPrice = UNIT_PRICES[tier];
    const installFee = INSTALL_PERCENT_FEES[tier];
    
    // If pricing data is missing, throw an error
    if (unitPrice === undefined || installFee === undefined) {
        throw new Error(`Pricing data not found for tier: ${tier}`);
    }

    // Calculate costs:
    // 1. Base cost = number of elevators × unit price
    const baseCost = numberOfElevators * unitPrice;
    
    // 2. Installation cost = base cost × installation fee percentage
    const installationCost = baseCost * installFee;
    
    // 3. Total cost = base cost + installation cost
    const totalCost = baseCost + installationCost;

    // Return formatted result
    return FORMATTER?.format(totalCost) || `$${totalCost.toFixed(2)}`
};