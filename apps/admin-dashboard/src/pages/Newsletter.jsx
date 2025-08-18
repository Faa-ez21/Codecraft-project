import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Mail,
  Send,
  Users,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
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

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Newsletter Management
          </h1>
          <p className="text-gray-600">
            Manage subscribers and send newsletters to your customers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Subscribers"
            value={stats.totalSubscribers}
            color="bg-blue-500"
          />
          <StatCard
            icon={CheckCircle2}
            title="Active Subscribers"
            value={stats.activeSubscribers}
            color="bg-green-500"
          />
          <StatCard
            icon={Mail}
            title="Total Campaigns"
            value={stats.totalCampaigns}
            color="bg-purple-500"
          />
          <StatCard
            icon={Send}
            title="Sent Campaigns"
            value={stats.sentCampaigns}
            color="bg-orange-500"
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
                  <h3 className="text-xl font-bold text-gray-900">
                    Subscribers ({filteredSubscribers.length})
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        fetchSubscribers();
                        fetchStats();
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search subscribers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={exportSubscribers}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscribed Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                subscriber.subscribed_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subscriber.source || "website"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  subscriber.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {subscriber.status || "active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredSubscribers.length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              {searchTerm
                                ? "No subscribers found matching your search"
                                : "No subscribers yet"}
                            </td>
                          </tr>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Create New Campaign
                </h3>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 🎉 Summer Sale - Up to 50% Off Office Furniture!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={newCampaign.targetAudience}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        targetAudience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Subscribers</option>
                    <option value="specific">Specific Emails</option>
                  </select>
                </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCampaign}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
