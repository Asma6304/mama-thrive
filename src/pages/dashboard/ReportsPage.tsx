import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Upload,
  Trash2,
  Eye,
  Brain,
  CheckCircle2,
  Calendar,
  FileImage,
  Volume2,
  Loader2,
  Stethoscope,
  Bell,
} from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const reportCategories = [
  "Blood Test",
  "Ultrasound",
  "Urine Test",
  "Glucose Test",
  "Thyroid Panel",
  "General Checkup",
  "Other",
];

const ReportsPage = () => {
  const { reports, addReport, deleteReport, analyzeReport, analysisReminders } = useWellness();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newReport, setNewReport] = useState({
    name: "",
    type: "PDF",
    reportCategory: "",
    doctorName: "",
    reportDate: "",
    fileUrl: "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewReport({
        ...newReport,
        name: newReport.name || file.name.replace(/\.[^/.]+$/, ""),
        type: file.type.includes("image") ? "Image" : "PDF",
        fileUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleAddReport = async () => {
    if (!newReport.name || !newReport.reportCategory || !newReport.reportDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const reportId = Date.now().toString();
    addReport({
      ...newReport,
      name: newReport.name,
    });
    
    setNewReport({ 
      name: "", 
      type: "PDF", 
      reportCategory: "",
      doctorName: "",
      reportDate: "",
      fileUrl: "" 
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Report Uploaded",
      description: `${newReport.name} has been uploaded. Analyzing now...`,
    });

    // Auto-analyze after upload
    setTimeout(() => {
      handleAnalyze(reportId);
    }, 500);
  };

  const handleAnalyze = async (id: string) => {
    setIsAnalyzing(id);
    try {
      await analyzeReport(id);
      toast({
        title: "Analysis Complete! ✨",
        description: "Your report has been analyzed. Reminders have been created.",
      });
      navigate(`/dashboard/ai-analysis?report=${id}`);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteReport(id);
    toast({
      title: "Report Deleted",
      description: `${name} has been removed`,
    });
  };

  const speakSummary = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const analyzedCount = reports.filter(r => r.analyzed).length;
  const pendingReminders = analysisReminders.filter(r => !r.completed).length;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Medical Reports
          </h1>
          <p className="text-muted-foreground">
            Upload, analyze, and understand your medical documents 📋
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Medical Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* File Upload */}
              <div
                className="border-2 border-dashed border-muted rounded-xl p-6 text-center cursor-pointer hover:border-coral transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Click to upload PDF or image
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              
              {newReport.fileUrl && (
                <div className="p-3 bg-sage-light rounded-xl">
                  <p className="font-medium text-sage-dark flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    File selected
                  </p>
                </div>
              )}
              
              {/* Report Name */}
              <div>
                <Label htmlFor="reportName">Report Name *</Label>
                <Input
                  id="reportName"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="e.g., Blood Test - January 2024"
                />
              </div>

              {/* Report Category */}
              <div>
                <Label>Report Type *</Label>
                <Select
                  value={newReport.reportCategory}
                  onValueChange={(value) => setNewReport({ ...newReport, reportCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Report Date */}
              <div>
                <Label htmlFor="reportDate">Report Date *</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={newReport.reportDate}
                  onChange={(e) => setNewReport({ ...newReport, reportDate: e.target.value })}
                />
              </div>

              {/* Doctor Name */}
              <div>
                <Label htmlFor="doctorName">Doctor Name (Optional)</Label>
                <Input
                  id="doctorName"
                  value={newReport.doctorName}
                  onChange={(e) => setNewReport({ ...newReport, doctorName: e.target.value })}
                  placeholder="e.g., Dr. Priya Sharma"
                />
              </div>
              
              <Button onClick={handleAddReport} className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Upload & Analyze Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="bg-gradient-to-br from-coral-light to-background border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {reports.length} uploaded
                </p>
                <p className="text-sm text-sage-dark mt-1">
                  {analyzedCount} analyzed
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-background/80 flex items-center justify-center">
                <FileText className="w-7 h-7 text-coral" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-lavender-light to-background border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Action Items</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {pendingReminders} pending
                </p>
                <p className="text-sm text-lavender-dark mt-1">
                  From report analysis
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-background/80 flex items-center justify-center">
                <Bell className="w-7 h-7 text-lavender-dark" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reports uploaded yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Click "Add Report" to upload your medical documents
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Report
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card
              key={report.id}
              variant="elevated"
              className={`transition-all duration-300 ${
                selectedReport === report.id ? "ring-2 ring-coral" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.type === "PDF"
                      ? "bg-coral-light text-coral-dark"
                      : "bg-sage-light text-sage-dark"
                  }`}>
                    {report.type === "PDF" ? (
                      <FileText className="w-6 h-6" />
                    ) : (
                      <FileImage className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{report.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.reportDate || report.uploadDate}
                      </span>
                      {report.doctorName && (
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {report.doctorName}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted">
                        {report.reportCategory || report.type}
                      </span>
                      {report.analyzed && (
                        <span className="px-2 py-0.5 rounded-full bg-sage-light text-sage-dark text-xs flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          Analyzed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {report.analyzed && report.analysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakSummary(report.analysis!.summary)}
                      className="flex-shrink-0"
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking ? "text-coral animate-pulse" : ""}`} />
                    </Button>
                  )}
                  <Link to={`/dashboard/ai-analysis?report=${report.id}`} className="flex-1">
                    <Button
                      variant={report.analyzed ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      disabled={isAnalyzing === report.id}
                    >
                      {isAnalyzing === report.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          {report.analyzed ? "View Analysis" : "Analyze"}
                        </>
                      )}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(report.id, report.name)}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Note */}
      <Card className="mt-8 bg-lavender-light border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">✨ What happens when you upload?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• AI analyzes your report in simple, easy-to-understand language</li>
            <li>• Get personalized reminders for follow-ups and medications</li>
            <li>• Listen to your report summary with voice playback</li>
            <li>• Track all your medical history in one place</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
