import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sprout, ShoppingCart, Package, MessageSquare, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-subtle)' }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6 shadow-[var(--shadow-glow)]">
          <Sprout className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-primary">BirimbaHub</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Connecting Uganda's farmers, buyers, and suppliers for a thriving agricultural community
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/auth')} className="shadow-[var(--shadow-elegant)]">
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Who We Serve</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Farmers</h3>
              <p className="text-muted-foreground mb-4">
                Track expenses, manage orders, and connect with buyers. Join the farmer forum to discuss trends and seasons.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Expense tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Farmer forum</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Order management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Buyers</h3>
              <p className="text-muted-foreground mb-4">
                Place orders, set prices, and get matched with local farmers. Track deliveries and manage your supply chain.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  <span>Easy ordering</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Smart matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure transactions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suppliers</h3>
              <p className="text-muted-foreground mb-4">
                List products like seedlings, fertilizers, and equipment. Reach farmers and grow your business.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Product listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Sales analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Customer management</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto shadow-[var(--shadow-elegant)] bg-card/50 backdrop-blur">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Join BirimbaHub?</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're a farmer, buyer, or supplier, BirimbaHub has the tools you need to succeed.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="shadow-[var(--shadow-elegant)]">
              Create Your Account
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
