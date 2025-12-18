import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";

const AIAnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const { reports, analyzeReport } = useWellness();
  const { toast } = useToast();
  
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-select report from URL params
  useEffect(() => {
    const reportId = searchParams.get("report");
    if (reportId) {
      setSelectedReportId(reportId);
    }
  }, [searchParams]);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleAnalyze = async () => {
    if (!selectedReportId) {
      toast({
        title: "No Report Selected",
        description: "Please select a report to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    analyzeReport(selectedReportId);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: "Your report has been analyzed successfully",
    });
  };

  const handleSpeak = () => {
    if (!selectedReport?.analysis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `
      Here's a summary of your report. ${selectedReport.analysis.summary}
      
      Normal findings include: ${selectedReport.analysis.normalFindings.join(". ")}.
      
      Things to pay attention to: ${selectedReport.analysis.concerns.join(". ")}.
      
      Suggested next steps: ${selectedReport.analysis.nextSteps.join(". ")}.
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          AI Report Analysis
        </h1>
        <p className="text-muted-foreground">
          Get simple explanations of your medical reports 🤖
        </p>
      </div>

      {/* Report Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Select a Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedReportId} onValueChange={setSelectedReportId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a report to analyze" />
              </SelectTrigger>
              <SelectContent>
                {reports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name} {report.analyzed && "✓"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedReport && !selectedReport.analyzed && (
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Report
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* No Report Selected */}
      {!selectedReport && (
        <Card className="p-8 text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Select a report to view analysis</p>
          <p className="text-sm text-muted-foreground mt-2">
            Our AI will explain your medical report in simple, easy-to-understand language
          </p>
        </Card>
      )}

      {/* Report Selected but Not Analyzed */}
      {selectedReport && !selectedReport.analyzed && !isAnalyzing && (
        <Card className="p-8 text-center bg-gradient-to-br from-coral-light to-sage-light border-0">
          <Sparkles className="w-16 h-16 text-coral mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Ready to Analyze
          </h3>
          <p className="text-muted-foreground mb-4">
            Click the "Analyze Report" button to get AI-powered insights about {selectedReport.name}
          </p>
          <Button onClick={handleAnalyze} size="lg">
            <Brain className="w-5 h-5 mr-2" />
            Start Analysis
          </Button>
        </Card>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <Card className="p-8 text-center">
          <Loader2 className="w-16 h-16 text-coral mx-auto mb-4 animate-spin" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Analyzing Your Report
          </h3>
          <p className="text-muted-foreground">
            Our AI is reading and understanding your medical report...
          </p>
        </Card>
      )}

      {/* Analysis Results */}
      {selectedReport?.analyzed && selectedReport.analysis && (
        <div className="space-y-6">
          {/* Voice Controls */}
          <Card className="bg-gradient-to-br from-coral-light to-sage-light border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Listen to Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Let AI read the analysis aloud in a calm, reassuring tone
                  </p>
                </div>
                <Button
                  variant={isSpeaking ? "destructive" : "default"}
                  onClick={handleSpeak}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Read Aloud
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-coral" />
                What This Report Means
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {selectedReport.analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Normal Findings */}
          <Card variant="sage">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-dark">
                <CheckCircle2 className="w-5 h-5" />
                What's Normal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedReport.analysis.normalFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Concerns */}
          <Card variant="coral">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-coral-dark">
                <AlertCircle className="w-5 h-5" />
                What Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedReport.analysis.concerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{concern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-coral" />
                Suggested Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedReport.analysis.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-coral-light text-coral-dark flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-lavender-light border-0">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                ⚠️ <strong>Important:</strong> This AI analysis is for informational purposes only 
                and should not replace professional medical advice. Always consult your healthcare 
                provider for medical decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPage;
