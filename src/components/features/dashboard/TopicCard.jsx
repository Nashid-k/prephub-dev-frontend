import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip, LinearProgress, useTheme } from '@mui/material';
import { CheckCircle, PlayArrow, MenuBook, ArrowForward } from '@mui/icons-material';
import { getTopicColor, getTopicImage } from '../../../utils/topicMetadata';

/**
 * TopicCard - Performance-optimized version
 * 
 * Removed: backdrop-filter blur, Framer Motion, infinite animations
 * Kept: Clean design, hover effects, progress indicators
 */
const TopicCard = (props) => {
    const { topic, reduced = false, variant } = props;
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const progress = topic.progress || 0;
    const topicColor = getTopicColor(topic.slug, isDark);

    // Shared card base styles - NO BLUR
    const cardBase = {
        textDecoration: 'none',
        borderRadius: '20px',
        background: isDark ? '#1a1a1f' : '#ffffff',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: isDark
                ? `0 12px 32px rgba(0,0,0,0.4)`
                : `0 12px 32px ${topicColor}15`,
            borderColor: `${topicColor}40`,
        }
    };

    // List variant (compact)
    if (variant === 'list') {
        return (
            <Card
                component={Link}
                to={props.customLink || topic.customLink || `/topic/${topic.slug}`}
                sx={{
                    ...cardBase,
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    gap: 2.5,
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        background: `${topicColor}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <img
                        src={getTopicImage(topic.slug)}
                        alt={topic.name}
                        style={{ width: 28, height: 28, objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {topic.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {topic.description}
                    </Typography>
                </Box>

                {/* Progress */}
                {progress > 0 && (
                    <Box sx={{ width: 80, display: { xs: 'none', md: 'block' } }}>
                        <Typography variant="caption" color={topicColor} fontWeight={700}>
                            {progress}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 2,
                                    bgcolor: topicColor
                                }
                            }}
                        />
                    </Box>
                )}

                <ArrowForward sx={{ color: topicColor, fontSize: 20 }} />
            </Card>
        );
    }

    // Default grid card
    return (
        <Card
            component={Link}
            to={props.customLink || topic.customLink || `/topic/${topic.slug}`}
            sx={{
                ...cardBase,
                height: '100%',
                minHeight: { xs: 280, md: 320 },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Accent bar at top */}
            <Box
                sx={{
                    height: 4,
                    background: `linear-gradient(90deg, ${topicColor}, ${topicColor}80)`,
                }}
            />

            <CardContent sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%'
            }}>
                {/* Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '20px',
                            background: `${topicColor}10`,
                            border: `2px solid ${topicColor}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <img
                            src={getTopicImage(topic.slug)}
                            alt={topic.name}
                            style={{ width: '55%', height: '55%', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </Box>
                </Box>

                {/* Title & Description */}
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {topic.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {topic.description}
                    </Typography>
                </Box>

                {/* Chips */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Chip
                        icon={<MenuBook sx={{ fontSize: 14 }} />}
                        label={`${topic.categoryCount || 0} Chapters`}
                        size="small"
                        sx={{
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        }}
                    />
                    {progress > 0 && (
                        <Chip
                            icon={progress === 100 ? <CheckCircle sx={{ fontSize: 14 }} /> : <PlayArrow sx={{ fontSize: 14 }} />}
                            label={progress === 100 ? 'Done' : `${progress}%`}
                            size="small"
                            sx={{
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                bgcolor: progress === 100 ? '#22c55e20' : `${topicColor}15`,
                                color: progress === 100 ? '#22c55e' : topicColor,
                            }}
                        />
                    )}
                </Box>

                {/* Progress bar */}
                {progress > 0 && (
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: `linear-gradient(90deg, ${topicColor}, ${topicColor}cc)`,
                            }
                        }}
                    />
                )}

                {/* CTA */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        mt: 'auto',
                        pt: 1,
                        color: topicColor,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                    }}
                >
                    <span>{progress > 0 ? 'Continue' : 'Start Learning'}</span>
                    <ArrowForward sx={{ fontSize: 18 }} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default React.memo(TopicCard, (prev, next) => {
    return (
        prev.topic._id === next.topic._id &&
        prev.topic.progress === next.topic.progress &&
        prev.topic.categoryCount === next.topic.categoryCount
    );
});
