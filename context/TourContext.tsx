
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TourStep } from '../types';
import { api } from '../services/mockData';


interface TourContextType {
    isTourActive: boolean;
    currentStep: number;
    startTour: () => void;
    stopTour: () => void;
    nextStep: () => void;
    steps: TourStep[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isTourActive, setIsTourActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<TourStep[]>([]);

    useEffect(() => {
        api.fetchTourSteps().then(setSteps);
    }, []);

    const startTour = () => {
        setCurrentStep(0);
        setIsTourActive(true);
    };

    const stopTour = () => {
        setIsTourActive(false);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            stopTour();
        }
    };

    const value = {
        isTourActive,
        currentStep,
        startTour,
        stopTour,
        nextStep,
        steps
    };

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (context === undefined) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
};
