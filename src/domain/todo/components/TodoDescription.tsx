import { Button } from "@domain/shared/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const TodoDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowToggle = description.length > 60;
  const displayDescription = shouldShowToggle && !isExpanded ? `${description.slice(0, 60)}...` : description;

  return (
    <div>
      <p className="text-sm text-gray-600 leading-relaxed">{displayDescription}</p>
      {shouldShowToggle && (
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-0 text-xs text-blue-500 hover:text-blue-600 mt-1"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-2 h-2 mr-1" /> 접기
            </>
          ) : (
            <>
              <ChevronDown className="w-2 h-2 mr-1" /> 더보기
            </>
          )}
        </Button>
      )}
    </div>
  );
};
