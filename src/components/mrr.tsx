import React from "react";
import styled from "styled-components";

interface MrrProps {
  value: number;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  position?: "absolute" | "relative";
}

function Mrr({ value, top, right, bottom, left, position }: MrrProps) {
  return (
    <MRRContainer
      $top={top}
      $right={right}
      $bottom={bottom}
      $left={left}
      $position={position}
    >
      <MRRLabel>MRR</MRRLabel>
      <MRRText>
        <span>{value}</span>
        <span>k</span>
      </MRRText>
    </MRRContainer>
  );
}

const MRRContainer = styled.div<{
  $top?: number | string;
  $right?: number | string;
  $bottom?: number | string;
  $left?: number | string;
  $position?: "absolute" | "relative";
}>`
  pointer-events: none;
  padding: 32px;
  font-family: "Luckiest Guy", cursive;
  ${({ $position }) => $position && `position: ${$position};`}
  ${({ $position }) =>
    $position === "absolute" && `transform: translateX(-50%);`}
  ${({ $top }) => $top && `top: ${$top};`}
  ${({ $right }) => $right && `right: ${$right};`}
  ${({ $bottom }) => $bottom && `bottom: ${$bottom};`}
  ${({ $left }) => $left && `left: ${$left};`}
`;

const MRRLabel = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3em;
  top: 48px;
  color: #eff6ea;
  opacity: 0.3;
  text-shadow: 0 0.1em 20px rgba(0, 0, 0, 1), 0.05em -0.03em 0 rgba(0, 0, 0, 1),
    0.05em 0.005em 0 rgba(0, 0, 0, 1), 0em 0.08em 0 rgba(0, 0, 0, 1),
    0.05em 0.08em 0 rgba(0, 0, 0, 1), 0px -0.03em 0 rgba(0, 0, 0, 1),
    -0.03em -0.03em 0 rgba(0, 0, 0, 1), -0.03em 0.08em 0 rgba(0, 0, 0, 1),
    -0.03em 0 0 rgba(0, 0, 0, 1);
`;

const MRRText = styled.div`
  font-size: 8em;
  padding: 32px 32px 0;
  color: rgb(191, 255, 180);
  text-shadow: 0 0.1em 20px rgba(0, 0, 0, 1), 0.05em -0.03em 0 rgba(0, 0, 0, 1),
    0.05em 0.005em 0 rgba(0, 0, 0, 1), 0em 0.08em 0 rgba(0, 0, 0, 1),
    0.05em 0.08em 0 rgba(0, 0, 0, 1), 0px -0.03em 0 rgba(0, 0, 0, 1),
    -0.03em -0.03em 0 rgba(0, 0, 0, 1), -0.03em 0.08em 0 rgba(0, 0, 0, 1),
    -0.03em 0 0 rgba(0, 0, 0, 1);

  span {
    transform: scale(0.9);
    display: inline-block;
  }
  span:first-child {
    font-size: 1.5em;
    z-index: 2;
    animation: bop 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards
      infinite alternate;
  }
  span:last-child {
    color: #f2f3ee;
    animation: bopB 1.5s 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards
      infinite alternate;
  }

  @keyframes bop {
    0% {
      transform: scale(0.9);
    }
    50%,
    100% {
      transform: scale(1);
    }
  }

  @keyframes bopB {
    0% {
      transform: scale(0.9);
    }
    80%,
    100% {
      transform: scale(1) rotateZ(-3deg);
    }
  }
`;

export default Mrr;
