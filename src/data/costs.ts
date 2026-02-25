export interface CountryData {
  name: string;
  code: string;
  rent: {
    room: [number, number];
    studio: [number, number];
    "1br": [number, number];
    "2br": [number, number];
  };
  food: {
    budget: [number, number];
    comfortable: [number, number];
    premium: [number, number];
  };
  transport: [number, number];
  utilities: [number, number];
  internet: [number, number];
  health: [number, number];
  fun: {
    budget: [number, number];
    comfortable: [number, number];
    premium: [number, number];
  };
  confidence: "Low" | "Medium" | "High";
}

export const costData: Record<string, CountryData> = {
  thailand: {
    name: "Thailand",
    code: "TH",
    rent: {
      room: [150, 300],
      studio: [250, 500],
      "1br": [400, 800],
      "2br": [600, 1200],
    },
    food: {
      budget: [150, 250],
      comfortable: [300, 450],
      premium: [500, 800],
    },
    transport: [30, 80],
    utilities: [40, 80],
    internet: [15, 30],
    health: [50, 150],
    fun: {
      budget: [50, 100],
      comfortable: [150, 300],
      premium: [400, 800],
    },
    confidence: "High",
  },
  vietnam: {
    name: "Vietnam",
    code: "VN",
    rent: {
      room: [100, 200],
      studio: [200, 400],
      "1br": [350, 650],
      "2br": [500, 900],
    },
    food: {
      budget: [100, 200],
      comfortable: [250, 400],
      premium: [450, 700],
    },
    transport: [20, 60],
    utilities: [30, 60],
    internet: [10, 25],
    health: [40, 120],
    fun: {
      budget: [40, 80],
      comfortable: [120, 250],
      premium: [350, 600],
    },
    confidence: "High",
  },
  portugal: {
    name: "Portugal",
    code: "PT",
    rent: {
      room: [400, 700],
      studio: [600, 1000],
      "1br": [800, 1400],
      "2br": [1100, 1800],
    },
    food: {
      budget: [200, 350],
      comfortable: [400, 600],
      premium: [700, 1000],
    },
    transport: [40, 80],
    utilities: [80, 150],
    internet: [30, 50],
    health: [100, 250],
    fun: {
      budget: [80, 150],
      comfortable: [200, 400],
      premium: [500, 900],
    },
    confidence: "High",
  },
  spain: {
    name: "Spain",
    code: "ES",
    rent: {
      room: [350, 600],
      studio: [550, 900],
      "1br": [750, 1300],
      "2br": [1000, 1700],
    },
    food: {
      budget: [200, 350],
      comfortable: [400, 600],
      premium: [650, 950],
    },
    transport: [40, 70],
    utilities: [70, 140],
    internet: [30, 50],
    health: [80, 200],
    fun: {
      budget: [100, 180],
      comfortable: [250, 450],
      premium: [550, 950],
    },
    confidence: "High",
  },
  mexico: {
    name: "Mexico",
    code: "MX",
    rent: {
      room: [200, 400],
      studio: [350, 600],
      "1br": [500, 900],
      "2br": [700, 1300],
    },
    food: {
      budget: [150, 280],
      comfortable: [320, 500],
      premium: [550, 850],
    },
    transport: [30, 70],
    utilities: [40, 90],
    internet: [20, 40],
    health: [60, 180],
    fun: {
      budget: [80, 150],
      comfortable: [200, 380],
      premium: [450, 800],
    },
    confidence: "High",
  },
  canada: {
    name: "Canada",
    code: "CA",
    rent: {
      room: [600, 1000],
      studio: [1000, 1600],
      "1br": [1400, 2200],
      "2br": [1800, 2800],
    },
    food: {
      budget: [300, 450],
      comfortable: [500, 750],
      premium: [800, 1200],
    },
    transport: [80, 150],
    utilities: [100, 180],
    internet: [50, 80],
    health: [100, 300],
    fun: {
      budget: [100, 200],
      comfortable: [300, 500],
      premium: [600, 1000],
    },
    confidence: "High",
  },
  japan: {
    name: "Japan",
    code: "JP",
    rent: {
      room: [400, 700],
      studio: [600, 1000],
      "1br": [800, 1400],
      "2br": [1200, 2000],
    },
    food: {
      budget: [250, 400],
      comfortable: [450, 700],
      premium: [750, 1100],
    },
    transport: [60, 120],
    utilities: [80, 150],
    internet: [40, 70],
    health: [80, 200],
    fun: {
      budget: [100, 200],
      comfortable: [300, 500],
      premium: [600, 1000],
    },
    confidence: "Medium",
  },
  uae: {
    name: "UAE",
    code: "AE",
    rent: {
      room: [500, 900],
      studio: [800, 1400],
      "1br": [1200, 2000],
      "2br": [1800, 3000],
    },
    food: {
      budget: [300, 500],
      comfortable: [550, 850],
      premium: [900, 1400],
    },
    transport: [80, 150],
    utilities: [100, 200],
    internet: [60, 100],
    health: [150, 400],
    fun: {
      budget: [150, 300],
      comfortable: [400, 700],
      premium: [800, 1500],
    },
    confidence: "Medium",
  },
  estonia: {
    name: "Estonia",
    code: "EE",
    rent: {
      room: [300, 500],
      studio: [450, 750],
      "1br": [600, 1000],
      "2br": [850, 1400],
    },
    food: {
      budget: [200, 350],
      comfortable: [400, 600],
      premium: [650, 950],
    },
    transport: [40, 80],
    utilities: [100, 180],
    internet: [25, 45],
    health: [80, 200],
    fun: {
      budget: [80, 160],
      comfortable: [220, 400],
      premium: [500, 850],
    },
    confidence: "Medium",
  },
};

export const countries = Object.entries(costData).map(([key, data]) => ({
  key,
  name: data.name,
  code: data.code,
}));

export type Lifestyle = "budget" | "comfortable" | "premium";
export type HousingType = "room" | "studio" | "1br" | "2br";
export type TravelerType = "solo" | "couple";
export type WorkStyle = "remote" | "local" | "student";

export interface CalculationInput {
  country: string;
  city?: string;
  lifestyle: Lifestyle;
  stayLength: number;
  housingType: HousingType;
  travelerType: TravelerType;
  workStyle: WorkStyle;
}

export interface Breakdown {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  internet: number;
  health: number;
  fun: number;
}

export interface CalculationResult {
  total: number;
  breakdown: Breakdown;
  confidence: "Low" | "Medium" | "High";
}

export function calculateCosts(input: CalculationInput): CalculationResult {
  const data = costData[input.country];
  if (!data) {
    throw new Error("Country not found");
  }

  const lifestyleMultipliers = {
    budget: 0.85,
    comfortable: 1.0,
    premium: 1.35,
  };

  const multiplier = lifestyleMultipliers[input.lifestyle];

  // Calculate midpoints
  const rentRange = data.rent[input.housingType];
  let rent = (rentRange[0] + rentRange[1]) / 2;

  // Short-term premium for 1-2 months
  if (input.stayLength <= 2) {
    rent *= 1.1;
  }

  const foodRange = data.food[input.lifestyle];
  let food = (foodRange[0] + foodRange[1]) / 2;

  let transport = (data.transport[0] + data.transport[1]) / 2;
  const utilities = (data.utilities[0] + data.utilities[1]) / 2;
  const internet = (data.internet[0] + data.internet[1]) / 2;
  const health = (data.health[0] + data.health[1]) / 2;

  const funRange = data.fun[input.lifestyle];
  let fun = (funRange[0] + funRange[1]) / 2;

  // Apply couple multipliers
  if (input.travelerType === "couple") {
    food *= 1.65;
    fun *= 1.65;
    transport *= 1.25;
  }

  // Apply lifestyle multiplier to variable costs
  food *= multiplier;
  fun *= multiplier;

  const breakdown: Breakdown = {
    rent: Math.round(rent),
    food: Math.round(food),
    transport: Math.round(transport),
    utilities: Math.round(utilities),
    internet: Math.round(internet),
    health: Math.round(health),
    fun: Math.round(fun),
  };

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    total,
    breakdown,
    confidence: data.confidence,
  };
}
