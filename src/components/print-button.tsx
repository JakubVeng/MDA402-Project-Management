'use client';

import React, { useState, useEffect } from "react";
import {Printer} from "lucide-react";


const PrintButton = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button onClick={handlePrint} className="p-2 text-blue-500 hover:text-blue-700 font-semibold">
            <Printer className="w-6 h-6"/>
        </button>
    );
}

export default PrintButton;
