import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Experience from "@/components/Experience";
import Story from "@/components/Story";
import BackToTop from "@/components/BackToTop";
import Docs from "@/components/Docs";
import Contours from "@/components/Contours";
import Hero from "@/components/sections/Hero";
import Signature from "@/components/sections/Signature";
import Legacy from "@/components/sections/Legacy";
import DarkGroup from "@/components/DarkGroup";
import Gallery from "@/components/sections/Gallery";
import Split from "@/components/sections/Split";
import Projects from "@/components/sections/Projects";
import Featured from "@/components/sections/Featured";
import Stack from "@/components/sections/Stack";
import Socials from "@/components/sections/Socials";
import Footer from "@/components/sections/Footer";
import { TapeBand, CrossBands, OutroBand } from "@/components/sections/Bands";

export default function Home() {
  return (
    <>
      <Loader />
      <Contours seed={7} className="page-contours" />
      <Nav />
      <main id="top">
        <Hero />
        <DarkGroup>
          <Signature />
          <Legacy />
          <Gallery />
        </DarkGroup>
        <TapeBand />
        <Split />
        <div className="s-group bg-tint" data-theme-nav="dark">
          <Projects />
        </div>
        <CrossBands />
        <Featured />
        <Stack />
        <Socials />
        <OutroBand />
      </main>
      <Footer />
      <Story />
      <BackToTop />
      <Docs />
      <Experience />
    </>
  );
}
