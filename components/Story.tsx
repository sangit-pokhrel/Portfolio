import { site } from "@/content/site";
import { publicFileExists } from "@/lib/images";
import StoryWidget from "./StoryWidget";

/* Checks on the server whether the recording exists, then renders the widget. */
export default function Story() {
  const { src, ...text } = site.story;
  return <StoryWidget src={src} available={publicFileExists(src)} text={text} />;
}
