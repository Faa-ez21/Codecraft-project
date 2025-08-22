import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Mail,
  Send,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  FileText,
  Download,
  Search,
  Calendar,
  BarChart3,
  Check,
  X,
  Filter,
  RotateCcw,
  UserCheck,
  UserX,
  User,
  PlusCircle,
} from "lucide-react";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalCampaigns: 0,
    sentCampaigns: 0,
  });

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    subject: "",
    content: "",
    targetAudience: "all",
    recipientEmails: [],
  });

  // Handle subscriber selection
  const handleSelectSubscriber = (subscriberId) => {
    setSelectedSubscribers(prev => {
      if (prev.includes(subscriberId)) {
        return prev.filter(id => id !== subscriberId);
      } else {
        return [...prev, subscriberId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
    }
    setSelectAll(!selectAll);
  };

  const clearSelection = () => {
    setSelectedSubscribers([]);
    setSelectAll(false);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && subscriber.status !== "unsubscribed") ||
      (filterStatus === "inactive" && subscriber.status === "unsubscribed");
    return matchesSearch && matchesStatus;
  });

  // Update select all state when filtered subscribers change
  useEffect(() => {
    const allSelected = filteredSubscribers.length > 0 && 
      filteredSubscribers.every(sub => selectedSubscribers.includes(sub.id));
    setSelectAll(allSelected);
  }, [filteredSubscribers, selectedSubscribers]);

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
    fetchStats();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) {
        console.error("Error fetching subscribers:", error);
        setSubscribers([]);
      } else {
        setSubscribers(data || []);
      }
    } catch (error) {
      console.error("Database error:", error);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
      } else {
        setCampaigns(data || []);
      }
    } catch (error) {
      console.error("Database error:", error);
      setCampaigns([]);
    }
  };

  const fetchStats = async () => {
    try {
      // Get subscriber stats
      const { data: subscriberData, error: subError } = await supabase
        .from("subscribers")
        .select("status");

      // Get campaign stats
      const { data: campaignData, error: campError } = await supabase
        .from("newsletter_campaigns")
        .select("status");

      if (!subError && !campError) {
        const totalSubscribers = subscriberData?.length || 0;
        const activeSubscribers =
          subscriberData?.filter((sub) => sub.status === "active").length || 0;
        const totalCampaigns = campaignData?.length || 0;
        const sentCampaigns =
          campaignData?.filter((camp) => camp.status === "sent").length || 0;

        setStats({
          totalSubscribers,
          activeSubscribers,
          totalCampaigns,
          sentCampaigns,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalSubscribers: 0,
        activeSubscribers: 0,
        totalCampaigns: 0,
        sentCampaigns: 0,
      });
    }
  };

  const createCampaign = async () => {
    if (!newCampaign.title || !newCampaign.subject || !newCampaign.content) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();

      const campaignData = {
        title: newCampaign.title,
        subject: newCampaign.subject,
        content: newCampaign.content,
        target_audience: newCampaign.targetAudience,
        recipient_emails:
          newCampaign.targetAudience === "specific"
            ? newCampaign.recipientEmails
            : null,
        created_by: userData?.user?.id,
        status: "draft",
      };

      const { data, error } = await supabase
        .from("newsletter_campaigns")
        .insert([campaignData])
        .select();

      if (error) {
        console.error("Error creating campaign:", error);
        alert("Error creating campaign. Please try again.");
      } else {
        alert("Campaign created successfully!");
        setNewCampaign({
          title: "",
          subject: "",
          content: "",
          targetAudience: "all",
          recipientEmails: [],
        });
        setShowNewCampaign(false);
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (campaignId) => {
    if (
      !confirm(
        "Are you sure you want to send this campaign? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const campaign = campaigns.find((c) => c.id === campaignId);

      // Try to send via Supabase Edge Function first
      try {
        const { data: emailResult, error: emailError } =
          await supabase.functions.invoke("send-newsletter", {
            body: {
              campaignId: campaignId,
              targetAudience: campaign.target_audience,
              recipientEmails: campaign.recipient_emails,
            },
          });

        if (emailError) {
          console.error("Email sending error:", emailError);
          throw new Error(emailError.message || "Email service error");
        }

        if (emailResult?.success) {
          alert(`Newsletter sent successfully! 
            
📊 Sending Summary:
• Total: ${emailResult.details.total}
• Sent: ${emailResult.details.sent}
• Failed: ${emailResult.details.failed}`);
        } else {
          throw new Error(emailResult?.error || "Unknown error");
        }
      } catch (emailError) {
        console.error("Email service error:", emailError);

        // Fallback: Just update the campaign status
        const { error: updateError } = await supabase
          .from("newsletter_campaigns")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", campaignId);

        if (updateError) {
          throw updateError;
        }

        alert(`⚠️ Email service not configured yet.
        
Campaign marked as sent in database.

To enable actual email sending:
1. Deploy the send-newsletter edge function
2. Set up RESEND_API_KEY environment variable
3. Configure your domain with the email service

For now, you can manually copy and send the campaign content to your subscribers.`);
      }

      fetchCampaigns();
      fetchStats();
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Error sending campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("newsletter_campaigns")
        .delete()
        .eq("id", campaignId);

      if (error) {
        console.error("Error deleting campaign:", error);
        alert("Error deleting campaign. Please try again.");
      } else {
        alert("Campaign deleted successfully!");
        fetchCampaigns();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Error deleting campaign. Please try again.");
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ["Email", "Subscribed Date", "Source", "Status"],
      ...subscribers.map((sub) => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.source || "website",
        sub.status || "active",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
              <p className="text-gray-600 mt-1">Manage subscribers and create targeted campaigns</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewCampaign(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg backdrop-blur-sm"
              >
                <PlusCircle size={20} />
                New Campaign
              </button>
              {selectedSubscribers.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={clearSelection}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Clear ({selectedSubscribers.length})
                  </button>
                  <button
                    onClick={() => {
                      setNewCampaign(prev => ({
                        ...prev,
                        targetAudience: "selected",
                        recipientEmails: selectedSubscribers.map(id => 
                          subscribers.find(sub => sub.id === id)?.email
                        ).filter(Boolean)
                      }));
                      setShowNewCampaign(true);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <Send size={16} />
                    Send to Selected
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Subscribers"
            value={stats.totalSubscribers}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={CheckCircle2}
            title="Active Subscribers"
            value={stats.activeSubscribers}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={Mail}
            title="Total Campaigns"
            value={stats.totalCampaigns}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Send}
            title="Sent Campaigns"
            value={stats.sentCampaigns}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "subscribers", label: "Subscribers", icon: Users },
                { id: "campaigns", label: "Campaigns", icon: Mail },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Newsletter Overview
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Recent Activity
                    </h4>
                    <div className="space-y-3">
                      {campaigns.slice(0, 5).map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {campaign.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                campaign.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              campaign.status === "sent"
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                      ))}
                      {campaigns.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No campaigns yet
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Quick Actions
                    </h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowNewCampaign(true)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create New Campaign</span>
                      </button>
                      <button
                        onClick={exportSubscribers}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Subscribers</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscribers" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Subscribers</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSubscribers.length > 0 
                        ? `${selectedSubscribers.length} of ${filteredSubscribers.length} selected`
                        : `${filteredSubscribers.length} total subscribers`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        fetchSubscribers();
                        fetchStats();
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg backdrop-blur-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search subscribers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      onClick={exportSubscribers}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Select All
                              </span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscribed Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubscribers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center">
                                <Users className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No subscribers found</p>
                                <p className="text-gray-400 text-sm">
                                  {searchTerm 
                                    ? "No subscribers found matching your search" 
                                    : "Subscribers will appear here once people sign up for your newsletter"
                                  }
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredSubscribers.map((subscriber, index) => (
                            <tr key={subscriber.id} className={`hover:bg-gray-50 transition-colors ${
                              selectedSubscribers.includes(subscriber.id) ? 'bg-blue-50' : ''
                            }`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedSubscribers.includes(subscriber.id)}
                                  onChange={() => handleSelectSubscriber(subscriber.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                      <span className="text-white text-sm font-medium">
                                        {subscriber.email?.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {subscriber.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(subscriber.subscribed_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {subscriber.source || "website"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  subscriber.status === "unsubscribed" 
                                    ? "bg-red-100 text-red-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {subscriber.status === "unsubscribed" ? "Inactive" : "Active"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  {selectedSubscribers.includes(subscriber.id) ? (
                                    <UserCheck className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <User className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "campaigns" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Campaigns ({campaigns.length})
                  </h3>
                  <button
                    onClick={() => setShowNewCampaign(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Campaign</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-white rounded-lg border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {campaign.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {campaign.subject}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                campaign.status === "sent"
                                  ? "bg-green-100 text-green-800"
                                  : campaign.status === "draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {campaign.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created:{" "}
                              {new Date(
                                campaign.created_at
                              ).toLocaleDateString()}
                            </span>
                            {campaign.sent_at && (
                              <span className="text-xs text-gray-500">
                                Sent:{" "}
                                {new Date(
                                  campaign.sent_at
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {campaign.status === "draft" && (
                            <button
                              onClick={() => sendCampaign(campaign.id)}
                              disabled={loading}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Send</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteCampaign(campaign.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No campaigns yet</p>
                      <button
                        onClick={() => setShowNewCampaign(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Campaign Modal */}
        {showNewCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Create New Campaign</h3>
                    {newCampaign.targetAudience === "selected" && (
                      <p className="text-sm text-blue-600 mt-1">
                        Sending to {newCampaign.recipientEmails.length} selected subscribers
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNewCampaign(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Summer Sale Newsletter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.subject}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 🎉 Summer Sale - Up to 50% Off Office Furniture!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={newCampaign.targetAudience}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewCampaign({
                        ...newCampaign,
                        targetAudience: value,
                        recipientEmails: value === "all" ? [] : newCampaign.recipientEmails,
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Active Subscribers</option>
                    <option value="selected">Selected Subscribers ({newCampaign.recipientEmails.length})</option>
                    <option value="specific">Specific Email Addresses</option>
                  </select>
                </div>

                {newCampaign.targetAudience === "selected" && newCampaign.recipientEmails.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Subscribers ({newCampaign.recipientEmails.length})
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {newCampaign.recipientEmails.map((email, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {email}
                            <button
                              onClick={() => {
                                setNewCampaign(prev => ({
                                  ...prev,
                                  recipientEmails: prev.recipientEmails.filter((_, i) => i !== index)
                                }));
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {newCampaign.targetAudience === "specific" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Email Addresses (one per line)
                    </label>
                    <textarea
                      value={newCampaign.recipientEmails.join("\\n")}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          recipientEmails: e.target.value
                            .split("\\n")
                            .filter((email) => email.trim()),
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="email1@example.com&#10;email2@example.com"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content *
                  </label>
                  <textarea
                    value={newCampaign.content}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        content: e.target.value,
                      })
                    }
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Write your newsletter content here...

You can include:
- Product announcements
- Special offers and discounts
- Company news
- Design tips
- Customer testimonials

The content will be formatted automatically in the email template."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowNewCampaign(false);
                    // Reset campaign if it was created from selection
                    if (newCampaign.targetAudience === "selected") {
                      setNewCampaign({
                        title: "",
                        subject: "",
                        content: "",
                        targetAudience: "all",
                        recipientEmails: [],
                      });
                    }
                  }}
                  className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCampaign}
                  disabled={loading || !newCampaign.title || !newCampaign.subject || !newCampaign.content}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg backdrop-blur-sm disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
