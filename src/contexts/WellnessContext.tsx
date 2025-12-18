import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: "health" | "baby" | "self" | "exercise";
  date: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  notes: string;
}

export interface ReportAnalysis {
  summary: string;
  keyFindings: string[];
  normalFindings: string[];
  concerns: string[];
  nextSteps: string[];
  reminders: AnalysisReminder[];
}

export interface AnalysisReminder {
  id: string;
  type: "followup" | "medicine" | "lifestyle";
  title: string;
  description: string;
  dueDate?: string;
  completed: boolean;
  reportId: string;
}

export interface MedicalReport {
  id: string;
  name: string;
  type: string;
  reportCategory: string;
  doctorName: string;
  reportDate: string;
  uploadDate: string;
  fileUrl: string;
  analyzed: boolean;
  analysis?: ReportAnalysis;
}

export interface WellnessData {
  mood: { date: string; value: number; emoji: string }[];
  sleep: { date: string; hours: number }[];
  nutrition: { date: string; score: number }[];
  activity: { date: string; steps: number }[];
}

interface WellnessContextType {
  userName: string;
  userEmail: string;
  setUserEmail: (email: string) => void;
  pregnancyStage: string;
  
  checklist: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, "id" | "date">) => void;
  
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, "id">) => void;
  toggleMedicineTaken: (id: string) => void;
  deleteMedicine: (id: string) => void;
  
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  deleteAppointment: (id: string) => void;
  
  reports: MedicalReport[];
  addReport: (report: Omit<MedicalReport, "id" | "uploadDate" | "analyzed">) => void;
  analyzeReport: (id: string) => Promise<ReportAnalysis>;
  deleteReport: (id: string) => void;
  
  analysisReminders: AnalysisReminder[];
  toggleReminderComplete: (id: string) => void;
  deleteAnalysisReminder: (id: string) => void;
  
  wellnessData: WellnessData;
  logMood: (value: number, emoji: string) => void;
  logSleep: (hours: number) => void;
  logNutrition: (score: number) => void;
  logActivity: (steps: number) => void;
  
  emailInsightsEnabled: boolean;
  setEmailInsightsEnabled: (enabled: boolean) => void;
  medicineRemindersEnabled: boolean;
  setMedicineRemindersEnabled: (enabled: boolean) => void;
  appointmentRemindersEnabled: boolean;
  setAppointmentRemindersEnabled: (enabled: boolean) => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

const getToday = () => new Date().toISOString().split("T")[0];

const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
};

const generateMockWellnessData = (): WellnessData => {
  const days = getLast7Days();
  const emojis = ["😢", "😕", "😐", "🙂", "😊"];
  
  return {
    mood: days.map(date => ({
      date,
      value: Math.floor(Math.random() * 3) + 3,
      emoji: emojis[Math.floor(Math.random() * 3) + 2]
    })),
    sleep: days.map(date => ({
      date,
      hours: Math.round((Math.random() * 3 + 5) * 10) / 10
    })),
    nutrition: days.map(date => ({
      date,
      score: Math.floor(Math.random() * 30) + 60
    })),
    activity: days.map(date => ({
      date,
      steps: Math.floor(Math.random() * 3000) + 2000
    }))
  };
};

// Generate AI analysis based on report category
const generateAnalysis = (report: MedicalReport): ReportAnalysis => {
  const reportId = report.id;
  const category = report.reportCategory;
  
  const analysisTemplates: Record<string, ReportAnalysis> = {
    "Blood Test": {
      summary: `Your blood test results from ${report.reportDate} show that most of your values are within healthy ranges for your pregnancy stage. Your hemoglobin level indicates good iron levels, which is wonderful for both you and your baby. The doctor ${report.doctorName} will discuss any specific concerns during your next visit.`,
      keyFindings: [
        "Hemoglobin: 12.5 g/dL - Good for pregnancy",
        "Blood Sugar (Fasting): 92 mg/dL - Normal range",
        "Thyroid (TSH): 2.3 mIU/L - Within healthy limits",
        "Vitamin B12: 450 pg/mL - Adequate levels"
      ],
      normalFindings: [
        "Your iron levels are healthy - keep up with iron-rich foods like spinach and dates",
        "Blood sugar is well controlled - your diet is working well",
        "Thyroid function is normal - no medication changes needed",
        "White blood cell count indicates no infection"
      ],
      concerns: [
        "Vitamin D is slightly low (22 ng/mL) - This is common in Indian women",
        "Consider more morning sunlight exposure (15-20 mins before 10 AM)"
      ],
      nextSteps: [
        "Continue taking your prenatal vitamins daily",
        "Add Vitamin D supplement as advised by doctor",
        "Eat iron-rich foods like jaggery, spinach, and pomegranate",
        "Next blood test recommended in 4-6 weeks"
      ],
      reminders: [
        { id: `${reportId}-r1`, type: "medicine", title: "Start Vitamin D Supplement", description: "Take 1000 IU Vitamin D daily with breakfast", dueDate: getToday(), completed: false, reportId },
        { id: `${reportId}-r2`, type: "followup", title: "Follow-up Blood Test", description: "Schedule next blood test in 4-6 weeks", dueDate: getFutureDate(35), completed: false, reportId },
        { id: `${reportId}-r3`, type: "lifestyle", title: "Morning Sunlight", description: "Get 15-20 mins of morning sunlight before 10 AM", completed: false, reportId }
      ]
    },
    "Ultrasound": {
      summary: `Your ultrasound report from ${report.reportDate} shows that your baby is developing beautifully! All measurements are within the normal range for your pregnancy stage. The baby's heartbeat is strong and healthy. Dr. ${report.doctorName} has noted positive development.`,
      keyFindings: [
        "Baby's heartbeat: 145 bpm - Strong and healthy",
        "Fetal growth: On track for gestational age",
        "Amniotic fluid: Normal levels",
        "Placenta position: Properly placed"
      ],
      normalFindings: [
        "Baby's growth is exactly where it should be for this stage",
        "Heart rate is perfect - between 120-160 bpm is ideal",
        "Amniotic fluid levels indicate good kidney function",
        "Placenta is healthy and providing good nutrition to baby"
      ],
      concerns: [],
      nextSteps: [
        "Continue with regular prenatal visits",
        "Maintain balanced nutrition with proteins and vegetables",
        "Stay hydrated with 8-10 glasses of water daily",
        "Next ultrasound as scheduled by your doctor"
      ],
      reminders: [
        { id: `${reportId}-r1`, type: "followup", title: "Next Prenatal Checkup", description: "Schedule follow-up visit with Dr. " + report.doctorName, dueDate: getFutureDate(21), completed: false, reportId },
        { id: `${reportId}-r2`, type: "lifestyle", title: "Daily Hydration Goal", description: "Drink 8-10 glasses of water daily for healthy amniotic fluid", completed: false, reportId }
      ]
    },
    "Urine Test": {
      summary: `Your urine test results from ${report.reportDate} look good overall. The test helps monitor your kidney health and check for any infections, which is important during pregnancy. Most parameters are within normal limits.`,
      keyFindings: [
        "Protein: Negative - No signs of preeclampsia",
        "Sugar: Negative - Good glucose control",
        "Bacteria: None detected - No UTI",
        "pH: Normal range"
      ],
      normalFindings: [
        "No protein in urine - kidneys are functioning well",
        "No sugar detected - gestational diabetes not indicated",
        "No bacterial infection present",
        "Urine concentration is healthy"
      ],
      concerns: [
        "Remember to maintain good hygiene to prevent UTIs",
        "Stay well-hydrated throughout the day"
      ],
      nextSteps: [
        "Continue drinking plenty of water",
        "Maintain good personal hygiene",
        "Report any burning sensation during urination to doctor"
      ],
      reminders: [
        { id: `${reportId}-r1`, type: "lifestyle", title: "Hydration Reminder", description: "Drink water regularly to maintain kidney health and prevent UTIs", completed: false, reportId }
      ]
    },
    default: {
      summary: `Your medical report from ${report.reportDate} has been reviewed. Based on the analysis, your health indicators appear to be within acceptable ranges for your current stage. Dr. ${report.doctorName} can provide specific guidance during your next consultation.`,
      keyFindings: [
        "Report has been successfully analyzed",
        "Key health parameters have been evaluated",
        "Results are being tracked in your health history"
      ],
      normalFindings: [
        "Overall health indicators appear stable",
        "No critical abnormalities detected",
        "Continue with your current health routine"
      ],
      concerns: [
        "Always discuss any symptoms with your healthcare provider",
        "Keep tracking your daily wellness activities"
      ],
      nextSteps: [
        "Schedule a follow-up with your doctor to discuss results",
        "Continue with prescribed medications",
        "Maintain a healthy diet and regular activity"
      ],
      reminders: [
        { id: `${reportId}-r1`, type: "followup", title: "Discuss Report with Doctor", description: `Review this report with Dr. ${report.doctorName} at your next visit`, dueDate: getFutureDate(14), completed: false, reportId }
      ]
    }
  };

  return analysisTemplates[category] || analysisTemplates.default;
};

export const WellnessProvider = ({ children }: { children: ReactNode }) => {
  const [userName] = useState("Asma");
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("wellness-user-email") || "";
  });
  const [pregnancyStage] = useState("Second Trimester");
  const [emailInsightsEnabled, setEmailInsightsEnabled] = useState(() => {
    return localStorage.getItem("wellness-email-insights") !== "false";
  });
  const [medicineRemindersEnabled, setMedicineRemindersEnabled] = useState(() => {
    return localStorage.getItem("wellness-medicine-reminders") !== "false";
  });
  const [appointmentRemindersEnabled, setAppointmentRemindersEnabled] = useState(() => {
    return localStorage.getItem("wellness-appointment-reminders") !== "false";
  });
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem("wellness-checklist");
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", label: "Morning walk (15 mins)", completed: false, category: "health", date: getToday() },
      { id: "2", label: "Drink 8 glasses of water", completed: true, category: "health", date: getToday() },
      { id: "3", label: "Take prenatal vitamins", completed: true, category: "health", date: getToday() },
      { id: "4", label: "Light stretching exercises", completed: false, category: "exercise", date: getToday() },
      { id: "5", label: "Baby feeding schedule", completed: true, category: "baby", date: getToday() },
      { id: "6", label: "15 mins self-care time", completed: false, category: "self", date: getToday() },
    ];
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem("wellness-medicines");
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", name: "Prenatal Vitamins", dosage: "1 tablet", time: "09:00", frequency: "Daily", taken: false },
      { id: "2", name: "Folic Acid", dosage: "400mcg", time: "09:00", frequency: "Daily", taken: true },
      { id: "3", name: "Iron Supplement", dosage: "1 tablet", time: "14:00", frequency: "Daily", taken: false },
    ];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("wellness-appointments");
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", doctorName: "Dr. Priya Sharma", specialty: "Gynecologist", date: "2024-01-25", time: "10:00", notes: "Regular checkup" },
      { id: "2", doctorName: "Dr. Anand Kumar", specialty: "General Physician", date: "2024-02-01", time: "15:30", notes: "Blood test review" },
    ];
  });

  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem("wellness-reports-v2");
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: "1", 
        name: "Blood Test Report", 
        type: "PDF", 
        reportCategory: "Blood Test",
        doctorName: "Dr. Priya Sharma",
        reportDate: "2024-01-15",
        uploadDate: "2024-01-15", 
        fileUrl: "#", 
        analyzed: true, 
        analysis: {
          summary: "Your blood test results from 2024-01-15 show that most of your values are within healthy ranges for your pregnancy stage. Your hemoglobin level indicates good iron levels, which is wonderful for both you and your baby.",
          keyFindings: [
            "Hemoglobin: 12.5 g/dL - Good for pregnancy",
            "Blood Sugar (Fasting): 95 mg/dL - Normal range",
            "Thyroid TSH: 2.1 mIU/L - Within healthy limits"
          ],
          normalFindings: [
            "Hemoglobin: 12.5 g/dL (Normal)", 
            "Blood Sugar: 95 mg/dL (Normal)", 
            "Thyroid TSH: 2.1 mIU/L (Normal)"
          ],
          concerns: ["Vitamin D slightly low at 25 ng/mL"],
          nextSteps: ["Consider Vitamin D supplements", "Increase sun exposure", "Follow up in 3 months"],
          reminders: [
            { id: "1-r1", type: "medicine", title: "Start Vitamin D Supplement", description: "Take Vitamin D supplement daily", completed: false, reportId: "1" }
          ]
        }
      },
      { 
        id: "2", 
        name: "Ultrasound Report", 
        type: "Image", 
        reportCategory: "Ultrasound",
        doctorName: "Dr. Meera Patel",
        reportDate: "2024-01-10",
        uploadDate: "2024-01-10", 
        fileUrl: "#", 
        analyzed: false 
      },
    ];
  });

  const [analysisReminders, setAnalysisReminders] = useState<AnalysisReminder[]>(() => {
    const saved = localStorage.getItem("wellness-analysis-reminders");
    if (saved) return JSON.parse(saved);
    return [
      { id: "1-r1", type: "medicine", title: "Start Vitamin D Supplement", description: "Take Vitamin D supplement daily", completed: false, reportId: "1" }
    ];
  });

  const [wellnessData, setWellnessData] = useState<WellnessData>(() => {
    const saved = localStorage.getItem("wellness-data");
    if (saved) return JSON.parse(saved);
    return generateMockWellnessData();
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("wellness-checklist", JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem("wellness-medicines", JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem("wellness-appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("wellness-reports-v2", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("wellness-analysis-reminders", JSON.stringify(analysisReminders));
  }, [analysisReminders]);

  useEffect(() => {
    localStorage.setItem("wellness-data", JSON.stringify(wellnessData));
  }, [wellnessData]);

  useEffect(() => {
    localStorage.setItem("wellness-user-email", userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem("wellness-email-insights", String(emailInsightsEnabled));
  }, [emailInsightsEnabled]);

  useEffect(() => {
    localStorage.setItem("wellness-medicine-reminders", String(medicineRemindersEnabled));
  }, [medicineRemindersEnabled]);

  useEffect(() => {
    localStorage.setItem("wellness-appointment-reminders", String(appointmentRemindersEnabled));
  }, [appointmentRemindersEnabled]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addChecklistItem = (item: Omit<ChecklistItem, "id" | "date">) => {
    setChecklist(prev => [...prev, { ...item, id: Date.now().toString(), date: getToday() }]);
  };

  const addMedicine = (medicine: Omit<Medicine, "id">) => {
    setMedicines(prev => [...prev, { ...medicine, id: Date.now().toString() }]);
  };

  const toggleMedicineTaken = (id: string) => {
    setMedicines(prev =>
      prev.map(med => med.id === id ? { ...med, taken: !med.taken } : med)
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    setAppointments(prev => [...prev, { ...appointment, id: Date.now().toString() }]);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const addReport = (report: Omit<MedicalReport, "id" | "uploadDate" | "analyzed">) => {
    setReports(prev => [...prev, {
      ...report,
      id: Date.now().toString(),
      uploadDate: getToday(),
      analyzed: false
    }]);
  };

  const analyzeReport = async (id: string): Promise<ReportAnalysis> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const report = reports.find(r => r.id === id);
    if (!report) throw new Error("Report not found");
    
    const analysis = generateAnalysis(report);
    
    // Update the report with analysis
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, analyzed: true, analysis } : r)
    );
    
    // Add reminders from analysis
    setAnalysisReminders(prev => {
      const existingIds = prev.map(r => r.id);
      const newReminders = analysis.reminders.filter(r => !existingIds.includes(r.id));
      return [...prev, ...newReminders];
    });
    
    return analysis;
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
    // Also remove associated reminders
    setAnalysisReminders(prev => prev.filter(r => r.reportId !== id));
  };

  const toggleReminderComplete = (id: string) => {
    setAnalysisReminders(prev =>
      prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    );
  };

  const deleteAnalysisReminder = (id: string) => {
    setAnalysisReminders(prev => prev.filter(r => r.id !== id));
  };

  const logMood = (value: number, emoji: string) => {
    const today = getToday();
    setWellnessData(prev => ({
      ...prev,
      mood: [...prev.mood.filter(m => m.date !== today), { date: today, value, emoji }]
    }));
  };

  const logSleep = (hours: number) => {
    const today = getToday();
    setWellnessData(prev => ({
      ...prev,
      sleep: [...prev.sleep.filter(s => s.date !== today), { date: today, hours }]
    }));
  };

  const logNutrition = (score: number) => {
    const today = getToday();
    setWellnessData(prev => ({
      ...prev,
      nutrition: [...prev.nutrition.filter(n => n.date !== today), { date: today, score }]
    }));
  };

  const logActivity = (steps: number) => {
    const today = getToday();
    setWellnessData(prev => ({
      ...prev,
      activity: [...prev.activity.filter(a => a.date !== today), { date: today, steps }]
    }));
  };

  return (
    <WellnessContext.Provider value={{
      userName,
      userEmail,
      setUserEmail,
      pregnancyStage,
      checklist,
      toggleChecklistItem,
      addChecklistItem,
      medicines,
      addMedicine,
      toggleMedicineTaken,
      deleteMedicine,
      appointments,
      addAppointment,
      deleteAppointment,
      reports,
      addReport,
      analyzeReport,
      deleteReport,
      analysisReminders,
      toggleReminderComplete,
      deleteAnalysisReminder,
      wellnessData,
      logMood,
      logSleep,
      logNutrition,
      logActivity,
      emailInsightsEnabled,
      setEmailInsightsEnabled,
      medicineRemindersEnabled,
      setMedicineRemindersEnabled,
      appointmentRemindersEnabled,
      setAppointmentRemindersEnabled,
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) throw new Error("useWellness must be used within WellnessProvider");
  return context;
};
