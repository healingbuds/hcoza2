import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { formatPrice } from "@/lib/currency";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  DollarSign,
  ShoppingCart,
  Calendar,
  XCircle,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDrGreenApi } from "@/hooks/useDrGreenApi";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  salesByDate: Array<{ date: string; amount: number; orders: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  paymentsByStatus: Array<{ status: string; count: number }>;
  summary: {
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
    salesGrowth: number;
    ordersGrowth: number;
  };
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#06B6D4'];

const AdminOrderAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDappOrders, getSalesSummary, getDashboardAnalytics } = useDrGreenApi();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("30");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin, timeRange]);

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
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
    }
  };

  const fetchAnalytics = async (showRefreshToast = false) => {
    if (showRefreshToast) setRefreshing(true);
    
    try {
      // Fetch orders from API
      const { data: ordersData, error: ordersError } = await getDappOrders({
        take: 500,
        orderBy: 'desc',
      });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast({
          title: "Error",
          description: "Failed to fetch analytics data",
          variant: "destructive",
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const orders = ordersData?.orders || [];
      const days = parseInt(timeRange);
      const startDate = subDays(new Date(), days);

      // Filter orders by time range
      const filteredOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        return new Date(order.createdAt) >= startDate;
      });

      // Generate date range for chart
      const dateRange = eachDayOfInterval({
        start: startDate,
        end: new Date(),
      });

      // Aggregate sales by date
      const salesByDate = dateRange.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayOrders = filteredOrders.filter(o => 
          o.createdAt && format(new Date(o.createdAt), 'yyyy-MM-dd') === dateStr
        );
        
        return {
          date: format(date, 'MMM dd'),
          amount: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
          orders: dayOrders.length,
        };
      });

      // Aggregate by order status
      const statusCounts: Record<string, number> = {};
      filteredOrders.forEach(order => {
        const status = order.status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      }));

      // Aggregate by payment status
      const paymentCounts: Record<string, number> = {};
      filteredOrders.forEach(order => {
        const status = order.paymentStatus || 'Unknown';
        paymentCounts[status] = (paymentCounts[status] || 0) + 1;
      });
      const paymentsByStatus = Object.entries(paymentCounts).map(([status, count]) => ({
        status,
        count,
      }));

      // Calculate summary metrics
      const totalSales = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const totalOrders = filteredOrders.length;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Calculate growth (compare first half vs second half of period)
      const midpoint = Math.floor(filteredOrders.length / 2);
      const firstHalf = filteredOrders.slice(midpoint);
      const secondHalf = filteredOrders.slice(0, midpoint);
      
      const firstHalfSales = firstHalf.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const secondHalfSales = secondHalf.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const salesGrowth = firstHalfSales > 0 
        ? ((secondHalfSales - firstHalfSales) / firstHalfSales) * 100 
        : 0;
      
      const ordersGrowth = firstHalf.length > 0 
        ? ((secondHalf.length - firstHalf.length) / firstHalf.length) * 100 
        : 0;

      setAnalyticsData({
        salesByDate,
        ordersByStatus,
        paymentsByStatus,
        summary: {
          totalSales,
          totalOrders,
          avgOrderValue,
          salesGrowth,
          ordersGrowth,
        },
      });

      if (showRefreshToast) {
        toast({
          title: "Data Refreshed",
          description: "Analytics data updated from API",
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Analytics" description="Loading...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have administrator privileges.
          </p>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const summary = analyticsData?.summary;

  return (
    <AdminLayout 
      title="Order Analytics" 
      description="Sales trends and order volume insights"
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{formatPrice(summary?.totalSales || 0, 'ZA')}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
            {summary && summary.salesGrowth !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${summary.salesGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.salesGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(summary.salesGrowth).toFixed(1)}% vs previous period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{summary?.totalOrders || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            {summary && summary.ordersGrowth !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${summary.ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.ordersGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(summary.ordersGrowth).toFixed(1)}% vs previous period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{formatPrice(summary?.avgOrderValue || 0, 'ZA')}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="text-2xl font-bold">{timeRange} days</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Trend
            </CardTitle>
            <CardDescription>Daily sales over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData?.salesByDate || []}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatPrice(value, 'ZA'), 'Sales']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Volume
            </CardTitle>
            <CardDescription>Daily order count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.salesByDate || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Orders']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {analyticsData?.ordersByStatus && analyticsData.ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      label={({ status, count }) => `${status}: ${count}`}
                      labelLine={false}
                    >
                      {analyticsData.ordersByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No order data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payments by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payments by Status</CardTitle>
            <CardDescription>Distribution of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {analyticsData?.paymentsByStatus && analyticsData.paymentsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.paymentsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      label={({ status, count }) => `${status}: ${count}`}
                      labelLine={false}
                    >
                      {analyticsData.paymentsByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No payment data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderAnalytics;
