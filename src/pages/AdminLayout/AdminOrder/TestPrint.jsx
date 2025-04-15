// src/pages/AdminLayout/AdminOrder/TestPrint.jsx
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const TestPrint = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => {
            console.log("Giá trị componentRef.current trong TestPrint:", componentRef.current); // Thêm dòng này
            return componentRef.current;
        },
    });

    return (
        <div>
            <div ref={componentRef} style={{ padding: '20px', border: '1px solid black' }}>
                <h1>Đây là Component In Thử Nghiệm</h1>
                <p>Nội dung này sẽ được in ra.</p>
                <ul>
                    <li>Mục 1</li>
                    <li>Mục 2</li>
                    <li>Mục 3</li>
                </ul>
            </div>
            <button onClick={handlePrint}>In Thử Nghiệm</button>
        </div>
    );
};

export default TestPrint;