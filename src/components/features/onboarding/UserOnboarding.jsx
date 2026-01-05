import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    TextField,
    Button,
    Chip,
    Stack,
    CircularProgress,
    InputAdornment,
    useTheme
} from '@mui/material';
import {
    Check,
    Close,
    ArrowForward,
    ArrowBack,
    Code,
    EmojiEvents,
    School,
    Rocket,
    WorkOutline
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Goals options
const GOALS = [
    { id: 'practice', label: 'Practice coding', icon: '💻', color: '#6366f1' },
    { id: 'placements', label: 'Prepare for placements', icon: '🎯', color: '#22c55e' },
    { id: 'interviews', label: 'Ace technical interviews', icon: '🏆', color: '#f59e0b' },
    { id: 'learn', label: 'Learn new technologies', icon: '📚', color: '#8b5cf6' },
    { id: 'portfolio', label: 'Build portfolio projects', icon: '🚀', color: '#ec4899' },
];

// Skills options (matching existing topics)
const SKILLS = [
    { id: 'javascript', label: 'JavaScript', color: '#f7df1e' },
    { id: 'python', label: 'Python', color: '#3776ab' },
    { id: 'java', label: 'Java', color: '#ed8b00' },
    { id: 'cpp', label: 'C++', color: '#00599c' },
    { id: 'react', label: 'React', color: '#61dafb' },
    { id: 'nodejs', label: 'Node.js', color: '#339933' },
    { id: 'data-structures', label: 'Data Structures', color: '#6366f1' },
    { id: 'algorithms', label: 'Algorithms', color: '#8b5cf6' },
    { id: 'system-design', label: 'System Design', color: '#ec4899' },
    { id: 'machine-learning', label: 'Machine Learning', color: '#10b981' },
    { id: 'web-development', label: 'Web Development', color: '#f59e0b' },
    { id: 'mobile-dev', label: 'Mobile Dev', color: '#06b6d4' },
    { id: 'devops', label: 'DevOps', color: '#ef4444' },
    { id: 'database', label: 'Database', color: '#6b7280' },
    { id: 'cloud-computing', label: 'Cloud Computing', color: '#3b82f6' },
];

const UserOnboarding = ({ open, onComplete }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Step state
    const [step, setStep] = useState(1);

    // Form state
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Validation state
    const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debounced username check
    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameStatus({ checking: false, available: null, message: '' });
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
        if (!usernameRegex.test(username)) {
            setUsernameStatus({
                checking: false,
                available: false,
                message: 'Only letters, numbers, underscores, and hyphens allowed'
            });
            return;
        }

        const timer = setTimeout(async () => {
            setUsernameStatus({ checking: true, available: null, message: '' });
            try {
                const res = await axios.post(`${API_URL}/onboarding/check-username`, { username });
                setUsernameStatus({
                    checking: false,
                    available: res.data.available,
                    message: res.data.message
                });
            } catch (error) {
                setUsernameStatus({
                    checking: false,
                    available: false,
                    message: 'Error checking username'
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    // Toggle goal selection
    const toggleGoal = (goalId) => {
        setSelectedGoals(prev =>
            prev.includes(goalId)
                ? prev.filter(id => id !== goalId)
                : [...prev, goalId]
        );
    };

    // Toggle skill selection
    const toggleSkill = (skillId) => {
        setSelectedSkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        );
    };

    // Validation
    const canProceedStep1 = username.length >= 3 &&
        usernameStatus.available === true &&
        firstName.trim().length > 0 &&
        lastName.trim().length > 0;

    const canProceedStep2 = selectedGoals.length > 0;
    const canProceedStep3 = selectedSkills.length > 0;

    // Handle submit
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${API_URL}/onboarding/complete`,
                {
                    username,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    goals: selectedGoals,
                    skills: selectedSkills
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) {
                onComplete(res.data.user);
            }
        } catch (error) {
            console.error('Onboarding error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Card style
    const cardSx = {
        background: isDark ? '#1a1a1f' : '#ffffff',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        borderRadius: '16px',
        p: 0,
        overflow: 'hidden'
    };

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    ...cardSx,
                    maxHeight: '90vh',
                    m: 2
                }
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                {/* Header */}
                <Box sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" fontWeight={700}>
                        {step === 1 && 'What should we call you?'}
                        {step === 2 && 'What are you here for?'}
                        {step === 3 && 'Where would you like to upskill?'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {step === 1 && 'Set up your profile'}
                        {step === 2 && 'Select your goals (choose one or more)'}
                        {step === 3 && 'Select the skills you want to improve'}
                    </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ p: 3, minHeight: 300 }}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <Stack spacing={3}>
                            <TextField
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                fullWidth
                                placeholder="e.g., shadow_dev"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {usernameStatus.checking && <CircularProgress size={20} />}
                                            {usernameStatus.available === true && <Check color="success" />}
                                            {usernameStatus.available === false && <Close color="error" />}
                                        </InputAdornment>
                                    )
                                }}
                                helperText={usernameStatus.message || 'At least 3 characters. Letters, numbers, underscores, and hyphens only.'}
                                error={usernameStatus.available === false}
                                color={usernameStatus.available === true ? 'success' : undefined}
                            />
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                placeholder="e.g., John"
                            />
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                placeholder="e.g., Doe"
                            />
                        </Stack>
                    )}

                    {/* Step 2: Goals */}
                    {step === 2 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {GOALS.map((goal) => {
                                const isSelected = selectedGoals.includes(goal.id);
                                return (
                                    <Chip
                                        key={goal.id}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <span>{goal.icon}</span>
                                                <span>{goal.label}</span>
                                            </Box>
                                        }
                                        onClick={() => toggleGoal(goal.id)}
                                        sx={{
                                            py: 2.5,
                                            px: 1,
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            borderRadius: '12px',
                                            border: '2px solid',
                                            borderColor: isSelected ? goal.color : 'transparent',
                                            bgcolor: isSelected
                                                ? `${goal.color}15`
                                                : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                                            color: isSelected ? goal.color : 'text.primary',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: `${goal.color}20`,
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}

                    {/* Step 3: Skills */}
                    {step === 3 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {SKILLS.map((skill) => {
                                const isSelected = selectedSkills.includes(skill.id);
                                return (
                                    <Chip
                                        key={skill.id}
                                        label={skill.label}
                                        onClick={() => toggleSkill(skill.id)}
                                        sx={{
                                            py: 2,
                                            px: 0.5,
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            borderRadius: '10px',
                                            border: '2px solid',
                                            borderColor: isSelected ? skill.color : 'transparent',
                                            bgcolor: isSelected
                                                ? `${skill.color}15`
                                                : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                                            color: isSelected ? skill.color : 'text.primary',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: `${skill.color}20`,
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Back button */}
                    {step > 1 ? (
                        <Button
                            onClick={() => setStep(s => s - 1)}
                            startIcon={<ArrowBack />}
                            sx={{ color: 'text.secondary' }}
                        >
                            Back
                        </Button>
                    ) : (
                        <Box />
                    )}

                    {/* Step indicator */}
                    <Typography variant="caption" color="text.secondary">
                        Step {step} of 3
                    </Typography>

                    {/* Continue/Finish button */}
                    {step < 3 ? (
                        <Button
                            variant="contained"
                            onClick={() => setStep(s => s + 1)}
                            endIcon={<ArrowForward />}
                            disabled={
                                (step === 1 && !canProceedStep1) ||
                                (step === 2 && !canProceedStep2)
                            }
                            sx={{
                                borderRadius: '10px',
                                px: 3,
                                py: 1,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:disabled': {
                                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!canProceedStep3 || isSubmitting}
                            sx={{
                                borderRadius: '10px',
                                px: 3,
                                py: 1,
                                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                                '&:disabled': {
                                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Finish'}
                        </Button>
                    )}
                </Box>

                {/* Terms */}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        textAlign: 'center',
                        pb: 2,
                        px: 3
                    }}
                >
                    By completing this onboarding, you agree to our Terms and Privacy Policy.
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default UserOnboarding;
