import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Plus, Trash2, Clock, User, Stethoscope, Bell } from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";

const AppointmentsPage = () => {
  const { appointments, addAppointment, deleteAppointment } = useWellness();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newAppointment, setNewAppointment] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleAddAppointment = () => {
    if (!newAppointment.doctorName || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in doctor name, date, and time",
        variant: "destructive",
      });
      return;
    }

    addAppointment(newAppointment);
    setNewAppointment({ doctorName: "", specialty: "", date: "", time: "", notes: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Appointment Scheduled",
      description: `Appointment with ${newAppointment.doctorName} has been added`,
    });
  };

  const handleDelete = (id: string, doctorName: string) => {
    deleteAppointment(id);
    toast({
      title: "Appointment Cancelled",
      description: `Appointment with ${doctorName} has been removed`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date(new Date().toDateString());
  };

  const upcomingAppointments = appointments.filter(a => isUpcoming(a.date));
  const pastAppointments = appointments.filter(a => !isUpcoming(a.date));

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Doctor Appointments
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your prenatal visits 📅
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="doctorName">Doctor's Name</Label>
                <Input
                  id="doctorName"
                  value={newAppointment.doctorName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                  placeholder="e.g., Dr. Priya Sharma"
                />
              </div>
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={newAppointment.specialty}
                  onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                  placeholder="e.g., Gynecologist"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="e.g., Bring previous reports"
                />
              </div>
              <Button onClick={handleAddAppointment} className="w-full">
                Schedule Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Overview */}
      <Card className="mb-8 bg-gradient-to-br from-coral-light to-sage-light border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {upcomingAppointments.length} appointment{upcomingAppointments.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-coral" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Upcoming Appointments
        </h2>
        
        {upcomingAppointments.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming appointments</p>
            <p className="text-sm text-muted-foreground">
              Click "Book Appointment" to schedule one
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-coral-light flex flex-col items-center justify-center text-coral-dark">
                      <span className="text-xs font-medium">
                        {new Date(appointment.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold">
                        {new Date(appointment.date).getDate()}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {appointment.doctorName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                        {appointment.specialty && (
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-4 h-4" />
                            {appointment.specialty}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          📝 {appointment.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded-full bg-sage-light text-sage-dark text-xs flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        Reminder set
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(appointment.id, appointment.doctorName)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Past Appointments
          </h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex flex-col items-center justify-center text-muted-foreground text-xs">
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{appointment.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AppointmentsPage;
