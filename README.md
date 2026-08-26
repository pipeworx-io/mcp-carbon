# mcp-carbon

Carbon MCP — UK Carbon Intensity API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_intensity` | Check current UK electricity carbon intensity. Returns gCO2/kWh (forecast and actual) plus intensity level (very low to very high). Use to schedule energy-intensive tasks during low-carbon periods. |
| `get_intensity_by_date` | Get UK electricity carbon intensity for every 30-minute period on a specific date (e.g., "2024-01-15"). Returns gCO2/kWh forecast and actual. Use to identify lowest-carbon hours. |
| `get_generation_mix` | Check current UK electricity grid composition by source percentage (gas, coal, wind, solar, nuclear, hydro, biomass, imports). Use to understand real-time grid energy mix. |
| `get_regional_intensity` | Carbon intensity (forecast gCO2/kWh + index band) and generation mix for a specific Great Britain region. Pass "postcode" (UK outcode — first half of a postcode, e.g. "RG10") or "regionid" (1–17, e.g. 13 = London). Omit both for all regions at the current half-hour. Regional figures are forecast-only. |
| `get_intensity_factors` | Carbon intensity factors (gCO2/kWh) per fuel type used in the headline figures — e.g. Coal 937, Gas (Combined Cycle) 394, Nuclear 0, Wind 0, Solar 0. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "carbon": {
      "url": "https://gateway.pipeworx.io/carbon/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/carbon/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Carbon data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
