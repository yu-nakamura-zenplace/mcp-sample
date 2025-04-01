#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Sample data for demonstration
const sampleData = [
  { id: 1, name: "Item 1", category: "Category A" },
  { id: 2, name: "Item 2", category: "Category B" },
  { id: 3, name: "Item 3", category: "Category A" },
  { id: 4, name: "Item 4", category: "Category C" },
  { id: 5, name: "Item 5", category: "Category B" },
];

const server = new Server(
  {
    name: "zen-mcp-sample",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

// Simple resource instead of database tables
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "items",
        mimeType: "application/json",
        name: "Sample Items",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "items") {
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(sampleData, null, 2),
        },
      ],
    };
  }
  throw new Error("Resource not found");
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "getList",
        description: "Get a list of items, optionally filtered by category",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Filter by category (optional)" },
          },
        },
      },
      {
        name: "getCount",
        description: "Get count of items, optionally filtered by category",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Filter by category (optional)" },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "getList": {
      const category = request.params.arguments?.category;
      let result = [...sampleData];
      
      if (category) {
        result = result.filter(item => item.category === category);
      }
      
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        isError: false,
      };
    }
    
    case "getCount": {
      const category = request.params.arguments?.category;
      let count;
      
      if (category) {
        count = sampleData.filter(item => item.category === category).length;
      } else {
        count = sampleData.length;
      }
      
      return {
        content: [{ type: "text", text: JSON.stringify({ count }, null, 2) }],
        isError: false,
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);