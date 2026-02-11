import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "About",
  description:
    "YoYu Chen — Software engineer and problem solver. Specialising in complex front-end applications, React/TypeScript, and full-stack solutions.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
      </FadeIn>

      <div className="prose mx-auto mt-8">
        <FadeIn delay={0.1}>
          <p>
            I&apos;m YoYu Chen, a software engineer based in Taiwan. My mission
            is simple: <strong>solve problems</strong>.
          </p>

          <p>
            I build the tools that teams rely on every day. My work spans the
            full stack — from interactive, performance-sensitive browser
            interfaces to server-side rendering pipelines — but it always starts
            with the same question:{" "}
            <em>what&apos;s the actual problem here?</em>
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2>What I Build</h2>

          <h3>Complex Front-End Applications</h3>
          <p>
            I specialise in building rich, interactive web applications that push
            the boundaries of what browsers can do. Think real-time
            collaboration, sophisticated state management, timeline-based
            interfaces, and pixel-perfect rendering — all running smoothly in
            the browser.
          </p>
          <p>
            This kind of work requires careful thinking about state management,
            render performance, and the boundary between declarative UI and
            imperative operations. It&apos;s the kind of problem I love:
            technically deep, architecturally interesting, and directly impactful
            for users.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <h3>Server-Side Solutions</h3>
          <p>
            On the server side, I build the infrastructure that powers complex
            workflows. This includes rendering pipelines, data orchestration, and
            APIs that bridge the gap between backend services and frontend
            experiences. The challenge is making complex systems feel simple and
            reliable.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <h3>Architecture &amp; Developer Experience</h3>
          <p>
            I care deeply about code quality and developer experience. I practice
            TDD not as dogma, but as a tool for thinking clearly about design. I
            refactor aggressively when the architecture no longer serves the
            problem. I write code that future developers (including future me)
            can read and reason about.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h2>How I Work</h2>
          <p>
            I&apos;m not married to any particular technology. My primary stack
            is TypeScript, React, Next.js, and Node.js, but I reach for whatever
            tool best fits the problem. I&apos;ve learned that the most valuable
            skill in software engineering isn&apos;t knowing a framework —
            it&apos;s knowing how to break down a messy problem into clear,
            solvable pieces.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h2>Values</h2>
          <p>Two things guide my work:</p>
          <ul>
            <li>
              <strong>Integrity</strong> — I say what I mean, deliver what I
              promise, and flag problems early. No surprises.
            </li>
            <li>
              <strong>Curiosity</strong> — I&apos;m drawn to problems I
              don&apos;t yet know how to solve. That discomfort is where the best
              work happens.
            </li>
          </ul>
        </FadeIn>
      </div>
    </div>
  );
}
