'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { toast } from 'sonner';
import { ideaService } from '@/services/idea.service';
import { sharedService } from '@/services/shared.service';
import { buildIdeaTree } from '@/lib/utils';
import type { IdeaNode } from '@/types/models';

interface UseExportTreeOptions {
  sessionId: string;
  sessionTitle: string;
  shareToken?: string;
}

export function useExportTree({ sessionId, sessionTitle, shareToken }: UseExportTreeOptions) {
  const [isExporting, setIsExporting] = useState(false);

  // Helper to fetch ideas for Markdown export
  const fetchIdeas = async (): Promise<IdeaNode[]> => {
    const data = shareToken
      ? await sharedService.getIdeasHierarchy(shareToken, sessionId)
      : await ideaService.getHierarchy(sessionId);
    return buildIdeaTree(data);
  };

  // 1. Export as Markdown
  const exportMarkdown = async () => {
    setIsExporting(true);
    try {
      const tree = await fetchIdeas();
      
      let markdown = `# ${sessionTitle}\n\n`;
      markdown += `Generated on: ${new Date().toLocaleString()}\n`;
      markdown += `Export Mode: ${shareToken ? 'Guest View-Only' : 'Workspace Session'}\n\n`;
      markdown += `---\n\n`;

      const formatNode = (node: IdeaNode, depth = 0) => {
        const indent = '  '.repeat(depth);
        const votes = `[+${node.upvoteCount} / -${node.downvoteCount}]`;
        const author = node.author ? `by ${node.author.name}` : 'Anonymous';
        const version = node.currentVersion > 1 ? ` (v${node.currentVersion})` : '';
        
        let line = `${indent}- **${node.title}** ${votes} ${author}${version}\n`;
        if (node.content) {
          line += `${indent}  *${node.content}*\n`;
        }
        
        markdown += line;
        
        node.children.forEach((child) => formatNode(child, depth + 1));
      };

      tree.forEach((rootNode) => formatNode(rootNode, 0));

      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${sessionTitle.replace(/\s+/g, '_')}_export.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Markdown export completed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export Markdown');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to capture the DOM element as canvas
  const captureCanvas = async (elementId: string): Promise<HTMLCanvasElement | null> => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Export element not found in DOM');
      return null;
    }

    // Hide scrollbars and show full content temporarily
    const originalStyle = element.style.cssText;
    element.style.overflow = 'visible';
    element.style.height = 'auto';
    element.style.maxHeight = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#030712', // Match shadcn/next dark theme background
        logging: false,
      });
      element.style.cssText = originalStyle;
      return canvas;
    } catch (err) {
      element.style.cssText = originalStyle;
      throw err;
    }
  };

  // 2. Export as PNG
  const exportPNG = async (elementId = 'idea-tree-export-root') => {
    setIsExporting(true);
    try {
      const canvas = await captureCanvas(elementId);
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.setAttribute('download', `${sessionTitle.replace(/\s+/g, '_')}_export.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PNG export completed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PNG');
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export as PDF
  const exportPDF = async (elementId = 'idea-tree-export-root') => {
    setIsExporting(true);
    try {
      const canvas = await captureCanvas(elementId);
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${sessionTitle.replace(/\s+/g, '_')}_export.pdf`);
      toast.success('PDF export completed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportMarkdown,
    exportPNG,
    exportPDF,
  };
}
