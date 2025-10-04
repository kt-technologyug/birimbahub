import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
  const { signOut, profile, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen buyer-theme" style={{ background: 'var(--gradient-subtle)' }}>
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">BirimbaHub</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {(() => {
            const roleLabel = (userRole ?? 'buyer')[0].toUpperCase() + (userRole ?? 'buyer').slice(1);
            return (
              <h2 className="text-3xl font-bold mb-2">Welcome{profile?.full_name ? `, ${profile.full_name}` : ', Buyer'}! - {roleLabel}</h2>
            );
          })()}
          <p className="text-muted-foreground">Browse products and place orders</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">On the way</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Total delivered</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Place an Order</CardTitle>
                <CardDescription>Request products from farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create New Order</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>Browse available products from suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No products listed yet. Check back soon!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmers">
            <Card>
              <CardHeader>
                <CardTitle>Available Farmers</CardTitle>
                <CardDescription>Connect with farmers in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Farmer directory coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BuyerDashboard;
