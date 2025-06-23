import React from 'react';
import styled from 'styled-components';

function LiquidGlass({ children }: { children: React.ReactNode }) {
  return (
    <LiquidGlassWapper>
      {children}
    </LiquidGlassWapper>
  )
}

const LiquidGlassWapper = styled.div`
  min-height: 4em;
  min-width: 4em;
  border-radius: 2em;
  background: #2e2e2e;
`

export default LiquidGlass;
