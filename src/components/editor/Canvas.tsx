import { useRef, useState, useEffect } from "react";

type Props = {
    color: string;
    tool: 'pen' | 'eraser';
};

const Canvas: React.FC<Props> = ({ color, tool }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineWidth = 5;
                setCtx(context);
            }
        }
    }, []);

    useEffect(() => {
        if (ctx) {
            ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        }
    }, [color, tool, ctx]);

    const startDrawing = (e: React.MouseEvent) => {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !ctx) return;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctx?.closePath();
    };

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: '1px solid black', background: '#ffffff' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
        />
    );
};

export default Canvas;