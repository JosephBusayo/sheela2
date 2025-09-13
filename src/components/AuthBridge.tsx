"use client";

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useStore } from '../../stores/useStore';

export default function AuthBridge() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const setAuthState = useStore((s) => s.setAuthState);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      setAuthState(true, user.id);
    } else {
      // Optional: clear server cart too before clearing local state
      // fetch('/api/cart', { method: 'DELETE' }).catch(() => {});
      setAuthState(false, null);
    }
  }, [isSignedIn, user?.id, setAuthState]);

  return null;
} 