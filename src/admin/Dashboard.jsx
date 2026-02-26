import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { supabase } from "../supabaseClient";
import "./Dashboard.css";

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalContacts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    revenue: 0
  });

  const [categoryData, setCategoryData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Products
        const { data: products, error: prodError } = await supabase
          .from("products")
          .select("category");
        if (prodError) throw prodError;

        // 2. Fetch Contacts
        const { count: contactCount, error: contError } = await supabase
          .from("contacts")
          .select("*", { count: 'exact', head: true });
        if (contError) throw contError;

        // 3. Fetch Users
        const { count: userCount, error: userError } = await supabase
          .from("users")
          .select("*", { count: 'exact', head: true });
        if (userError) throw userError;

        // 4. Fetch Orders (Real Revenue and Pending Orders)
        const { data: orders, error: orderError } = await supabase
          .from("orders")
          .select("total_price, status");

        let pendingCount = 0;
        let revenueSum = 0;
        let formattedOrderStatus = [];

        if (!orderError && orders) {
          pendingCount = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
          revenueSum = orders.reduce((acc, o) => acc + (Number(o.total_price) || 0), 0);

          const statuses = {};
          orders.forEach(o => {
            const s = o.status || 'unknown';
            statuses[s] = (statuses[s] || 0) + 1;
          });

          const STATUS_COLORS = {
            'pending': '#FFBB28',
            'processing': '#FF8042',
            'delivered': '#00C49F',
            'cancelled': '#FF4D4D',
            'unknown': '#cccccc'
          };

          formattedOrderStatus = Object.keys(statuses).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: statuses[status],
            color: STATUS_COLORS[status.toLowerCase()] || '#8884d8'
          }));
        }

        // Calculate Category Distribution
        const categories = {};
        products.forEach(p => {
          categories[p.category] = (categories[p.category] || 0) + 1;
        });

        const COLORS = ['#8B4513', '#D2691E', '#D4AF37', '#A0522D', '#CD7F32', '#808000'];
        const formattedCategoryData = Object.keys(categories).map((cat, index) => ({
          name: cat,
          value: categories[cat],
          color: COLORS[index % COLORS.length]
        }));

        setStats({
          totalProducts: products.length,
          totalContacts: contactCount || 0,
          totalUsers: userCount || 0,
          pendingOrders: pendingCount,
          revenue: revenueSum
        });

        setCategoryData(formattedCategoryData);
        setOrderStatusData(formattedOrderStatus);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading Dashboard Data...</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Stats Cards Section */}
      <div className="stats-section">
        <h2 className="section-title dashboard-heading">Dashboard Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><span>🛍️</span></div>
            <div className="stat-content">
              <div className="stat-label">TOTAL PRODUCTS</div>
              <div className="stat-number">{stats.totalProducts}</div>
              <div className="stat-desc">Inventory count</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><span>📞</span></div>
            <div className="stat-content">
              <div className="stat-label">TOTAL CONTACTS</div>
              <div className="stat-number">{stats.totalContacts}</div>
              <div className="stat-desc">Customer inquiries</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><span>⏳</span></div>
            <div className="stat-content">
              <div className="stat-label">PENDING ORDERS</div>
              <div className="stat-number">{stats.pendingOrders}</div>
              <div className="stat-desc">Awaiting processing</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><span>💰</span></div>
            <div className="stat-content">
              <div className="stat-label">REVENUE</div>
              <div className="stat-number">₹{stats.revenue}</div>
              <div className="stat-desc">Real-time earnings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3 className="chart-title">Order Status Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Products by Category</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
