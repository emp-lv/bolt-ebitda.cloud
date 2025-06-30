import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import LiquidGlass from "./liquidGlass";

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
          <LiquidGlass dark={true}>
            <TooltipContent>{content}</TooltipContent>
          </LiquidGlass>
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
  padding: 12px;
  min-width: 280px;
`;

export default Tooltip;
