export interface PeldesanasCssInputs {
  time400Min: number;
  time400Sec: number;
  time200Min: number;
  time200Sec: number;
}

export interface PeldesanasCssResult {
  cssMetersPerSecond: number;
  pacePer100Seconds: number;
}

export function calculatePeldesanasCss(inputs: PeldesanasCssInputs): PeldesanasCssResult {
  const time400Total = inputs.time400Min * 60 + inputs.time400Sec;
  const time200Total = inputs.time200Min * 60 + inputs.time200Sec;
  const timeDiff = time400Total - time200Total;

  if (timeDiff <= 0) {
    return { cssMetersPerSecond: 0, pacePer100Seconds: 0 };
  }

  const cssMetersPerSecond = 200 / timeDiff;
  const pacePer100Seconds = timeDiff / 2;

  return { cssMetersPerSecond, pacePer100Seconds };
}
