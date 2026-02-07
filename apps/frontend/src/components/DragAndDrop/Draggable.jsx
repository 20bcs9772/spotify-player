import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";

export const Draggable = ({ id, children, className }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(className, isDragging && "opacity-50 shadow-2xl")}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
