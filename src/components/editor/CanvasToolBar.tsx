// CanvasToolBar.tsx
import React from 'react';

type Props = {
    color: string;
    setColor: (color: string) => void;
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
};

const CanvasToolBar: React.FC<Props> = ({ color, setColor, tool, setTool }) => {
    return (
        <div style={{ marginBottom: 10 }}>
            <button onClick={() => setColor('#000')}>검정</button>
            <button onClick={() => setColor('#f00')}>빨강</button>
            <button onClick={() => setTool(tool === 'pen' ? 'eraser' : 'pen')}>
                {tool === 'pen' ? '✏️ 펜' : '🧽 지우개'}
            </button>
        </div>
    );
};

export default CanvasToolBar;
