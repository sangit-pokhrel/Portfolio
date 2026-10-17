import { site } from "@/content/site";
import { listImages, portraitSrc, publicFileExists } from "@/lib/images";
import StoryWidget from "./StoryWidget";

/* Checks on the server whether the recording exists, then renders the widget. */
export default function Story() {
  const { src, ...text } = site.story;
  // face photo for the avatar: public/images/me/avatar.* (falls back to the portrait)
  const avatar = listImages("me").find((u) => /\/avatar\./i.test(u)) ?? portraitSrc() ?? "";
  return <StoryWidget src={src} avatar={avatar} available={publicFileExists(src)} text={text} />;
}
