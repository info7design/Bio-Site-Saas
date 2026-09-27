import DemoEditor from "../DemoEditor";
import { mockBlocks } from "../mock-data";

export default function DemoEditorPage() {
  return <DemoEditor initialBlocks={mockBlocks()} />;
}
