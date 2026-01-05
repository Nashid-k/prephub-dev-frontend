import React from 'react';
import { Box, useTheme } from '@mui/material';

/**
 * StaticBackground - Performance-optimized background
 * 
 * Replaces AuroraBackground with a static gradient.
 * Zero animations, zero blur, zero GPU overhead.
 */
const StaticBackground = ({ children, accentColor = '#6366f1' }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                // Simple gradient background - no animations
                background: isDark
                    ? 'linear-gradient(180deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)'
                    : 'linear-gradient(180deg, #fafafa 0%, #f0f0f5 50%, #fafafa 100%)',
                transition: 'background 0.3s ease'
            }}
        >
            {/* Subtle accent glow - static, no animation */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: '10%',
                    width: '40%',
                    height: '40%',
                    background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '5%',
                    width: '35%',
                    height: '35%',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {children}
            </Box>
        </Box>
    );
};

export default StaticBackground;
