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