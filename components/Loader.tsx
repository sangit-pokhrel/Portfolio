import { site } from "@/content/site";

export default function Loader() {
  return (
    <div className="loader" data-loader aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-count"><span data-loader-count>0</span></div>
        <div className="text-eyebrow loader-eyebrow">{site.since}</div>
      </div>
    </div>
  );
}
