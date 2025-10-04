import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'farmer' | 'buyer' | 'supplier' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: { full_name: string; phone_number?: string | null; location?: string } | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; session?: Session | null }>;
  signUp: (email: string, password: string, fullName: string, location: string, role: UserRole, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; phone_number?: string | null; location?: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setUserRole(null);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // fetch role and profile in parallel, then clear loading
        Promise.all([
          fetchUserRole(session.user.id),
          fetchUserProfile(session.user.id),
        ]).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        // keep errors silent here — UI can show an appropriate toast if needed
      } else if (data) {
        setUserRole(data.role as UserRole);
      }
    } catch (e) {
      // swallow; no console noise in normal operation
    } finally {
      // don't toggle loading here; caller controls when loading finishes
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone_number, location')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setProfile({ full_name: data.full_name, phone_number: data.phone_number, location: data.location });
      } else {
        setProfile(null);
      }
    } catch (e) {
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      // If the auth call returned a session/user, set them immediately.
      if (data?.session) {
        setSession(data.session as Session);
        setUser(data.user ?? null);
        if (data.user) {
          // ensure role and profile are loaded before returning
          await Promise.all([fetchUserRole(data.user.id), fetchUserProfile(data.user.id)]);
        }
        return { error: null, session: data.session };
      }

      // Some Supabase project settings don't return a session immediately
      // (e.g. email confirmation flows). We'll poll for a short time to see
      // if a session becomes available, to reduce the need for a second
      // user click.
      const start = Date.now();
  const timeout = 6000; // ms
      while (Date.now() - start < timeout) {
        // small delay
        await new Promise((res) => setTimeout(res, 200));
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        if (session) {
          setSession(session);
          setUser(session.user ?? null);
          if (session.user) fetchUserRole(session.user.id);
          return { error: null, session };
        }
      }

      // No session after polling; return success with null session and let
      // the caller decide what to do (UI may show confirmation required).
      return { error: null, session: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    location: string,
    role: UserRole
    , phone?: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            location: location,
            role: role,
            phone: phone ?? null,
          },
        },
      });

      if (error) return { error };
      if (!data.user) return { error: new Error('User creation failed') };

      // NOTE: role creation is handled by a DB trigger (handle_new_user)
      // which reads the role from the user's raw_user_meta_data on insert.
      // This avoids RLS race conditions where the client isn't yet authenticated.

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setProfile(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  // Apply theme based on user role
  useEffect(() => {
    if (userRole) {
      document.body.className = `${userRole}-theme`;
    } else {
      document.body.className = '';
    }
  }, [userRole]);

  return (
    <AuthContext.Provider value={{ user, session, profile, userRole, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
