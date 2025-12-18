import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pill, Plus, Trash2, Clock, Bell, CheckCircle2 } from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useToast } from "@/hooks/use-toast";

const MedicinesPage = () => {
  const { medicines, addMedicine, toggleMedicineTaken, deleteMedicine } = useWellness();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "Daily",
  });

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addMedicine({ ...newMedicine, taken: false });
    setNewMedicine({ name: "", dosage: "", time: "", frequency: "Daily" });
    setIsDialogOpen(false);
    
    toast({
      title: "Medicine Added",
      description: `${newMedicine.name} has been added to your reminders`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteMedicine(id);
    toast({
      title: "Medicine Removed",
      description: `${name} has been removed from your list`,
    });
  };

  const takenCount = medicines.filter(m => m.taken).length;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Medicine Reminders
          </h1>
          <p className="text-muted-foreground">
            Keep track of your medications and never miss a dose 💊
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="e.g., Prenatal Vitamins"
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  placeholder="e.g., 1 tablet"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newMedicine.time}
                  onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newMedicine.frequency}
                  onValueChange={(value) => setNewMedicine({ ...newMedicine, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMedicine} className="w-full">
                Add Medicine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Summary */}
      <Card className="mb-8 bg-gradient-to-br from-coral-light to-sage-light border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {takenCount} of {medicines.length} taken
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center">
              <Pill className="w-8 h-8 text-coral" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicine List */}
      <div className="space-y-4">
        {medicines.length === 0 ? (
          <Card className="p-8 text-center">
            <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No medicines added yet</p>
            <p className="text-sm text-muted-foreground">
              Click "Add Medicine" to get started
            </p>
          </Card>
        ) : (
          medicines.map((medicine) => (
            <Card
              key={medicine.id}
              variant="elevated"
              className={`transition-all duration-300 ${
                medicine.taken ? "ring-2 ring-sage bg-sage-light/30" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleMedicineTaken(medicine.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      medicine.taken
                        ? "bg-sage text-background"
                        : "bg-muted hover:bg-coral-light"
                    }`}
                  >
                    {medicine.taken ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Pill className="w-6 h-6" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${medicine.taken ? "line-through opacity-70" : ""}`}>
                      {medicine.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{medicine.dosage}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {medicine.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell className="w-4 h-4" />
                        {medicine.frequency}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(medicine.id, medicine.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reminder Note */}
      <Card className="mt-8 bg-lavender-light border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">💡 Medicine Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Take medicines at the same time each day</li>
            <li>• Store medicines in a cool, dry place</li>
            <li>• Always follow your doctor's instructions</li>
            <li>• Never skip doses without consulting your doctor</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicinesPage;
