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
         {/* <div className="pointer-events-none fixed inset-0">
        <div className=" inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className=" right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className=" bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div> */}
        {/* <main className="flex-grow flex flex-col justify-center items-center "> */}
          {/* <Navbar/> */}
          
          <section id="home" className="w-full">

            <Start />
            {/* <EvervaultCard/> */}
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

