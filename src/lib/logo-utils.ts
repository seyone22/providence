// lib/logo-utils.ts

// This aligns with your file system naming conventions
export const getLogoFilename = (make: string): string | null => {
    const mapping: Record<string, string> = {
        "Aston Martin": "Aston Martin Logo.png",
        "Audi": "audi logo.png",
        "Bentley": "Bentley Logo.png",
        "BMW": "bmw logo.png",
        "Ferrari": "ferrari logo.png",
        "Genesis": "genesis logo.png",
        "Lamborghini": "lamborghini logo.png",
        "Land Rover": "land rover logo.png",
        "Lexus": "lexus logo.png",
        "Lucid": "lucid motors logo.png",
        "Mercedes-Benz": "mercedes benz logo.png",
        "Polestar": "Polestar logo.png",
        "Porsche": "porsche logo.png",
        "Rolls-Royce": "rolls royce logo.png",
        "Tesla": "tesla logo.png",
        "Volvo": "volvo logo.png",
        "Zeekr": "Zeekr logo.png",
        "Toyota": "Toyota.png"
    };

    return mapping[make] || null;
};

export const CAR_MAKES = [
    "Aston Martin", "Audi", "Bentley", "BMW", "Ferrari", "Genesis",
    "Lamborghini", "Land Rover", "Lexus", "Lucid Motors", "Mercedes-Benz",
    "Polestar", "Porsche", "Rolls-Royce", "Toyota", "Tesla", "Volvo", "Zeekr"
].sort();