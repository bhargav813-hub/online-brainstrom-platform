import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import type { Idea, IdeaNode } from "@/types/models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Reconstruct a nested tree from a flat list of ideas.
 * Backend returns ideas sorted by depth, position.
 */
export function buildIdeaTree(flatIdeas: Idea[]): IdeaNode[] {
  const map = new Map<string, IdeaNode>();
  const roots: IdeaNode[] = [];

  // Initialize all nodes with empty children
  for (const idea of flatIdeas) {
    map.set(idea._id, { ...idea, children: [] });
  }

  // Build tree
  for (const idea of flatIdeas) {
    const node = map.get(idea._id)!;
    if (idea.parentIdea) {
      const parent = map.get(idea.parentIdea);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Format a date string as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format a date string in a readable format
 */
export function formatDate(date: string, formatStr = "MMM d, yyyy"): string {
  return format(new Date(date), formatStr);
}

/**
 * Get initials from a name (e.g., "John Doe" → "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
