import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import Canvas from "./components/Canvas";
import {
    getCurrentDiagramName,
    addGadget,
    onBackendEvent,
    offBackendEvent,
} from "./utils/wailsBridge";
import { BackendCanvasProps } from "./utils/createCanvas";

const App: React.FC = () => {
    const [diagramName, setDiagramName] = useState<string | null>(null);
    const [backendData, setBackendData] = useState<BackendCanvasProps | null>(null);

    const handleGetDiagramName = async () => {
        try {
            const name = await getCurrentDiagramName();
            setDiagramName(name);
        } catch (error) {
            console.error("Error fetching diagram name:", error);
        }
    };

    const handleAddGadget = async () => {
        try {
            await addGadget(1, { x: 100, y: 100 });
        } catch (error) {
            console.error("Error adding gadget:", error);
        }
    };

    useEffect(() => {
        onBackendEvent("backend-event", (result) => {
            console.log("Received data from backend:", result);
            setBackendData(result); // 假設 result 是完整的 BackendCanvasProps 結構
        });

        return () => {
            offBackendEvent("backend-event");
        };
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="section">
                <h1>Dr.UML</h1>

                <div style={{ marginBottom: "10px" }}>
                    <button className="btn" onClick={handleGetDiagramName}>
                        Get Diagram Name
                    </button>
                    {diagramName && <p>Diagram Name: {diagramName}</p>}
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <button className="btn" onClick={handleAddGadget}>
                        Load Gadget From Backend
                    </button>
                </div>
            </div>

            {/* Center Section: Canvas */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {backendData && <Canvas backendData={backendData} />}
            </div>
        </DndProvider>
    );
};

export default App;
