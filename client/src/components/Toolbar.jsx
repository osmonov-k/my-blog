import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $createParagraphNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (level) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(`h${level}`));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatText = (style) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(style);
      }
    });
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url !== null) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
      <button
        onClick={formatParagraph}
        className="px-3 py-1 rounded hover:bg-gray-200"
        title="Normal text"
      >
        Paragraph
      </button>
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          onClick={() => formatHeading(level)}
          className="px-3 py-1 rounded hover:bg-gray-200 font-bold"
          title={`Heading ${level}`}
        >
          H{level}
        </button>
      ))}
      <button
        onClick={() => formatText({ bold: true })}
        className="px-3 py-1 rounded hover:bg-gray-200 font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => formatText({ italic: true })}
        className="px-3 py-1 rounded hover:bg-gray-200 italic"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => formatText({ underline: true })}
        className="px-3 py-1 rounded hover:bg-gray-200 underline"
        title="Underline"
      >
        U
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className="px-3 py-1 rounded hover:bg-gray-200"
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className="px-3 py-1 rounded hover:bg-gray-200"
        title="Numbered List"
      >
        1. List
      </button>
      <button
        onClick={insertLink}
        className="px-3 py-1 rounded hover:bg-gray-200"
        title="Insert Link"
      >
        Link
      </button>
    </div>
  );
}
