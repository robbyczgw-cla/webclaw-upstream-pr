import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";

export function App() {
  return (
    <div
      className="min-h-screen bg-[#fcfcfc] text-neutral-900 selection:bg-neutral-900 selection:text-white"
      style={{
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col space-y-32 px-6 py-20">
        <div className="flex flex-col space-y-14">
          <div className="space-y-6">
            <h1 className="font-medium">WebClaw</h1>
            <p className="text-neutral-500">Fast web client for OpenClaw.</p>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-white select-none"
                href="https://github.com/ibelick/webclaw"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github Repository
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-4"
                >
                  <path
                    d="M10 20.5675C6.57143 21.7248 3.71429 20.5675 2 17"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M10 22V18.7579C10 18.1596 10.1839 17.6396 10.4804 17.1699C10.6838 16.8476 10.5445 16.3904 10.1771 16.2894C7.13394 15.4528 5 14.1077 5 9.64606C5 8.48611 5.38005 7.39556 6.04811 6.4464C6.21437 6.21018 6.29749 6.09208 6.31748 5.9851C6.33746 5.87813 6.30272 5.73852 6.23322 5.45932C5.95038 4.32292 5.96871 3.11619 6.39322 2.02823C6.39322 2.02823 7.27042 1.74242 9.26698 2.98969C9.72282 3.27447 9.95075 3.41686 10.1515 3.44871C10.3522 3.48056 10.6206 3.41384 11.1573 3.28041C11.8913 3.09795 12.6476 3 13.5 3C14.3524 3 15.1087 3.09795 15.8427 3.28041C16.3794 3.41384 16.6478 3.48056 16.8485 3.44871C17.0493 3.41686 17.2772 3.27447 17.733 2.98969C19.7296 1.74242 20.6068 2.02823 20.6068 2.02823C21.0313 3.11619 21.0496 4.32292 20.7668 5.45932C20.6973 5.73852 20.6625 5.87813 20.6825 5.9851C20.7025 6.09207 20.7856 6.21019 20.9519 6.4464C21.6199 7.39556 22 8.48611 22 9.64606C22 14.1077 19.8661 15.4528 16.8229 16.2894C16.4555 16.3904 16.3162 16.8476 16.5196 17.1699C16.8161 17.6396 17 18.1596 17 18.7579V22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <img
            alt="OpenClaw interface preview"
            className="pointer-events-none h-full w-full rounded-[6px] select-none"
            src="/webclaw-cover.webp"
            style={{
              boxShadow: `
            0px 0px 0px 1px rgba(0,0,0,0.08),
            0px 8px 12px 0px rgba(0, 0, 0, 0.04),
            0px 24px 32px 0px rgba(0, 0, 0, 0.04)
            `,
            }}
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-[450]">Installation</h2>
          <CodeBlock className="rounded-[6px] border-none bg-[#FCFCFC] shadow-2xs outline-1 outline-neutral-950/10 [&>div]:bg-[#FCFCFC] [&>div>pre]:!bg-[#FCFCFC]">
            <CodeBlockCode
              code={`gh repo clone ibelick/webclaw
cd webclaw
pnpm i
pnpm run dev`}
              language="bash"
            />
          </CodeBlock>
        </div>
      </main>
      <footer
        className="flex w-full items-center justify-center gap-3 px-4 pt-24 pb-6 text-center text-sm font-medium text-neutral-400 sm:px-0"
        style={{ pointerEvents: "auto" }}
      >
        <span>
          <span>©2026</span>{" "}
          <a
            href="https://interfaceoffice.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-900"
          >
            Interface Office
          </a>
        </span>
      </footer>
    </div>
  );
}
