type Props = {
    color: string;
    setColor: (color: string) => void;
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
};

const DrawingToolbar: React.FC<Props> = ({ color, setColor, tool, setTool }) => {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setColor('#ff0000')}>🔴 Red</button>
            <button onClick={() => setColor('#0000ff')}>🔵 Blue</button>
            <button onClick={() => setTool(tool === 'pen' ? 'eraser' : 'pen')}>
                {tool === 'pen' ? '🧽 Eraser' : '✏️ Pen'}
            </button>
        </div>
    );
};

export default DrawingToolbar;