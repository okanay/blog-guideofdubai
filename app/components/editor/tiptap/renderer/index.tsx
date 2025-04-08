import { RenderMarks } from "./marks";
import { RenderNode } from "./nodes";

export const RenderNodes = (nodes: any[]): React.ReactNode => {
  if (!nodes) return null;
  return nodes.map((node, index) => {
    // Text nodeları için özel işlem
    if (node.type === "text") {
      return <RenderText key={index} node={node} />;
    }
    // Diğer nodelar için normal render
    return (
      <RenderNode key={index} node={node} children={renderChildNodes(node)} />
    );
  });
};

// Bir nodun alt nodelarını render etmek için
const renderChildNodes = (node: any): React.ReactNode => {
  return node.content ? RenderNodes(node.content) : null;
};

// Text nodeları için özel render component
const RenderText: React.FC<{ node: any }> = ({ node }) => {
  return RenderMarks(node, node.text);
};

// Ana renderer component
export const RenderJSON: React.FC<{ json: any }> = ({ json }) => {
  if (!json || json.type !== "doc" || !json.content) {
    console.error("Geçersiz Tiptap JSON yapısı!");
    return null;
  }

  return <>{RenderNodes(json.content)}</>;
};
