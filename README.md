# @pipeworx/mcp-carbon

MCP server for carbon intensity data — electricity carbon emissions by region.

## Tools

| Tool | Description |
|------|-------------|
| `get_intensity` | Get current UK national carbon intensity (forecast, actual, index) |
| `get_intensity_by_date` | Get carbon intensity data for every half-hour period of a given date |
| `get_generation_mix` | Get current UK electricity generation mix by fuel type |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "carbon": {
      "url": "https://gateway.pipeworx.io/carbon/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use carbon
```

## License

MIT
