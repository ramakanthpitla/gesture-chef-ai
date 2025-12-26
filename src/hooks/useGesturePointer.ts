import { useState, useCallback, useRef, useEffect } from 'react';
import type { Results } from '@mediapipe/hands';

export type GestureType =
    | 'swipe_left'
    | 'swipe_right'
    | 'swipe_up'
    | 'swipe_down'
    | 'pinch'
    | 'click'
    | 'point'
    | 'fist'
    | 'palm'
    | 'thumbs_up'
    | null;

interface HandPosition {
    x: number;
    y: number;
}

interface UseGestureControlOptions {
    onGesture?: (gesture: GestureType) => void;
    enabled?: boolean;
    enablePointer?: boolean;
}

export const useGestureControl = (options: UseGestureControlOptions = {}) => {
    const { enabled = true, enablePointer = true } = options;

    // Store callback in ref to avoid dependency issues
    const onGestureRef = useRef(options.onGesture);

    useEffect(() => {
        onGestureRef.current = options.onGesture;
    }, [options.onGesture]);

    const [isActive, setIsActive] = useState(false);
    const [currentGesture, setCurrentGesture] = useState<GestureType>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [handPosition, setHandPosition] = useState<HandPosition>({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
    });
    const [isPointing, setIsPointing] = useState(false);
    const [isPinching, setIsPinching] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const handsRef = useRef<any>(null); // MediaPipe Hands instance
    const cameraRef = useRef<any>(null); // MediaPipe Camera instance
    const lastLandmarksRef = useRef<any>(null);
    const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentGestureRef = useRef<GestureType>(null);
    const lastScrollTimeRef = useRef<number>(0);
    const lastClickTimeRef = useRef<number>(0);
    const wasPinchingRef = useRef(false);
    const handPositionRef = useRef<HandPosition>({ x: 0, y: 0 });

    // Keep refs in sync
    useEffect(() => {
        currentGestureRef.current = currentGesture;
    }, [currentGesture]);

    useEffect(() => {
        handPositionRef.current = handPosition;
    }, [handPosition]);

    const calculateDistance = useCallback((point1: any, point2: any): number => {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }, []);

    const detectGestureFromLandmarks = useCallback((landmarks: any[]): GestureType => {
        if (!landmarks || landmarks.length === 0) return null;

        // Get key landmark positions
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const indexMCP = landmarks[5];
        const middleTip = landmarks[12];
        const middleMCP = landmarks[9];
        const ringTip = landmarks[16];
        const ringMCP = landmarks[13];
        const pinkyTip = landmarks[20];
        const pinkyMCP = landmarks[17];

        // Calculate finger extensions
        const indexExtended = indexTip.y < indexMCP.y;
        const middleExtended = middleTip.y < middleMCP.y;
        const ringExtended = ringTip.y < ringMCP.y;
        const pinkyExtended = pinkyTip.y < pinkyMCP.y;
        const thumbExtended = thumbTip.x < wrist.x;

        // Detect pinch (thumb and index finger close together)
        const pinchDistance = calculateDistance(thumbTip, indexTip);
        const isPinchGesture = pinchDistance < 0.08; // Increased threshold for easier detection

        // Update pinch state
        setIsPinching(isPinchGesture);

        // Detect click (pinch then release) - IMPROVED
        if (wasPinchingRef.current && !isPinchGesture) {
            const now = Date.now();
            if (now - lastClickTimeRef.current > 300) { // Reduced cooldown for faster clicks
                lastClickTimeRef.current = now;
                wasPinchingRef.current = false;
                return 'click';
            }
        }
        wasPinchingRef.current = isPinchGesture;

        // Pinch gesture
        if (isPinchGesture) {
            return 'pinch';
        }

        // Thumbs up: only thumb extended
        if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'thumbs_up';
        }

        // Point: only index extended
        if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            setIsPointing(true);
            return 'point';
        } else {
            setIsPointing(false);
        }

        // Fist: no fingers extended
        if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'fist';
        }

        // Palm: all fingers extended
        if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
            return 'palm';
        }

        return null;
    }, [calculateDistance]);

    const detectSwipe = useCallback((currentLandmarks: any[], previousLandmarks: any[]): GestureType => {
        if (!currentLandmarks || !previousLandmarks) return null;

        const currentWrist = currentLandmarks[0];
        const previousWrist = previousLandmarks[0];

        const deltaX = currentWrist.x - previousWrist.x;
        const deltaY = currentWrist.y - previousWrist.y;

        const threshold = 0.12; // Slightly lower threshold for easier swipes

        if (Math.abs(deltaX) > threshold) {
            return deltaX > 0 ? 'swipe_right' : 'swipe_left';
        }

        if (Math.abs(deltaY) > threshold) {
            return deltaY > 0 ? 'swipe_down' : 'swipe_up';
        }

        return null;
    }, []);

    const handleScroll = useCallback((direction: 'up' | 'down') => {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < 400) return; // Reduced throttle for smoother scrolling

        lastScrollTimeRef.current = now;
        const scrollAmount = 250;
        window.scrollBy({
            top: direction === 'down' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });

        console.log(`Scrolling ${direction}`);
    }, []);

    const handlePointerClick = useCallback((x: number, y: number) => {
        console.log(`Attempting click at: ${x}, ${y}`);

        // Get element at pointer position
        const element = document.elementFromPoint(x, y);

        if (!element) {
            console.log('No element found at pointer position');
            return false;
        }

        console.log(`Element found: ${element.tagName}, class: ${element.className}`);

        // List of clickable selectors
        const clickableSelectors = [
            'BUTTON',
            'A',
            'INPUT',
            'SELECT',
            'LABEL',
            '[role="button"]',
            '[onclick]',
            '.cursor-pointer',
            '[data-clickable]'
        ];

        // Function to check if element or its parents are clickable
        const findClickableElement = (el: Element | null, maxDepth = 5): HTMLElement | null => {
            let current = el;
            let depth = 0;

            while (current && depth < maxDepth) {
                const htmlEl = current as HTMLElement;

                // Check if element matches clickable criteria
                if (
                    clickableSelectors.includes(current.tagName) ||
                    current.getAttribute('role') === 'button' ||
                    current.classList.contains('cursor-pointer') ||
                    htmlEl.onclick ||
                    current.hasAttribute('data-clickable')
                ) {
                    console.log(`Found clickable element: ${current.tagName}`);
                    return htmlEl;
                }

                current = current.parentElement;
                depth++;
            }

            return null;
        };

        // Find clickable element
        const clickableElement = findClickableElement(element);

        if (clickableElement) {
            console.log('Clicking element:', clickableElement);

            // Visual feedback
            clickableElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clickableElement.style.transform = '';
            }, 150);

            // Trigger click
            clickableElement.click();
            return true;
        }

        // If no specific clickable element found, try clicking the element itself
        console.log('Trying to click element directly');
        (element as HTMLElement).click();
        return false;
    }, []);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });

            setCameraStream(stream);
            setIsActive(true);

            // Wait for next tick to ensure video element exists
            setTimeout(async () => {
                const videoElement = document.getElementById('gesture-video') as HTMLVideoElement;
                if (videoElement && stream) {
                    videoElement.srcObject = stream;
                    videoRef.current = videoElement;

                    try {
                        // Dynamically import MediaPipe modules
                        const { Hands } = await import('@mediapipe/hands');
                        const { Camera } = await import('@mediapipe/camera_utils');

                        // Initialize MediaPipe Hands
                        const hands = new Hands({
                            locateFile: (file: string) => {
                                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                            }
                        });

                        hands.setOptions({
                            maxNumHands: 1,
                            modelComplexity: 1,
                            minDetectionConfidence: 0.7,
                            minTrackingConfidence: 0.7
                        });

                        hands.onResults((results: Results) => {
                            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                                const landmarks = results.multiHandLandmarks[0];

                                // Update hand position for pointer (use index fingertip)
                                if (enablePointer) {
                                    const indexTip = landmarks[8];
                                    // Direct mapping - no mirroring
                                    const screenX = window.innerWidth * indexTip.x;
                                    const screenY = window.innerHeight * indexTip.y;

                                    // Debug logging
                                    console.log('Hand detected:', {
                                        indexTip: { x: indexTip.x, y: indexTip.y },
                                        screen: { x: screenX, y: screenY },
                                        window: { w: window.innerWidth, h: window.innerHeight }
                                    });

                                    setHandPosition({ x: screenX, y: screenY });
                                }

                                // Detect static gesture
                                const staticGesture = detectGestureFromLandmarks(landmarks);

                                // ALWAYS detect swipe gestures for scrolling
                                const swipeGesture = detectSwipe(landmarks, lastLandmarksRef.current);

                                // Prioritize swipe over static gesture for scrolling
                                const detectedGesture = swipeGesture || staticGesture;

                                if (detectedGesture && detectedGesture !== currentGestureRef.current) {
                                    setCurrentGesture(detectedGesture);

                                    // Handle gestures
                                    if (detectedGesture === 'click' && enablePointer) {
                                        // Use the ref to get current position
                                        const { x, y } = handPositionRef.current;
                                        console.log('Click gesture detected!');
                                        handlePointerClick(x, y);
                                    }

                                    // ALWAYS handle scroll gestures
                                    if (detectedGesture === 'swipe_up') {
                                        handleScroll('up');
                                    } else if (detectedGesture === 'swipe_down') {
                                        handleScroll('down');
                                    }

                                    // Call user's gesture handler
                                    if (onGestureRef.current) {
                                        onGestureRef.current(detectedGesture);
                                    }

                                    // Clear gesture after a delay
                                    if (gestureTimeoutRef.current) {
                                        clearTimeout(gestureTimeoutRef.current);
                                    }
                                    gestureTimeoutRef.current = setTimeout(() => {
                                        setCurrentGesture(null);
                                    }, 800); // Reduced timeout for faster gestures
                                }

                                lastLandmarksRef.current = landmarks;
                            }
                        });

                        handsRef.current = hands;

                        // Start camera processing
                        const camera = new Camera(videoElement, {
                            onFrame: async () => {
                                if (handsRef.current && videoElement) {
                                    await handsRef.current.send({ image: videoElement });
                                }
                            },
                            width: 640,
                            height: 480
                        });

                        camera.start();
                        cameraRef.current = camera;

                        console.log('✅ MediaPipe loaded successfully!');
                    } catch (error) {
                        console.error('❌ Error loading MediaPipe:', error);
                        console.log('Error details:', {
                            message: error instanceof Error ? error.message : 'Unknown error',
                            stack: error instanceof Error ? error.stack : undefined
                        });
                        // Don't turn off - let camera stay on for debugging
                        // User can see what's happening
                    }
                }
            }, 100);

            return stream;
        } catch (error) {
            console.error('❌ Error accessing camera:', error);
            console.log('Camera access error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                name: error instanceof Error ? error.name : undefined
            });
            setIsActive(false);
            return null;
        }
    }, [detectGestureFromLandmarks, detectSwipe, handleScroll, enablePointer, handlePointerClick]);

    const stopCamera = useCallback(() => {
        if (cameraRef.current) {
            cameraRef.current.stop();
            cameraRef.current = null;
        }

        if (handsRef.current) {
            handsRef.current.close();
            handsRef.current = null;
        }

        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current = null;
        }

        setIsActive(false);
        setCurrentGesture(null);
        setIsPointing(false);
        setIsPinching(false);
    }, [cameraStream]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (gestureTimeoutRef.current) {
                clearTimeout(gestureTimeoutRef.current);
            }
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
            if (handsRef.current) {
                handsRef.current.close();
            }
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    return {
        isActive,
        currentGesture,
        cameraStream,
        videoRef,
        startCamera,
        stopCamera,
        enabled,
        handPosition,
        isPointing,
        isPinching,
    };
};
