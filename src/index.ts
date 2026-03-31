/**
 * Carbon MCP — UK Carbon Intensity API (free, no auth)
 *
 * Tools:
 * - get_intensity: current national carbon intensity (forecast, actual, index)
 * - get_intensity_by_date: carbon intensity for a specific date (YYYY-MM-DD)
 * - get_generation_mix: current electricity generation mix by fuel type
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.carbonintensity.org.uk';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_intensity',
    description:
      'Get the current UK national carbon intensity. Returns the forecast value (gCO2/kWh), actual measured value, and a qualitative index (very low / low / moderate / high / very high).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_intensity_by_date',
    description:
      'Get UK carbon intensity data for every half-hour period of a given date. Returns an array of time-window entries each with forecast and actual gCO2/kWh values.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (e.g., 2024-03-15)',
        },
      },
      required: ['date'],
    },
  },
  {
    name: 'get_generation_mix',
    description:
      'Get the current UK electricity generation mix showing the percentage contribution of each fuel type (gas, coal, wind, solar, nuclear, hydro, biomass, imports, etc.).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_intensity':
      return getIntensity();
    case 'get_intensity_by_date':
      return getIntensityByDate(args.date as string);
    case 'get_generation_mix':
      return getGenerationMix();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getIntensity() {
  const res = await fetch(`${BASE_URL}/intensity`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Carbon Intensity API error: ${res.status}`);

  const data = (await res.json()) as {
    data: {
      from: string;
      to: string;
      intensity: {
        forecast: number;
        actual: number | null;
        index: string;
      };
    }[];
  };

  const entry = data.data[0];
  if (!entry) throw new Error('No intensity data returned');

  return {
    from: entry.from,
    to: entry.to,
    forecast_gco2_per_kwh: entry.intensity.forecast,
    actual_gco2_per_kwh: entry.intensity.actual,
    index: entry.intensity.index,
  };
}

async function getIntensityByDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }

  const res = await fetch(`${BASE_URL}/intensity/date/${encodeURIComponent(date)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Carbon Intensity API error: ${res.status}`);

  const data = (await res.json()) as {
    data: {
      from: string;
      to: string;
      intensity: {
        forecast: number;
        actual: number | null;
        index: string;
      };
    }[];
  };

  return {
    date,
    periods: data.data.map((entry) => ({
      from: entry.from,
      to: entry.to,
      forecast_gco2_per_kwh: entry.intensity.forecast,
      actual_gco2_per_kwh: entry.intensity.actual,
      index: entry.intensity.index,
    })),
    count: data.data.length,
  };
}

async function getGenerationMix() {
  const res = await fetch(`${BASE_URL}/generation`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Carbon Intensity API error: ${res.status}`);

  const data = (await res.json()) as {
    data: {
      from: string;
      to: string;
      generationmix: {
        fuel: string;
        perc: number;
      }[];
    };
  };

  const entry = data.data;
  return {
    from: entry.from,
    to: entry.to,
    generation_mix: entry.generationmix.map((g) => ({
      fuel: g.fuel,
      percentage: g.perc,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
