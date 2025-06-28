// DrawingCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import NicknameInput from './NickNameInput';
import CursorOverlay from './CursorOverlay';

type Props = {
    color: string;
    tool: 'pen' | 'eraser'
}

const socket = io('http://localhost:3001', {
    transports: ['websocket'] // pollin 사용 방지
}); // Nest 서버와 연결

type DrawEvent = {
    x: number;
    y: number;
    type: 'start' | 'draw' | 'end';
    color: string;
    tool: 'pen' | 'eraser';
};

const Canvas = ({ color, tool }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [nickname, setNickname] = useState("??");

    const [cursors, setCursors] = useState<{ [id: string]: { x: number; y: number; nickname: string } }>({});

    useEffect(() => {
        socket.on('cursor_move', ({ x, y, nickname, socketId }) => {
            setCursors(prev => ({
                ...prev,
                [socketId]: { x, y, nickname }
            }));
        });

        return () => {
            socket.off('cursor_move');
        };
    }, []);

    useEffect(() => {
        if(nickname) {
            socket.emit("set_nickname", nickname);
        }
    }, [nickname]);

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineWidth = 5;
                setCtx(context);

                // 서버에서 draw 이벤트 수신
                socket.on('draw', handleRemoteDraw(context));
            }
        }

        return () => {
            socket.off('draw', handleRemoteDraw);
        };
    }, []);

    const emitDraw = (x: number, y: number, type: 'start' | 'draw' | 'end') => {
        const data: DrawEvent = { x, y, type, color, tool };
        socket.emit('draw', data);
    };

    const handleRemoteDraw = (ctx: CanvasRenderingContext2D) => (data: DrawEvent) => {
        const { x, y, type, color, tool } = data;
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

        if (type === 'start') {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (type === 'draw') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.closePath();
        }
    };


    const startDrawing = (e: React.MouseEvent) => {
        if (!ctx) return;
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        emitDraw(x, y, 'start');
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !ctx) return;
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
        emitDraw(x, y, 'draw');
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctx?.closePath();
        emitDraw(0, 0, 'end');
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        // 본인이 그리는 중이면 선도 그림
        if (isDrawing && ctx) {
            draw(e);
        }

        // 실시간 커서 위치 서버로 전송
        socket.emit('cursor_move', { x, y, nickname });
    };

    const changeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        setNickname(target.value);
    }


    return (
        <>
            <NicknameInput nickname={nickname} onChange={changeNickname} />
            <CursorOverlay cursors={cursors} />

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: '1px solid black', background: '#ffffff' }}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
        </>
    );
};

export default Canvas;
