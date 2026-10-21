import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Preprocess any weird formatting (like ^(Source ...)^ or standalone <br> tags)
  const sanitizedContent = content
    // Replace superscript caret syntax with italicized citation badge
    .replace(/\^\(([^)]+)\)\^/g, '*($1)*');

  return (
    <div className="prose-chat w-full text-slate-800 dark:text-slate-100 text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Tables
          table: ({ children }) => (
            <div className="my-3.5 w-full overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-sm bg-white dark:bg-slate-800/90">
              <table className="w-full border-collapse text-left text-xs text-slate-700 dark:text-slate-200">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 text-[11px] font-semibold uppercase tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-normal">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-2.5 px-4 align-top leading-relaxed text-slate-700 dark:text-slate-200">
              {children}
            </td>
          ),

          // Headings
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 first:mt-0 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5 first:mt-0 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider mt-3 mb-1">
              {children}
            </h3>
          ),

          // Text & paragraphs
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-700 dark:text-slate-200">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
          ),
          em: ({ children }) => {
            const text = String(children);
            // If this is a source citation like (Source 1 - ...), style as a neat badge
            if (/source\s*\d+/i.test(text)) {
              return (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 px-1.5 py-0.5 rounded my-0.5">
                  {children}
                </span>
              );
            }
            return <em className="italic text-slate-600 dark:text-slate-300">{children}</em>;
          },

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1.5 text-slate-700 dark:text-slate-200 marker:text-brand-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-slate-700 dark:text-slate-200 marker:text-brand-500">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,

          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-300 font-mono text-[12px] px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <code>{children}</code>
              </pre>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-3.5 border-l-4 border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 py-2 pr-3 rounded-r-lg text-slate-700 dark:text-slate-300 text-xs italic">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => <hr className="my-3 border-t border-slate-200 dark:border-slate-700" />,
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};
