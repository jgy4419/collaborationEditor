// CursorOverlay.tsx
import React from 'react';

type Cursors = {
    [id: string]: { x: number; y: number; nickname: string };
};

type Props = {
    cursors: Cursors;
};

const CursorOverlay: React.FC<Props> = ({ cursors }) => {
    return (
        <>
            {Object.entries(cursors).map(([id, { x, y, nickname }]) => (
                <div
                    key={id}
                    style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        pointerEvents: 'none',
                        fontSize: 12,
                        background: 'rgba(0, 0, 0, 1)',
                        border: '1px solid gray',
                        color: '#fff',
                        padding: '2px 4px',
                        borderRadius: 4,
                        transform: 'translate(-50%, -100%)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    🖱️ {nickname}
                </div>
            ))}
        </>
    );
};

export default CursorOverlay;
