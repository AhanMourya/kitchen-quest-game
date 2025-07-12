// src/components/ui/AuthButton.tsx
import React, { useEffect, useState } from "react";
import { auth, signInWithGoogle, signOutUser } from "../../firebase";
import { Button } from "@/components/ui/button";
import { User } from "firebase/auth";

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    if (user) {
        return (
            <Button variant="outline" onClick={signOutUser}>
                Sign Out ({user.displayName || user.email})
            </Button>
        );
    }

    return (
        <Button variant="default" onClick={signInWithGoogle}>
            Sign in with Google
        </Button>
    );
}
