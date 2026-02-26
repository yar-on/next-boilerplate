/**
 * Floating Theme Button Component
 *
 * Draggable floating action button that toggles the theme menu.
 * Position is persisted to localStorage.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Palette from '@mui/icons-material/Palette';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { ButtonPositionType } from '@/types/preview.types';
import { STORAGE_KEYS } from '@/constants/preview.constants';
import { getDefaultButtonPosition, constrainPositionToViewport, isPositionInViewport } from '@/utils/preview.utils';
import { logger } from '@/utils/logger/logger.utils';

// Time threshold (in ms) to distinguish between click and drag
const PRESS_HOLD_THRESHOLD = 100;

type FloatingThemeButtonPropsType = {
    isHidden: boolean;
    onClick: () => void;
};

export function FloatingThemeButton({ isHidden, onClick }: FloatingThemeButtonPropsType) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Initialize position lazily from localStorage
    const [position, setPosition] = useState<ButtonPositionType>(() => {
        if (typeof window === 'undefined') {
            return getDefaultButtonPosition();
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEYS.BUTTON_POSITION);
            if (stored) {
                const parsed: unknown = JSON.parse(stored);

                // Validate it's a valid position object
                if (parsed && typeof parsed === 'object' && 'x' in parsed && 'y' in parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                    const position = parsed as ButtonPositionType;

                    // Check if position is valid, if not use default
                    if (isPositionInViewport(position)) {
                        return position;
                    }

                    // Position is off-screen, constrain it
                    const constrained = constrainPositionToViewport(position);
                    localStorage.setItem(STORAGE_KEYS.BUTTON_POSITION, JSON.stringify(constrained));
                    return constrained;
                }
            }
        } catch (error) {
            void logger.error({ message: 'Failed to load button position', error });
        }

        return getDefaultButtonPosition();
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isPressing, setIsPressing] = useState(false);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pressStartRef = useRef<{ x: number; y: number } | null>(null);

    // Save position to localStorage
    const savePosition = useCallback((newPosition: ButtonPositionType) => {
        try {
            localStorage.setItem(STORAGE_KEYS.BUTTON_POSITION, JSON.stringify(newPosition));
        } catch (error) {
            void logger.error({ message: 'Failed to save button position', error });
        }
    }, []);

    // Handle mouse down (start press timer)
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (isMobile) {
                return;
            } // Disable drag on mobile

            e.preventDefault();
            e.stopPropagation();

            setIsPressing(true);
            pressStartRef.current = { x: e.clientX, y: e.clientY };
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });

            // Start timer - enable dragging after threshold
            pressTimerRef.current = setTimeout(() => {
                setIsDragging(true);
                setIsPressing(false);
            }, PRESS_HOLD_THRESHOLD);
        },
        [isMobile, position]
    );

    // Handle mouse move (dragging) and mouse up
    useEffect(() => {
        if (!isDragging && !isPressing) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Only allow dragging if drag mode is enabled
            if (isDragging) {
                const newPosition = constrainPositionToViewport({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y,
                });
                setPosition(newPosition);
            }
        };

        const handleMouseUp = () => {
            // Clear the press timer if it's still running
            if (pressTimerRef.current) {
                clearTimeout(pressTimerRef.current);
                pressTimerRef.current = null;
            }

            // If released while pressing (before threshold), treat as click
            if (isPressing) {
                setIsPressing(false);
                onClick();
            }

            // If was dragging, save position
            if (isDragging) {
                setIsDragging(false);
                savePosition(position);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isPressing, dragOffset, position, savePosition, onClick]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (pressTimerRef.current) {
                clearTimeout(pressTimerRef.current);
            }
        };
    }, []);

    // Handle window resize - reposition if off-screen
    useEffect(() => {
        const handleResize = () => {
            if (!isPositionInViewport(position)) {
                const constrained = constrainPositionToViewport(position);
                setPosition(constrained);
                savePosition(constrained);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [position, savePosition]);

    // Don't render if hidden
    if (isHidden) return null;

    const tooltipTitle = isMobile ? 'Open theme settings' : isDragging ? 'Dragging...' : 'Click to open settings • Hold to drag';

    return (
        <Tooltip title={tooltipTitle} placement="left" arrow>
            <Fab
                color="primary"
                aria-label="Open theme settings"
                onClick={isMobile ? onClick : undefined}
                onMouseDown={!isMobile ? handleMouseDown : undefined}
                sx={{
                    position: 'fixed',
                    ...(isMobile
                        ? {
                              // Fixed position on mobile
                              bottom: 16,
                              right: 16,
                          }
                        : {
                              // Draggable position on desktop - using right/bottom for better default
                              right: `${window.innerWidth - position.x - 56}px`,
                              bottom: `${window.innerHeight - position.y - 56}px`,
                              cursor: isDragging ? 'grabbing' : isPressing ? 'pointer' : 'grab',
                          }),
                    zIndex: 1300, // Above most content but below modals
                    transition: isDragging ? 'none' : 'all 0.2s ease',
                }}
            >
                <Palette />
            </Fab>
        </Tooltip>
    );
}
