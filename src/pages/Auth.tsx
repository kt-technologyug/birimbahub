import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sprout, ShoppingCart, Package } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Toggle debug UI via Vite env var: set VITE_SHOW_SUPABASE_DEBUG=true in .env to enable
  const SHOW_SUPABASE_DEBUG = import.meta.env.VITE_SHOW_SUPABASE_DEBUG === 'true';

  // Debug helper: show current supabase URL and test connectivity
  // Keep debug UI off by default; enable with VITE_SHOW_SUPABASE_DEBUG if needed.

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    fullName: '',
    location: '',
    role: 'farmer' as 'farmer' | 'buyer' | 'supplier',
    phone: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error, session } = await signIn(loginData.email, loginData.password);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });

      setIsLoading(false);
      return;
    }

    // If signIn returned a session, navigate. If not, instruct the user to
    // confirm email or wait a moment.
    if (session) {
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully",
      });
      navigate('/dashboard', { replace: true });
    } else {
      toast({
        title: 'Check your email',
        description: 'Please confirm your email to complete sign-in (or try again).',
      });
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(
      signupData.email,
      signupData.password,
      signupData.fullName,
      signupData.location,
      signupData.role,
      signupData.phone
    );

    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "You can now log in with your credentials",
      });
      navigate('/dashboard', { replace: true });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-subtle)' }}>
      <Card className="w-full max-w-md shadow-[var(--shadow-elegant)]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Sprout className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">BirimbaHub</CardTitle>
          <CardDescription>Connecting Uganda's Agricultural Community</CardDescription>
          {SHOW_SUPABASE_DEBUG && (
            <div className="mt-2 text-sm text-muted-foreground">
              <div>Supabase debug mode enabled</div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-location">Location</Label>
                  <Input
                    id="signup-location"
                    type="text"
                    placeholder="Kampala, Uganda"
                    value={signupData.location}
                    onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+256700000000"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">I am a...</Label>
                  <Select value={signupData.role} onValueChange={(value: any) => setSignupData({ ...signupData, role: value })}>
                    <SelectTrigger id="signup-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4" />
                          <span>Farmer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="buyer">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Buyer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="supplier">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>Supplier</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
