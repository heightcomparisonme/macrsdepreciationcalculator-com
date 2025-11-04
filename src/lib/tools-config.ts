import fs from 'fs';
import path from 'path';

/**
 * Tools Configuration
 * Automatically discovers tools from the file system and merges with custom overrides
 */

export interface ToolConfig {
  slug: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
  /**
   * Translation key if nested, undefined if flat structure
   * e.g., "kochen" for { "kochen": { "metadata": {...} } }
   * or undefined for { "metadata": {...} }
   */
  translationKey?: string;
}

/**
 * Default styling configuration for auto-discovered tools
 */
const DEFAULT_TOOL_CONFIG: Omit<ToolConfig, 'slug'> = {
  icon: "Sparkles",
  color: "bg-gradient-to-br from-gray-500 to-gray-600",
  category: "Tools",
  tags: []
};

/**
 * Custom overrides for specific tools
 * Add entries here to customize icon, color, category, and tags for specific tools
 */
const TOOL_OVERRIDES: Record<string, Partial<Omit<ToolConfig, 'slug'>>> = {
  // "example": {
  //   icon: "Sparkles",
  //   color: "bg-gradient-to-br from-pink-500 to-pink-600",
  //   category: "AI Tools",
  //   tags: ["ai", "advisor", "personalized", "readings", "moon"]
  // },
  "test-calculator": {
    icon: "Calculator",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    category: "Tools",
    tags: ["calculator", "test", "addition", "math"]
  }
};

/**
 * Discover tools from the file system
 * Scans src/app/[locale]/(default)/tools directory for tool folders
 */
function discoverTools(): string[] {
  try {
    const toolsPath = path.join(process.cwd(), 'src', 'app', '[locale]', '(default)', 'tools');
    
    if (!fs.existsSync(toolsPath)) {
      console.warn(`Tools directory not found: ${toolsPath}`);
      return [];
    }

    const entries = fs.readdirSync(toolsPath, { withFileTypes: true });

    // Filter for directories only (exclude page.tsx and other files)
    // Also exclude Next.js dynamic route patterns like [slug], [...slug], [[...slug]]
    const toolSlugs = entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !entry.name.startsWith('[') || !entry.name.endsWith(']'))
      .map(entry => entry.name);

    return toolSlugs;
  } catch (error) {
    console.error('Error discovering tools:', error);
    return [];
  }
}

/**
 * Generate tools configuration by merging discovered tools with overrides
 */
function generateToolsConfig(): ToolConfig[] {
  const discoveredSlugs = discoverTools();
  
  // Merge discovered tools with any tools only in overrides
  const allSlugs = new Set([
    ...discoveredSlugs,
    ...Object.keys(TOOL_OVERRIDES)
  ]);
  
  return Array.from(allSlugs).map(slug => {
    const override = TOOL_OVERRIDES[slug] || {};
    
    return {
      slug,
      ...DEFAULT_TOOL_CONFIG,
      ...override
    };
  });
}

/**
 * Exported tools configuration
 * Automatically generated from file system + custom overrides
 */
export const TOOLS_CONFIG: ToolConfig[] = generateToolsConfig();

/**
 * Get tool config by slug
 */
export function getToolConfig(slug: string): ToolConfig | undefined {
  return TOOLS_CONFIG.find(tool => tool.slug === slug);
}

/**
 * Get all tool slugs
 */
export function getAllToolSlugs(): string[] {
  return TOOLS_CONFIG.map(tool => tool.slug);
}
