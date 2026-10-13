import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { MainNavigation } from "./navigation/MainNavigation";
import { AuthView } from "./screens/AuthView";
import { BiometricSecurityService, SecureDeviceBinding } from "./services/BiometricSecurityService";
import { BiometricLockScreen } from "./components/BiometricLockScreen";
import { BiometricEnrollmentModal } from "./components/BiometricEnrollmentModal";

export const App: React.FC = () => {
  const { currentUser, isLoading, signOut, signIn } = useAuth();
  
  // Track device binding & lock screen status
  const [deviceBinding, setDeviceBinding] = useState<SecureDeviceBinding | null>(() => {
    return BiometricSecurityService.getEnrolledBinding();
  });
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(() => {
    return BiometricSecurityService.isSessionLocked();
  });
  const [showEnrollPrompt, setShowEnrollPrompt] = useState<boolean>(false);
  const [forceTraditionalLogin, setForceTraditionalLogin] = useState<boolean>(false);

  // Sync state on load and when currentUser changes
  useEffect(() => {
    const binding = BiometricSecurityService.getEnrolledBinding();
    setDeviceBinding(binding);

    // If binding exists and session is locked, enforce lock screen
    if (binding && BiometricSecurityService.isSessionLocked()) {
      setIsSessionLocked(true);
    } else {
      setIsSessionLocked(false);
    }

    // First time check: If user just logged in traditionally and device is NOT enrolled, show prompt
    if (currentUser && !binding) {
      const prompted = sessionStorage.getItem("qrayati_biometric_prompt_shown");
      if (!prompted) {
        setShowEnrollPrompt(true);
        sessionStorage.setItem("qrayati_biometric_prompt_shown", "true");
      }
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-700 text-white rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center mb-6 animate-pulse font-black">
          <span className="text-3xl leading-none">DZ</span>
          <span className="text-[11px] tracking-widest mt-1">قرايتي</span>
        </div>
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">
          جاري تجهيز منصة قرايتي DZ...
        </p>
      </div>
    );
  }

  // 1. BANK-GRADE LOCK SCREEN:
  // If the device has an enrolled biometric account and session is locked,
  // NEVER show private data, wallet or courses until biometric check passes.
  if (deviceBinding && isSessionLocked && !forceTraditionalLogin) {
    return (
      <BiometricLockScreen
        binding={deviceBinding}
        onSuccess={async () => {
          // Biometric verified! Restore user session
          setIsSessionLocked(false);
          if (!currentUser || currentUser.email !== deviceBinding.enrolledEmail) {
            await signIn(deviceBinding.enrolledEmail);
          }
        }}
        onFallbackPassword={() => {
          setForceTraditionalLogin(true);
        }}
        onUnlinkDevice={async () => {
          BiometricSecurityService.disableBiometrics();
          setDeviceBinding(null);
          setIsSessionLocked(false);
          await signOut();
        }}
      />
    );
  }

  // 2. Unauthenticated: Show traditional AuthView (with quick biometric unlock button if enrolled)
  if (!currentUser) {
    return (
      <AuthView
        enrolledBinding={deviceBinding}
        onTriggerBiometric={() => {
          setForceTraditionalLogin(false);
          setIsSessionLocked(true);
        }}
      />
    );
  }

  // 3. Authenticated: Render Main Application with potential first-time enrollment modal
  return (
    <>
      <MainNavigation />
      {showEnrollPrompt && (
        <BiometricEnrollmentModal
          user={currentUser}
          onEnrolled={() => {
            setShowEnrollPrompt(false);
            setDeviceBinding(BiometricSecurityService.getEnrolledBinding());
          }}
          onDismiss={() => {
            setShowEnrollPrompt(false);
          }}
        />
      )}
    </>
  );
};

export default App;
