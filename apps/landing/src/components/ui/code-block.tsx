import type { ReactNode } from "react";

type CodeBlockProps = {
  className?: string;
  children: ReactNode;
};

type CodeBlockCodeProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ className, children }: CodeBlockProps) {
  return (
    <div className={className}>
      <div>
        <pre className="m-0 overflow-x-auto rounded-[6px] bg-white p-4 text-[13px]">
          {children}
        </pre>
      </div>
    </div>
  );
}

export function CodeBlockCode({ code, language }: CodeBlockCodeProps) {
  const resolvedLanguage = language ?? "text";
  const lines = code.split("\n");

  if (resolvedLanguage === "bash") {
    return (
      <code className="whitespace-pre" data-language={resolvedLanguage}>
        {lines.map((line, index) => {
          const match = /^(gh|cd|pnpm)\s(.+)$/.exec(line);
          const command = match?.[1];
          const rest = match ? ` ${match[2]}` : line;

          return (
            <span key={`${line}-${index}`}>
              {command === "gh" ? (
                <span style={{ color: "rgb(111, 66, 193)" }}>gh</span>
              ) : command === "cd" ? (
                <span style={{ color: "#005CC5" }}>cd</span>
              ) : command === "pnpm" ? (
                <span style={{ color: "rgb(111, 66, 193)" }}>pnpm</span>
              ) : null}
              <span style={{ color: "#032F62" }}>{rest}</span>
              {index < lines.length - 1 ? "\n" : ""}
            </span>
          );
        })}
      </code>
    );
  }

  return (
    <code
      className="whitespace-pre text-neutral-900"
      data-language={resolvedLanguage}
    >
      {code}
    </code>
  );
}
