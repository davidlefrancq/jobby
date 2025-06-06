import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IAccordionProps {
  title?: string;
  children: React.ReactNode;
}

export default function Accordion({ children }: IAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full pb-2 overflow-hidden text-base text-wrap">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 focus:outline-none"
      >
        <span
          className="w-full ps-3 pe-3 text-left text-sm font-medium rounded-lg"
          style={{ backgroundColor: `${ isOpen ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }` }}
        >
          Details
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 }
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-4 overflow-hidden"
          >
            <div className="ps-3 pe-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
