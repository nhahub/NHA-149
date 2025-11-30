import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from "lucide-react";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSocket } from "../../hooks/useSocket";

/**
 * WebRTC Video Call Component
 * Uses native WebRTC API with Socket.io for signaling
 */
export default function VideoCall({
  sessionId,
  onCallEnd,
  userName,
  isOwner = false,
}) {
  const { t } = useTranslation();
  const socket = useSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remoteUserName, setRemoteUserName] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const isOfferSentRef = useRef(false);

  // STUN servers (free public servers)
  // For production, add TURN servers for better connectivity
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      // Add TURN server for production (paid service)
      // Example: { urls: "turn:your-turn-server.com", username: "...", credential: "..." }
    ],
  };

  useEffect(() => {
    if (!socket || !sessionId) {
      setIsLoading(false);
      setError("Socket not connected or session ID missing");
      return;
    }

    const initWebRTC = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Initializing WebRTC for session:", sessionId);

        // Check if getUserMedia is available
        if (!navigator.mediaDevices) {
          // Fallback for older browsers
          if (!navigator.getUserMedia && !navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
            throw new Error(
              t("session.mediaDevicesNotSupported", {
                defaultValue:
                  "Camera and microphone access is not supported in this browser. Please use a modern browser with HTTPS.",
              })
            );
          }
        } else if (!navigator.mediaDevices.getUserMedia) {
          throw new Error(
            t("session.mediaDevicesNotSupported", {
              defaultValue:
                "Camera and microphone access is not supported in this browser. Please use a modern browser with HTTPS.",
            })
          );
        }

        // Check if we're on HTTPS or localhost (required for getUserMedia)
        const isSecureContext = window.isSecureContext || 
          window.location.protocol === 'https:' || 
          window.location.hostname === 'localhost' || 
          window.location.hostname === '127.0.0.1';
        
        if (!isSecureContext) {
          throw new Error(
            t("session.httpsRequired", {
              defaultValue:
                "Video calls require HTTPS. Please access this page over HTTPS.",
            })
          );
        }

        // Get user media (camera and microphone)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        localStreamRef.current = stream;

        // Display local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create RTCPeerConnection
        const pc = new RTCPeerConnection(iceServers);
        peerConnectionRef.current = pc;

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
          console.log("Received remote track:", event.track.kind);
          const [remoteStream] = event.streams;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setIsConnected(true);
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate && socket) {
            console.log("Sending ICE candidate");
            socket.emit("ice-candidate", {
              sessionId,
              candidate: event.candidate,
              fromUserId: socket.userId,
            });
          }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
          if (pc.connectionState === "connected") {
            setIsConnected(true);
            setIsLoading(false);
          } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
            setIsConnected(false);
            setError(t("session.connectionLost", { defaultValue: "Connection lost" }));
          }
        };

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", pc.iceConnectionState);
          if (pc.iceConnectionState === "failed") {
            setError(t("session.iceFailed", { defaultValue: "Connection failed. Please try again." }));
          }
        };

        // Join session room
        socket.emit("join-session", { sessionId });

        // Handle session joined confirmation
        socket.on("session-joined", ({ sessionId: joinedSessionId }) => {
          console.log("Joined session:", joinedSessionId);
        });

        // Handle user joined
        socket.on("user-joined", ({ userId, userName: name }) => {
          console.log("User joined:", userId, name);
          setRemoteUserName(name || "Remote User");
        });

        // Handle incoming offer
        socket.on("offer", async ({ offer, fromUserId }) => {
          console.log("Received offer from:", fromUserId);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("answer", {
              sessionId,
              answer,
              fromUserId: socket.userId,
            });
            console.log("Sent answer");
          } catch (error) {
            console.error("Error handling offer:", error);
            setError(t("session.offerError", { defaultValue: "Failed to handle connection offer" }));
          }
        });

        // Handle incoming answer
        socket.on("answer", async ({ answer }) => {
          console.log("Received answer");
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (error) {
            console.error("Error handling answer:", error);
            setError(t("session.answerError", { defaultValue: "Failed to handle connection answer" }));
          }
        });

        // Handle incoming ICE candidate
        socket.on("ice-candidate", async ({ candidate, fromUserId }) => {
          if (candidate && pc.remoteDescription) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log("Added ICE candidate");
            } catch (error) {
              console.error("Error adding ICE candidate:", error);
            }
          }
        });

        // Handle user left
        socket.on("user-left", ({ userId, userName: name }) => {
          console.log("User left:", userId);
          setRemoteUserName("");
          setIsConnected(false);
          toast.info(
            t("session.userLeft", {
              defaultValue: `${name || "User"} left the call`,
            })
          );
        });

        // Create and send offer (only once)
        if (!isOfferSentRef.current) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", {
            sessionId,
            offer,
            fromUserId: socket.userId,
          });
          isOfferSentRef.current = true;
          console.log("Sent offer");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing WebRTC:", error);

        // Handle specific error types
        if (error.name === "NotAllowedError") {
          setError(
            t("session.permissionDenied", {
              defaultValue:
                "Camera/microphone permission denied. Please allow access and refresh.",
            })
          );
        } else if (error.name === "NotFoundError") {
          setError(
            t("session.deviceNotFound", {
              defaultValue: "Camera/microphone not found. Please check your devices.",
            })
          );
        } else if (error.name === "NotReadableError") {
          setError(
            t("session.deviceInUse", {
              defaultValue: "Camera/microphone is being used by another application.",
            })
          );
        } else if (error.message && error.message.includes("not supported")) {
          setError(error.message);
        } else {
          setError(
            error.message ||
              t("session.initError", {
                defaultValue: "Failed to initialize video call",
              })
          );
        }
        setIsLoading(false);
      }
    };

    initWebRTC();

    return () => {
      // Cleanup
      console.log("Cleaning up WebRTC resources...");

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (socket) {
        socket.emit("leave-session", { sessionId });
        socket.off("session-joined");
        socket.off("user-joined");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("user-left");
      }

      isOfferSentRef.current = false;
    };
  }, [socket, sessionId, t]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnectionRef.current || !localStreamRef.current) return;

    try {
      if (isScreenSharing) {
        // Stop screen sharing - restore camera
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast.error(
            t("session.mediaDevicesNotSupported", {
              defaultValue:
                "Camera access is not supported in this browser.",
            })
          );
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        // Replace video track
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        // Stop old screen track
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        localStreamRef.current = stream;
        screenStreamRef.current = null;
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          toast.error(
            t("session.screenShareNotSupported", {
              defaultValue:
                "Screen sharing is not supported in this browser.",
            })
          );
          return;
        }
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: false,
        });

        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenStreamRef.current = screenStream;

        // Handle screen share end (user clicks stop sharing)
        videoTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      if (error.name === "NotAllowedError") {
        toast.error(
          t("session.screenShareDenied", {
            defaultValue: "Screen sharing permission denied",
          })
        );
      } else {
        toast.error(
          t("session.screenShareError", {
            defaultValue: "Failed to toggle screen sharing",
          })
        );
      }
    }
  };

  const leaveCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socket) {
      socket.emit("leave-session", { sessionId });
    }
    onCallEnd();
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t("session.connecting", { defaultValue: "Connecting..." })}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-4">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={leaveCall} variant="outline">
            {t("session.leave", { defaultValue: "Leave" })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Remote Video (Main) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-20 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {isVideoOff && (
          <div className="absolute inset-0 bg-secondary-800 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* User Names */}
      <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg text-sm">
        {remoteUserName || t("session.waiting", { defaultValue: "Waiting for user..." })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          onClick={toggleMute}
          variant={isMuted ? "destructive" : "secondary"}
          size="sm"
          className="rounded-full w-12 h-12 p-0"
        >
          {isMuted ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>
        <Button
          onClick={toggleVideo}
          variant={isVideoOff ? "destructive" : "secondary"}
          size="sm"
          className="rounded-full w-12 h-12 p-0"
        >
          {isVideoOff ? (
            <VideoOff className="w-5 h-5" />
          ) : (
            <Video className="w-5 h-5" />
          )}
        </Button>
        {isOwner && (
          <Button
            onClick={toggleScreenShare}
            variant={isScreenSharing ? "default" : "secondary"}
            size="sm"
            className="rounded-full w-12 h-12 p-0"
          >
            <Monitor className="w-5 h-5" />
          </Button>
        )}
        <Button
          onClick={leaveCall}
          variant="destructive"
          size="sm"
          className="rounded-full w-12 h-12 p-0"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs">
          {t("session.connecting", { defaultValue: "Connecting..." })}
        </div>
      )}
    </div>
  );
}
