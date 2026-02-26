/**
 * Error Boundary Component
 *
 * Catches React errors in demo components and displays a fallback UI.
 */

'use client';

import { Component, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { logger } from '@/utils/logger/logger.utils';

type ErrorBoundaryPropsType = {
    children: ReactNode;
};

type ErrorBoundaryStateType = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryPropsType, ErrorBoundaryStateType> {
    constructor(props: ErrorBoundaryPropsType) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryStateType {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        void logger.error({ message: 'Error caught by boundary', error, context: { componentStack: errorInfo.componentStack } });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 400,
                        p: 3,
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
                        <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Typography>
                        <Button variant="contained" onClick={this.handleReset}>
                            Try Again
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}
