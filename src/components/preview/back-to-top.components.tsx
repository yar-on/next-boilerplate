/**
 * Back to Top Button Component
 *
 * Floating action button that appears after scrolling 500px.
 * Smoothly scrolls the page back to the top when clicked.
 */

'use client';

import { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Zoom in={isVisible}>
            <Fab
                color="primary"
                size="small"
                aria-label="Back to top"
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 80, // Offset from theme button
                    zIndex: 1200,
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
}
