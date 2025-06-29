import React from 'react';
import styled from 'styled-components';

export function LiquidGlass({ children }: { children: React.ReactNode }) {
  return (
    <LiquidGlassWapper>
      {children}
    </LiquidGlassWapper>
  )
}
export default LiquidGlass;
const LiquidGlassWapper = styled.div`
  padding: 1rem;
  -webkit-appearance: none;
	-moz-appearance: none;
	overflow: hidden;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
  &:focus {
	  outline: none;
  }
  
  border-radius: 5.1rem 4.9rem;
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(4px); /* fallback if SVG backdrop fails on FF or similar */
  backdrop-filter: url(#filter); 
  -webkit-backdrop-filter: blur(3px);
	box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3),
    inset -2px -2px 2px 1px rgba(255, 255, 255, 0.3), 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);;
	color: rgba(255, 255, 255, 0.8);
	transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.5);
	cursor: pointer;
  &:hover{
	  transform: scale(1.03);
	  border-radius: 4.9rem 5.1rem;
  }  
`

export function LiquidGlassButton({ children, gl, ...props }: { children: React.ReactNode; gl?: boolean;}) {
  return (
    <LiquidButton $gl={gl} {...props}>
      {children}
    </LiquidButton>
  )
}

const LiquidButton = styled.button`
  /* reset */
	display: inline-block;
	border: none;
	margin: 0;
	text-decoration: none;
	padding: 1rem;
	background: none;
	border-radius: 0;
	-webkit-appearance: none;
	-moz-appearance: none;
	overflow: hidden;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
  &:focus {
	  outline: none;
  }

  /* liquid glass - poor man's blur */
	border-radius: 10.2rem 9.8rem;
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(4px);
	box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3),
    inset -2px -2px 2px 1px rgba(255, 255, 255, 0.3), 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);;
	color: rgba(255, 255, 255, 0.8);
	transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.5);
	cursor: pointer;
  &:hover{
	  transform: scale(1.05);
	  border-radius: 9.8rem 10.2rem;
  }
  &:select{
	  transform: scale(0.95);
  }

  /* liquid glass - real deal svg backdrop */
  ${({ gl }) => gl ? `
    backdrop-filter: url(#filter);
	  -webkit-backdrop-filter: blur(3px);
  ` : ``}
`