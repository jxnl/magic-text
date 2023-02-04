import { motion, AnimatePresence } from "framer-motion";
import { PromptType } from "./prompt";

export const minSelectionLength = 50;

export function Warning({ isWarn }: { isWarn: boolean }) {
  return (
    <AnimatePresence>
      {isWarn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-6 my-4"
          role="alert"
        >
          <p className="font-bold">Selection too short</p>
          <p>
            In order for magic text to work well we will need more than{" "}
            {minSelectionLength}
            &nbsp; characters selected.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BrushMenu({
  isLoading,
  onClick,
  isOpen,
}: {
  isLoading: boolean;
  onClick: any;
  isOpen: boolean;
}) {
  // this is a function component that returns a single button for each brush
  function BrushButton({
    key,
    promptType,
  }: {
    key: number;
    promptType: string;
  }) {
    return (
      <motion.button
        key={key}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        className="mr-2 rounded-lg px-4 py-2 text-sm shadow-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        onClick={(e) => {
          onClick(e, PromptType[promptType as keyof typeof PromptType]);
        }}
      >
        {promptType}
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className=" bg-gray-50 shadow-lg rounded-md p-6 my-4 max-w-none border-2 border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="group"
        >
          <h2 className="text-sm font-medium mb-1">Text Brushes</h2>
          <p className="text-sm text-gray-600 mb-4">
            Apply any brush to the text you&apos;ve selected to use text magic
            to improve your writing instantly.
          </p>
          <div>
            {Object.keys(PromptType).map((promptType, idx) => (
              <BrushButton key={idx} promptType={promptType} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
