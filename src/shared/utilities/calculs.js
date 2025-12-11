/**
 * RESIDENTIAL ELEVATOR CALCULATION MODULE
 * Calculates the number of elevators required for residential buildings
 */
export const calculResidentialElevators = (numberOfApartments, numberOfFloors) => {
    // Validate input parameters
    if (!Number.isInteger(numberOfApartments) || numberOfApartments <= 0) {
        throw new Error('Number of apartments must be a positive integer');
    }
    
    // Validate number of floors
    if (!Number.isInteger(numberOfFloors) || numberOfFloors <= 0) {
        throw new Error('Number of floors must be a positive integer');
    }

    // Business logic constants
    const APARTMENTS_PER_ELEVATOR = 6;    // 1 elevator serves 6 apartments
    const FLOORS_PER_ELEVATOR_BANK = 20;  // Elevator banks serve 20 floors max

    // Calculate elevators needed using business rules:
    // 1. Determine apartments per floor
    const apartmentsPerFloor = numberOfApartments / numberOfFloors;
    
    // 2. Calculate elevators needed per floor (1 elevator per 6 apartments)
    const elevatorsPerFloor = Math.ceil(apartmentsPerFloor / APARTMENTS_PER_ELEVATOR);
    
    // 3. Calculate elevator banks needed (1 bank per 20 floors)
    const elevatorBanks = Math.ceil(numberOfFloors / FLOORS_PER_ELEVATOR_BANK);
    
    // 4. Total elevators = elevators per floor × elevator banks
    const elevatorsRequired = elevatorsPerFloor * elevatorBanks;

    return elevatorsRequired;
};


/**
 * PRICING CALCULATION MODULE
 * Calculates total cost including installation fees for elevator installations
 */

import { UNIT_PRICES, INSTALL_PERCENT_FEES, FORMATTER } from "../resources/data.js";

export const calculPricing = (numberOfElevators, tier) => {
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
    return {
        unitPrice: FORMATTER?.format(unitPrice) || `$${unitPrice.toFixed(2)}`,
        elevatorCost: FORMATTER?.format(baseCost) || `$${baseCost.toFixed(2)}`,
        installationFee: FORMATTER?.format(installationCost) || `$${installationCost.toFixed(2)}`,
        totalCost: FORMATTER?.format(totalCost) || `$${totalCost.toFixed(2)}`
    }
};