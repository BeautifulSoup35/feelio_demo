import styled from '@emotion/styled';
import { modalIn } from '../../styles/animations.js';

const Scrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 220;
  display: grid;
  place-items: center;
  padding: 20px;
  background: var(--scrim);
  backdrop-filter: blur(8px);
`;

const Panel = styled.div`
  width: min(560px, 100%);
  max-height: min(720px, 92vh);
  overflow: auto;
  border-radius: 28px;
  background: var(--modal-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(28px) saturate(1.25);
  animation: ${modalIn} .24s ease;
`;

export function Modal({ children, onClose }) {
  return (
    <Scrim onMouseDown={onClose}>
      <Panel onMouseDown={event => event.stopPropagation()}>
        {children}
      </Panel>
    </Scrim>
  );
}

