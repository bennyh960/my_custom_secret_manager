import React, { ReactNode, useRef, useState } from "react";
import { Tag } from "../../contexts/secretContext/types";

const LONG_PRESS_DURATION = 500; // ms

const DrawTags = ({
  tagsData,
  onClick,
  selectedTags,
  onRightClickActions,
}: {
  onClick?: (tagName: string) => void;
  tagsData: Tag[];
  selectedTags?: string[]; // NEW (optional!)
  onRightClickActions?: { cb: (tag: Tag) => void; label: string | ReactNode }[];
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tag?: Tag } | null>(null);
  const touchTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const handleRightClick = (tag: Tag, event: React.MouseEvent<HTMLSpanElement>) => {
    if (!onRightClickActions?.length) return;

    event.preventDefault(); // prevent default browser context menu
    setContextMenu({ x: event.clientX, y: event.clientY, tag });
  };

  const closeMenu = () => setContextMenu(null);

  //#region Mobile Touch Support
  const handleTouchStart = (tag: Tag, e: React.TouchEvent<HTMLSpanElement>) => {
    if (!onRightClickActions?.length) return;
    // Don't prevent default here if you want normal tap (onClick) to work after touch end
    // But since we are trying to trigger long press, preventing default is common practice
    // E.preventDefault is kept to allow long press (context menu) to work reliably
    e.preventDefault();

    // Clear any previous timer in case of overlapping touches, though unlikely with useRef
    const previousTimer = touchTimers.current[tag.name];
    if (previousTimer) clearTimeout(previousTimer);

    const timer = setTimeout(() => {
      setContextMenu({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        tag,
      });
      // OPTIONAL: Prevent default click from firing after long press
      // However, the touchEnd clearing the timer handles the tap vs long press differentiation
    }, LONG_PRESS_DURATION);

    // Save the timer so we can clear it on touch end
    touchTimers.current[tag.name] = timer;
  };

  const handleTouchEnd = (tag: Tag) => {
    // console.log("Touch end for tag:", tag.name);
    const timer = touchTimers.current[tag.name];
    if (timer) {
      clearTimeout(timer);
      delete touchTimers.current[tag.name]; // Clean up the ref
    }
    // If the timer was NOT cleared (i.e., long press occurred), we rely on
    // the context menu's touch-to-close logic now.
  };
  //#endregion

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="hidden">
          bg-yellow-100 text-yellow-700 border-yellow-300 bg-violet-100 text-violet-700 border-violet-300 bg-pink-100
          text-pink-700 border-pink-300 bg-indigo-100 text-indigo-700 border-indigo-300 bg-teal-100 text-teal-700
          border-teal-300 bg-orange-100 text-orange-700 border-orange-300
        </div>
        {/* ... tags rendering ... */}
        {tagsData.map((tag) => {
          const isSelected = selectedTags?.includes(tag.name);

          return (
            <span
              key={tag.name}
              title={tag.name}
              onContextMenu={(e) => handleRightClick(tag, e)}
              onTouchStart={(e) => handleTouchStart(tag, e)}
              onTouchEnd={() => handleTouchEnd(tag)}
              onClick={() => onClick?.(tag.name)}
              className={`
              inline-flex items-center px-4 py-1 text-xs font-medium border shadow-sm
              bg-${tag.color}-100 text-${tag.color}-700 border-${tag.color}-300
              transition-all cursor-pointer select-none

              ${isSelected ? "opacity-70 ring-2 ring-offset-1 ring-" + tag.color + "-400" : ""}
            `}
            >
              {tag.name}
            </span>
          );
        })}
      </div>

      {/* Custom right-click menu and Mobile Close Overlay */}
      {contextMenu && onRightClickActions?.length && (
        // New full-screen overlay to catch clicks/touches outside the menu
        <div
          className="fixed inset-0 z-40" // z-40 is behind z-50 menu
          onClick={closeMenu} // Closes on tap/click anywhere outside the menu on mobile/desktop
          onTouchStart={closeMenu} // Explicitly handle touch start for mobile
        >
          <div
            className="absolute bg-white shadow-lg border rounded z-50 p-2 flex flex-col gap-1"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            // We use onMouseLeave for desktop and the parent div for all clicks/touches
            onMouseLeave={closeMenu}
            // Important: Stop event propagation inside the menu so clicking a menu item
            // doesn't immediately close the menu via the parent overlay's handler.
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {onRightClickActions.map((action, index) => (
              <button
                key={index}
                className={`text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded text-left flex items-center gap-2 w-full`}
                onClick={(e) => {
                  action.cb(contextMenu.tag!);
                  closeMenu();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DrawTags;
