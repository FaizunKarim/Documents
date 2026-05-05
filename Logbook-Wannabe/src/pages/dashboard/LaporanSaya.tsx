import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, MapPin, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  file_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string; description: string }> = {
  pending: {
    color: "bg-yellow-500",
    icon: Clock,
    label: "Menunggu",
    description: "Laporan sedang menunggu untuk ditinjau",
  },
  reviewing: {
    color: "bg-blue-500",
    icon: Search,
    label: "Ditinjau",
    description: "Tim sedang meninjau laporan Anda",
  },
  in_progress: {
    color: "bg-orange-500",
    icon: AlertCircle,
    label: "Diproses",
    description: "Laporan sedang dalam proses penanganan",
  },
  resolved: {
    color: "bg-green-500",
    icon: CheckCircle2,
    label: "Selesai",
    description: "Masalah telah diselesaikan",
  },
};

const LaporanSaya = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Gagal memuat laporan",
        variant: "destructive",
      });
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredReports = selectedStatus
    ? reports.filter((r) => r.status === selectedStatus)
    : reports;

  const statusCounts = {
    pending: reports.filter((r) => r.status === "pending").length,
    reviewing: reports.filter((r) => r.status === "reviewing").length,
    in_progress: reports.filter((r) => r.status === "in_progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Laporan Saya</h1>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = statusCounts[key as keyof typeof statusCounts];
          const isSelected = selectedStatus === key;

          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedStatus(isSelected ? null : key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-full ${config.color}/10`}>
                    <Icon className={`h-5 w-5 text-${config.color.replace("bg-", "")}`} />
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Anda belum membuat laporan.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Buat laporan pertama Anda melalui halaman Beranda.
            </p>
          </CardContent>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Tidak ada laporan dengan status "{statusConfig[selectedStatus!]?.label}".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const config = statusConfig[report.status];
            const StatusIcon = config.icon;

            return (
              <Card key={report.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <Badge variant="outline">{report.category}</Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                        {report.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{report.location}</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Dibuat: {formatDate(report.created_at)}
                        </p>
                      </div>
                      
                      <div className="md:text-right space-y-2">
                        <Badge className={`${config.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        {Object.entries(statusConfig).map(([key, cfg], index) => {
                          const statuses = ["pending", "reviewing", "in_progress", "resolved"];
                          const currentIndex = statuses.indexOf(report.status);
                          const stepIndex = statuses.indexOf(key);
                          const isCompleted = stepIndex <= currentIndex;
                          const isCurrent = stepIndex === currentIndex;

                          return (
                            <div key={key} className="flex-1 flex items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompleted ? cfg.color : "bg-muted"
                                  } ${isCurrent ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                                >
                                  {React.createElement(cfg.icon, {
                                    className: `h-4 w-4 ${isCompleted ? "text-white" : "text-muted-foreground"}`,
                                  })}
                                </div>
                                <span
                                  className={`text-xs mt-2 ${
                                    isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                                  }`}
                                >
                                  {cfg.label}
                                </span>
                              </div>
                              {index < 3 && (
                                <div
                                  className={`flex-1 h-1 mx-2 ${
                                    stepIndex < currentIndex ? cfg.color : "bg-muted"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Add React import for createElement
import React from "react";

export default LaporanSaya;
