import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Sprout, TrendingUp, MessageSquare, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const { signOut, user, profile, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-subtle)' }}>
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" />
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
            const roleLabel = (userRole ?? 'farmer')[0].toUpperCase() + (userRole ?? 'farmer').slice(1);
            return (
              <h2 className="text-3xl font-bold mb-2">Welcome{profile?.full_name ? `, ${profile.full_name}` : ', Farmer'}! - {roleLabel}</h2>
            );
          })()}
          <p className="text-muted-foreground">Manage your farm, track expenses, and connect with buyers</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">UGX 0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Pending delivery</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Join the discussion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Farm Status</CardTitle>
                  <Sprout className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">Growing season</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with BirimbaHub</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button className="h-auto py-4 flex flex-col items-start gap-2">
                  <DollarSign className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Track Expenses</div>
                    <div className="text-xs opacity-90">Record your farming costs</div>
                  </div>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-start gap-2" variant="outline">
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Join Forum</div>
                    <div className="text-xs opacity-90">Connect with other farmers</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>Monitor your farming costs and inputs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No expenses recorded yet. Start tracking your costs!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View orders matched to your farm</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No orders yet. Keep your farm active!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forum">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Forum</CardTitle>
                <CardDescription>Discuss trends, seasons, and best practices</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Forum coming soon! Connect with fellow farmers.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FarmerDashboard;
