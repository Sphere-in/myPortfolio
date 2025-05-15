"use client";

import Start from "./Start/page";
import Component from "./About/page";
import ProjectsPage from "./Projects/page";
import ContactPage from "./Contact/page";
import MouseMoveEffect from "../../components/ui/mouse-move-effect";
import { EvervaultCard } from "@/components/ui/enervault-card";

export default function Home() {
  return (

    <div className="font-sans  flex flex-col bg-cover bg-center">
        <main className="flex-grow flex flex-col justify-center items-center bg-opacity-90">
          <section id="home" className="w-full">

            <Start />
          </section>
          <section id="about" className="w-full">
            <Component />
          </section>
          <section id="projects" className="w-full">
            <ProjectsPage />
          </section>
          <section id="contact" className="w-full ">
            <ContactPage />
          </section>
        </main>
        <MouseMoveEffect/>
      </div>

  );
}

