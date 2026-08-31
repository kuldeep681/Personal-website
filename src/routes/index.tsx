import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Projects } from "@/components/site/projects";
import { HowIThink } from "@/components/site/how-i-think";
import { About } from "@/components/site/about";
import { Lab } from "@/components/site/lab";
import { Contact } from "@/components/site/contact";
import { Kernel } from "@/components/site/kernel";
import { CommandPalette } from "@/components/site/command-palette";

const TITLE = "Kuldeep Mandal — Software Engineer, AI Systems";

const DESC =
  "Kuldeep Mandal is a software engineer in Bengaluru building AI systems, backend services and full-stack products that actually ship.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: TITLE,
      },
      {
        name: "description",
        content: DESC,
      },
      {
        property: "og:title",
        content: TITLE,
      },
      {
        property: "og:description",
        content: DESC,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: Index,
});

function Index() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-transparent">
      <Nav onCommand={() => setPaletteOpen(true)} />

      <main>
        <Hero />
        <Projects />
        <HowIThink />
        <About />
        <Lab />
      </main>

      <Contact />

      <Kernel />

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}
