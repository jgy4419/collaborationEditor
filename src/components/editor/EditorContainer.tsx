import React, { useState } from 'react';
import Canvas from "./Canvas";
import CanvasToolBar from "./CanvasToolBar";

const EditorContainer = () => {
    const [color, setColor] = useState("#000");
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    return (
        <div>
            <Canvas color={color} tool={tool}/>
            <CanvasToolBar color={color} setColor={setColor} tool={tool} setTool={setTool}/>
        </div>
    );
};

export default EditorContainer;