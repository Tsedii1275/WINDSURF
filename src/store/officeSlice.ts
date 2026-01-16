import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Training Request Types
export interface TrainingRequest {
  id: string;
  applicantName: string;
  applicantEmail: string;
  requestedItem: string;
  submissionDate: string;
  status: "Pending" | "Approved" | "Rejected";
  motivation: string;
  notes: string;
}

// Rental Request Types
export interface RentalRequest {
  id: string;
  applicantName: string;
  applicantEmail: string;
  requestedItem: string;
  submissionDate: string;
  status: "Pending" | "Approved" | "Rejected";
  motivation: string;
  notes: string;
}

// Training Management Types
export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: "Active" | "Inactive";
  enrolledCount: number;
}

// Facility Management Types
export interface Facility {
  id: string;
  name: string;
  type: string;
  description: string;
  availability: "Available" | "Unavailable" | "Maintenance";
  status: "Active" | "Inactive";
  capacity: number;
}

// Initial mock data
const initialTrainingRequests: TrainingRequest[] = [
  {
    id: "TR001",
    applicantName: "Abebe Kebede",
    applicantEmail: "abebe@gmail.com",
    requestedItem: "Python for Data Science",
    submissionDate: "2025-01-08",
    status: "Pending",
    motivation: "Looking to enhance my data analysis skills for my research work",
    notes: "Graduate student in Computer Science department"
  },
  {
    id: "TR002", 
    applicantName: "Sarah Michael",
    applicantEmail: "sarah.m@yahoo.com",
    requestedItem: "Project Management",
    submissionDate: "2025-01-07",
    status: "Approved",
    motivation: "Need PMP certification for career advancement",
    notes: "Works at Ethiopian Airlines"
  },
  {
    id: "TR003",
    applicantName: "Dawit Samuel", 
    applicantEmail: "dawit@aau.edu.et",
    requestedItem: "Strategic Leadership",
    submissionDate: "2025-01-06",
    status: "Rejected",
    motivation: "Leadership development for management role",
    notes: "Faculty member in Business School"
  }
];

const initialRentalRequests: RentalRequest[] = [
  {
    id: "RR001",
    applicantName: "Debub Global Bank",
    applicantEmail: "events@debubbank.com",
    requestedItem: "Nelson Mandela Hall",
    submissionDate: "2025-01-15",
    status: "Pending",
    motivation: "Annual general meeting for shareholders and board members",
    notes: "Expected attendance: 200 people, needs audio equipment"
  },
  {
    id: "RR002",
    applicantName: "Tech Ethiopia 2025",
    applicantEmail: "info@techethiopia.org",
    requestedItem: "ICT Center Conference Room",
    submissionDate: "2025-01-20",
    status: "Approved",
    motivation: "Technology conference and startup showcase event",
    notes: "3-day event, requires parking arrangements"
  },
  {
    id: "RR003",
    applicantName: "Zemen Bank",
    applicantEmail: "training@zemenbank.com",
    requestedItem: "Main Laboratory A",
    submissionDate: "2025-01-10",
    status: "Rejected",
    motivation: "Staff training program on new banking software",
    notes: "Requested dates conflict with university exam schedule"
  }
];

const initialTrainings: Training[] = [
  {
    id: "T001",
    title: "Python for Data Science",
    description: "Comprehensive training on Python programming for data analysis and machine learning",
    startDate: "2025-02-01",
    endDate: "2025-02-15",
    capacity: 30,
    status: "Active",
    enrolledCount: 25
  },
  {
    id: "T002",
    title: "Project Management",
    description: "Professional project management course covering PMP methodologies and best practices",
    startDate: "2025-02-10",
    endDate: "2025-02-20",
    capacity: 25,
    status: "Active",
    enrolledCount: 18
  },
  {
    id: "T003",
    title: "Strategic Leadership",
    description: "Advanced leadership development program for managers and executives",
    startDate: "2025-01-15",
    endDate: "2025-01-25",
    capacity: 20,
    status: "Inactive",
    enrolledCount: 15
  }
];

const initialFacilities: Facility[] = [
  {
    id: "F001",
    name: "Nelson Mandela Hall",
    type: "Conference Hall",
    description: "Large conference hall with seating for 200 people, equipped with audio-visual systems",
    availability: "Available",
    status: "Active",
    capacity: 200
  },
  {
    id: "F002",
    name: "ICT Center Conference Room",
    type: "Conference Room",
    description: "Modern conference room with high-speed internet and presentation equipment",
    availability: "Available",
    status: "Active",
    capacity: 50
  },
  {
    id: "F003",
    name: "Main Laboratory A",
    type: "Laboratory",
    description: "Computer laboratory with 30 workstations and specialized software",
    availability: "Unavailable",
    status: "Active",
    capacity: 30
  }
];

interface OfficeState {
  trainingRequests: TrainingRequest[];
  rentalRequests: RentalRequest[];
  trainings: Training[];
  facilities: Facility[];
  loading: boolean;
}

const initialState: OfficeState = {
  trainingRequests: initialTrainingRequests,
  rentalRequests: initialRentalRequests,
  trainings: initialTrainings,
  facilities: initialFacilities,
  loading: false
};

const officeSlice = createSlice({
  name: 'office',
  initialState,
  reducers: {
    // Training Request Actions
    updateTrainingRequestStatus: (state, action: PayloadAction<{ id: string; status: "Approved" | "Rejected" }>) => {
      const request = state.trainingRequests.find(req => req.id === action.payload.id);
      if (request) {
        request.status = action.payload.status;
      }
    },
    
    // Rental Request Actions
    updateRentalRequestStatus: (state, action: PayloadAction<{ id: string; status: "Approved" | "Rejected" }>) => {
      const request = state.rentalRequests.find(req => req.id === action.payload.id);
      if (request) {
        request.status = action.payload.status;
      }
    },
    
    // Training Management Actions
    addTraining: (state, action: PayloadAction<Omit<Training, 'id' | 'enrolledCount'>>) => {
      const newTraining: Training = {
        ...action.payload,
        id: `T${String(state.trainings.length + 1).padStart(3, '0')}`,
        enrolledCount: 0
      };
      state.trainings.push(newTraining);
    },
    
    updateTraining: (state, action: PayloadAction<{ id: string; updates: Partial<Training> }>) => {
      const training = state.trainings.find(t => t.id === action.payload.id);
      if (training) {
        Object.assign(training, action.payload.updates);
      }
    },
    
    deleteTraining: (state, action: PayloadAction<string>) => {
      state.trainings = state.trainings.filter(t => t.id !== action.payload);
    },
    
    // Facility Management Actions
    addFacility: (state, action: PayloadAction<Omit<Facility, 'id'>>) => {
      const newFacility: Facility = {
        ...action.payload,
        id: `F${String(state.facilities.length + 1).padStart(3, '0')}`
      };
      state.facilities.push(newFacility);
    },
    
    updateFacility: (state, action: PayloadAction<{ id: string; updates: Partial<Facility> }>) => {
      const facility = state.facilities.find(f => f.id === action.payload.id);
      if (facility) {
        Object.assign(facility, action.payload.updates);
      }
    },
    
    deleteFacility: (state, action: PayloadAction<string>) => {
      state.facilities = state.facilities.filter(f => f.id !== action.payload);
    },
    
    // Loading Actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const {
  updateTrainingRequestStatus,
  updateRentalRequestStatus,
  addTraining,
  updateTraining,
  deleteTraining,
  addFacility,
  updateFacility,
  deleteFacility,
  setLoading
} = officeSlice.actions;

export default officeSlice.reducer;
