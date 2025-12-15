import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Leaf, 
  Users, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  TrendingUp,
  Package
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  pendingPrescriptions: number;
  approvedPrescriptions: number;
  rejectedPrescriptions: number;
  totalStrains: number;
  availableStrains: number;
  archivedStrains: number;
  totalOrders: number;
  pendingOrders: number;
  totalClients: number;
  verifiedClients: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (!roles || roles.length === 0) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      await fetchStats();
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch prescription stats
      const { data: prescriptions } = await supabase
        .from('prescription_documents')
        .select('status');

      const pendingPrescriptions = prescriptions?.filter(p => p.status === 'pending').length || 0;
      const approvedPrescriptions = prescriptions?.filter(p => p.status === 'approved').length || 0;
      const rejectedPrescriptions = prescriptions?.filter(p => p.status === 'rejected').length || 0;

      // Fetch strain stats
      const { data: strains } = await supabase
        .from('strains')
        .select('availability, is_archived');

      const totalStrains = strains?.length || 0;
      const availableStrains = strains?.filter(s => s.availability && !s.is_archived).length || 0;
      const archivedStrains = strains?.filter(s => s.is_archived).length || 0;

      // Fetch order stats
      const { data: orders } = await supabase
        .from('drgreen_orders')
        .select('status');

      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'PENDING').length || 0;

      // Fetch client stats
      const { data: clients } = await supabase
        .from('drgreen_clients')
        .select('is_kyc_verified, admin_approval');

      const totalClients = clients?.length || 0;
      const verifiedClients = clients?.filter(c => c.is_kyc_verified && c.admin_approval === 'VERIFIED').length || 0;

      setStats({
        pendingPrescriptions,
        approvedPrescriptions,
        rejectedPrescriptions,
        totalStrains,
        availableStrains,
        archivedStrains,
        totalOrders,
        pendingOrders,
        totalClients,
        verifiedClients
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <XCircle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
              <p className="text-muted-foreground">
                You do not have administrator privileges to access this page.
              </p>
              <Button onClick={() => navigate('/')}>
                Return Home
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = [
    {
      title: "Pending Prescriptions",
      value: stats?.pendingPrescriptions || 0,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      link: "/admin/prescriptions"
    },
    {
      title: "Approved Prescriptions",
      value: stats?.approvedPrescriptions || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/admin/prescriptions"
    },
    {
      title: "Total Strains",
      value: stats?.totalStrains || 0,
      icon: Leaf,
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/admin/strains"
    },
    {
      title: "Available Strains",
      value: stats?.availableStrains || 0,
      icon: Package,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/admin/strains"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Total Patients",
      value: stats?.totalClients || 0,
      icon: Users,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      title: "Verified Patients",
      value: stats?.verifiedClients || 0,
      icon: CheckCircle,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10"
    }
  ];

  const adminTools = [
    {
      title: "Prescription Management",
      description: "Review and approve patient prescription documents",
      icon: FileText,
      link: "/admin/prescriptions",
      badge: stats?.pendingPrescriptions ? `${stats.pendingPrescriptions} pending` : null
    },
    {
      title: "Strain Management",
      description: "Manage cannabis strain catalog and inventory",
      icon: Leaf,
      link: "/admin/strains",
      badge: stats?.archivedStrains ? `${stats.archivedStrains} archived` : null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Overview of system statistics and quick access to admin tools
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${stat.link ? 'hover:border-primary/50' : ''}`}
                    onClick={() => stat.link && navigate(stat.link)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Admin Tools */}
            <h2 className="text-2xl font-semibold text-foreground mb-6">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminTools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all hover:border-primary/50 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <tool.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription className="mt-1">{tool.description}</CardDescription>
                          </div>
                        </div>
                        {tool.badge && (
                          <span className="px-3 py-1 text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => navigate(tool.link)}
                        className="w-full group-hover:bg-primary"
                        variant="outline"
                      >
                        Open Tool
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
