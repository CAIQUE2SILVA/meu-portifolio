export interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export interface WebMcpModelContext {
  registerTool(tool: WebMcpToolDefinition): { abort(): void };
}

declare global {
  interface Navigator {
    modelContext?: WebMcpModelContext;
  }
}

export {};
