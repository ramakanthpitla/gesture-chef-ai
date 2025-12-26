import { useState, useCallback, useRef, useEffect } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export type GestureType =
  | 'swipe_left'
  | 'swipe_right'
  | 'swipe_up'
  | 'swipe_down'
  | 'pinch'
  | 'spread'
  | 'point'
  | 'fist'
  | 'palm'
  | 'thumbs_up'
  | null;

interface UseGestureControlOptions {
  onGesture?: (gesture: GestureType) => void;
  enabled?: boolean;
}

export const useGestureControl = (options: UseGestureControlOptions = {}) => {
  const { enabled = true } = options;

  // Store callback in ref to avoid dependency issues
  const onGestureRef = useRef(options.onGesture);

  useEffect(() => {
    onGestureRef.current = options.onGesture;
  }, [options.onGesture]);

  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const lastLandmarksRef = useRef<any>(null);
  const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentGestureRef = useRef<GestureType>(null);
  const lastScrollTimeRef = useRef<number>(0);

  // Keep gesture ref in sync
  useEffect(() => {
    currentGestureRef.current = currentGesture;
  }, [currentGesture]);

  const detectGestureFromLandmarks = useCallback((landmarks: any[]): GestureType => {
    if (!landmarks || landmarks.length === 0) return null;

    // Get key landmark positions
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const indexMCP = landmarks[5];
    const middleMCP = landmarks[9];
    const ringMCP = landmarks[13];
    const pinkyMCP = landmarks[17];

    // Calculate finger extensions
    const indexExtended = indexTip.y < indexMCP.y;
    const middleExtended = middleTip.y < middleMCP.y;
    const ringExtended = ringTip.y < ringMCP.y;
    const pinkyExtended = pinkyTip.y < pinkyMCP.y;
    const thumbExtended = thumbTip.x < wrist.x;

    // Detect gestures
    // Thumbs up: only thumb extended
    if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return 'thumbs_up';
    }

    // Point: only index extended
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return 'point';
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
  }, []);

  const detectSwipe = useCallback((currentLandmarks: any[], previousLandmarks: any[]): GestureType => {
    if (!currentLandmarks || !previousLandmarks) return null;

    const currentWrist = currentLandmarks[0];
    const previousWrist = previousLandmarks[0];

    const deltaX = currentWrist.x - previousWrist.x;
    const deltaY = currentWrist.y - previousWrist.y;

    const threshold = 0.1;

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
    // Throttle scrolling to prevent too frequent updates
    if (now - lastScrollTimeRef.current < 500) return;

    lastScrollTimeRef.current = now;
    const scrollAmount = 300;
    window.scrollBy({
      top: direction === 'down' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });

      setCameraStream(stream);
      setIsActive(true);

      // Wait for next tick to ensure video element exists
      setTimeout(() => {
        const videoElement = document.getElementById('gesture-video') as HTMLVideoElement;
        if (videoElement && stream) {
          videoElement.srcObject = stream;
          videoRef.current = videoElement;

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

              // Detect static gesture
              const staticGesture = detectGestureFromLandmarks(landmarks);

              // Detect swipe gesture
              const swipeGesture = detectSwipe(landmarks, lastLandmarksRef.current);

              const detectedGesture = swipeGesture || staticGesture;

              if (detectedGesture && detectedGesture !== currentGestureRef.current) {
                setCurrentGesture(detectedGesture);

                // Handle scroll gestures
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
                }, 1000);
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
        }
      }, 100);

      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsActive(false);
      return null;
    }
  }, [detectGestureFromLandmarks, detectSwipe, handleScroll]);

  const stopCamera = useCallback(() => {
    // Stop camera
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    // Close hands instance
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }

    // Stop media stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }

    setIsActive(false);
    setCurrentGesture(null);
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
  };
};

