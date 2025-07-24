import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Shield, CheckCircle, XCircle, ArrowRight, RefreshCw } from '../components/Icons';
import ProgressTracker from '../components/ProgressTracker';
import TaskCard from '../components/TaskCard';
import { verifyRecaptchaToken } from '../utils/recaptchaVerification';

const CaptchaTask = () => {
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [captchaToken, setCaptchaToken] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [responses, setResponses] = useState([]);
    const [showNextButton, setShowNextButton] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [timerActive, setTimerActive] = useState(true);
    const [hasTimedOut, setHasTimedOut] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple submissions

    // Configuration - Using your updated reCAPTCHA keys
    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LcWv4srAAAAAFzeZlN0rf_F8WPbXsSdOupUKG9R';

    const TOTAL_CHALLENGES = 5; // Number of reCAPTCHA challenges to complete

    // Debug logging
    useEffect(() => {
        console.log('reCAPTCHA Site Key:', RECAPTCHA_SITE_KEY);
        console.log('Environment REACT_APP_RECAPTCHA_SITE_KEY:', process.env.REACT_APP_RECAPTCHA_SITE_KEY);
        console.log('Current hostname:', window.location.hostname);
        console.log('Current origin:', window.location.origin);
        console.log('Using test key for localhost:', window.location.hostname === 'localhost');
    }, [RECAPTCHA_SITE_KEY]);

    // Mixed challenge types for variety
    const challengeTypes = [
        { type: 'recaptcha', instruction: 'Complete the reCAPTCHA verification below' },
        { type: 'recaptcha', instruction: 'Verify that you are human by completing the challenge' },
        { type: 'recaptcha', instruction: 'Please solve the reCAPTCHA to continue' },
        { type: 'recaptcha', instruction: 'Complete the security verification' },
        { type: 'recaptcha', instruction: 'Final verification - complete the reCAPTCHA below' }
    ];

    // Move to next challenge or complete task
    const moveToNext = useCallback((updatedResponses) => {
        if (currentChallenge < TOTAL_CHALLENGES - 1) {
            setCurrentChallenge(prev => prev + 1);
        } else {
            localStorage.setItem('captchaTaskResults', JSON.stringify(updatedResponses));
            navigate('/completion');
        }
    }, [currentChallenge, TOTAL_CHALLENGES, navigate]);

    // Handle time up - using useCallback to prevent stale closures
    const handleTimeUp = useCallback(() => {
        if (isProcessing) return; // Prevent multiple calls
        setIsProcessing(true);
        
        setTimerActive(false);
        setFeedback('Time limit reached! Moving to next challenge.');
        setIsCorrect(false);
        
        // Store response data for timeout
        const newResponse = {
            challengeIndex: currentChallenge,
            type: 'recaptcha',
            token: 'timeout',
            responseTime: 15000, // 15 seconds
            timestamp: new Date().toISOString(),
            success: false,
            timedOut: true
        };
        
        setResponses(prev => {
            const updatedResponses = [...prev, newResponse];
            // Move to next challenge after showing timeout message
            setTimeout(() => {
                moveToNext(updatedResponses);
                setIsProcessing(false);
            }, 2000);
            return updatedResponses;
        });
    }, [currentChallenge, moveToNext, isProcessing]);

    // Timer and challenge initialization
    useEffect(() => {
        setStartTime(Date.now());
        setTimeLeft(15);
        setTimerActive(true);
        setHasTimedOut(false);
        // Reset reCAPTCHA when moving to next challenge
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        setCaptchaToken('');
        setIsCorrect(null);
        setFeedback('');
        setShowNextButton(false);
        setIsProcessing(false);
    }, [currentChallenge]);

    // Timer countdown effect
    useEffect(() => {
        if (!timerActive || hasTimedOut || isProcessing) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setHasTimedOut(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timerActive, hasTimedOut, isProcessing]);

    // Handle timeout effect
    useEffect(() => {
        if (hasTimedOut && !isProcessing) {
            handleTimeUp();
        }
    }, [hasTimedOut, handleTimeUp, isProcessing]);

    // Handle reCAPTCHA completion
    const handleRecaptchaChange = async (token) => {
        if (!token) {
            setCaptchaToken('');
            setIsCorrect(null);
            setFeedback('');
            setShowNextButton(false);
            return;
        }

        if (isProcessing) return; // Prevent multiple verifications

        setCaptchaToken(token);
        setIsVerifying(true);
        setIsProcessing(true);

        try {
            // Verify the reCAPTCHA token
            const result = await verifyRecaptchaToken(token);
            const isValid = result.success;
            const responseTime = Date.now() - startTime;

            if (isValid) {
                setTimerActive(false); // Stop timer on successful verification
                setIsCorrect(true);
                setFeedback('reCAPTCHA verified successfully!');
                setShowNextButton(true);

                // Store response data
                const newResponse = {
                    challengeIndex: currentChallenge,
                    type: 'recaptcha',
                    token: token,
                    responseTime,
                    timestamp: new Date().toISOString(),
                    success: true
                };

                setResponses(prev => [...prev, newResponse]);
            } else {
                setIsCorrect(false);
                setFeedback('reCAPTCHA verification failed. Please try again.');
                setCaptchaToken('');
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            }
        } catch (error) {
            console.error('reCAPTCHA verification error:', error);
            setIsCorrect(false);
            setFeedback('Verification error. Please try again.');
            setCaptchaToken('');
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        } finally {
            setIsVerifying(false);
            setIsProcessing(false);
        }
    };

    // Handle moving to next challenge
    const handleNextChallenge = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        
        if (currentChallenge < TOTAL_CHALLENGES - 1) {
            setCurrentChallenge(prev => prev + 1);
        } else {
            // Store final results and navigate to completion
            localStorage.setItem('captchaTaskResults', JSON.stringify(responses));
            navigate('/completion');
        }
        setIsProcessing(false);
    };

    // Handle reCAPTCHA expiration
    const handleRecaptchaExpired = () => {
        setCaptchaToken('');
        setIsCorrect(null);
        setFeedback('reCAPTCHA expired. Please complete it again.');
        setShowNextButton(false);
    };

    // Handle reCAPTCHA error
    const handleRecaptchaError = () => {
        setIsCorrect(false);
        setFeedback('reCAPTCHA error occurred. Please try again.');
        setCaptchaToken('');
        setShowNextButton(false);
    };

    // Reset current reCAPTCHA
    const handleReset = () => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        setCaptchaToken('');
        setIsCorrect(null);
        setFeedback('');
        setShowNextButton(false);
    };

    const currentChallengeData = challengeTypes[currentChallenge];

    if (!RECAPTCHA_SITE_KEY) {
        return (
            <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Error</h2>
                    <p className="text-gray-600">reCAPTCHA site key is not configured. Please check your environment variables.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <ProgressTracker
                    current={currentChallenge + 1}
                    total={TOTAL_CHALLENGES}
                    taskName="CAPTCHA Task"
                />

                <TaskCard className="text-center">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            reCAPTCHA Challenge {currentChallenge + 1}
                        </h1>
                        
                        {/* Timer Display */}
                        <div className={`mb-4 text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                            Time: {timeLeft}s
                        </div>
                        
                        <p className="text-gray-600">
                            {currentChallengeData.instruction}
                        </p>
                    </div>

                    <div className="mb-8">
                        {/* reCAPTCHA Component */}
                        <div className="flex justify-center mb-6">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleRecaptchaChange}
                                onExpired={handleRecaptchaExpired}
                                onError={handleRecaptchaError}
                                theme="light"
                                size="normal"
                            />
                        </div>

                        {/* Loading indicator */}
                        {isVerifying && (
                            <div className="flex items-center justify-center mb-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                                <span className="ml-2 text-gray-600">Verifying...</span>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-center space-x-4">
                            {showNextButton ? (
                                <button
                                    onClick={handleNextChallenge}
                                    className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
                                    disabled={isProcessing}
                                >
                                    <span>
                                        {currentChallenge < TOTAL_CHALLENGES - 1 ? 'Next Challenge' : 'Complete Task'}
                                    </span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleReset}
                                    className="btn-secondary text-lg px-6 py-3 flex items-center space-x-2"
                                    disabled={isVerifying || isProcessing}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center justify-center space-x-2 animate-fade-in ${isCorrect === true
                            ? 'bg-green-100 text-green-800'
                            : isCorrect === false
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                            {isCorrect === true ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : isCorrect === false ? (
                                <XCircle className="w-5 h-5" />
                            ) : null}
                            <span className="font-medium">{feedback}</span>
                        </div>
                    )}

                    {/* Progress indicator */}
                    {isCorrect && currentChallenge < TOTAL_CHALLENGES - 1 && (
                        <div className="flex items-center justify-center text-primary-600 animate-fade-in">
                            <span className="mr-2">Ready for next challenge</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    )}

                    {isCorrect && currentChallenge === TOTAL_CHALLENGES - 1 && (
                        <div className="flex items-center justify-center text-green-600 animate-fade-in">
                            <span className="mr-2">All CAPTCHA challenges complete!</span>
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    )}
                </TaskCard>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Complete the reCAPTCHA verification to prove you are human and proceed to the next challenge.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Challenge {currentChallenge + 1} of {TOTAL_CHALLENGES}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CaptchaTask;
