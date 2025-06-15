import React, { ReactNode, useState } from "react";
import styled from "styled-components";

interface TooltipProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: "left" | "right";
}

function Tooltip({ trigger, content, position = "right" }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <TooltipWrapper>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {trigger}
      </div>
      {showTooltip && (
        <TooltipContainer $position={position}>
          <TooltipContent>{content}</TooltipContent>
        </TooltipContainer>
      )}
    </TooltipWrapper>
  );
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inherit;
`;

const TooltipContainer = styled.div<{
  $position: "left" | "right";
}>`
  position: absolute;
  top: 50%;
  ${({ $position }) => ($position === "left" ? "left: -12px;" : "right: -12px;")}
  transform: translate(
    ${({ $position }) => ($position === "left" ? "-100%" : "100%")},
    -50%
  );
  z-index: 20;
`;

const TooltipContent = styled.div`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export default Tooltip;
