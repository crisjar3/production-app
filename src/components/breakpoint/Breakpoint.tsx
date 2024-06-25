"use client";
import React, {useEffect, useState} from "react";

interface BreakPointProps {
    children: React.ReactNode;
}

export default function BreakPoint({children}: Readonly<BreakPointProps>) {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1200);
    };

    useEffect(() => {
        handleResize(); // Check initial size
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    if (isMobile) {
        return (
            <div>Esta aplicación no está disponible para dispositivos móviles.</div>
        );
    }

    return (
        <>
            {children}
        </>
    )

}
