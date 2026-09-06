// lib/logo-utils.ts

// This aligns with your file system naming conventions
export const getLogoFilename = (make: string): string | null => {
  const mapping: Record<string, string> = {
    "Aston Martin": "aston-martin-logo.webp",
    Audi: "audi-logo.webp",
    Bentley: "bentley-logo.webp",
    BMW: "bmw-logo.webp",
    Ferrari: "ferrari-logo.webp",
    Genesis: "genesis-logo.webp",
    Lamborghini: "lamborghini-logo.webp",
    "Land Rover": "land-rover-logo.webp",
    Lexus: "lexus-logo.webp",
    Lucid: "lucid-motors-logo.webp",
    "Mercedes-Benz": "mercedes-benz-logo.webp",
    Polestar: "polestar-logo.webp",
    Porsche: "porsche-logo.webp",
    "Rolls-Royce": "rolls-royce-logo.webp",
    Tesla: "tesla-logo.webp",
    Volvo: "volvo-logo.webp",
    Zeekr: "zeekr-logo.webp",
    Toyota: "toyota.webp",
  };

  return mapping[make] || null;
};

export const CAR_MAKES = [
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Ferrari",
  "Genesis",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lucid Motors",
  "Mercedes-Benz",
  "Polestar",
  "Porsche",
  "Rolls-Royce",
  "Toyota",
  "Tesla",
  "Volvo",
  "Zeekr",
].sort();
