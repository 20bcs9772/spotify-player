import { useDroppable } from "@dnd-kit/core";
import { cn } from "../../lib/utils";

export const Droppable = ({ id, children, className }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(className, isOver && "bg-[#1DB954]/10 rounded-lg p-2")}
    >
      {children}
    </div>
  );
};
