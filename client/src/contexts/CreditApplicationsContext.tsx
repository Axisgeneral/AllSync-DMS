import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CreditApplication {
  id: number;
  applicationNumber: string;
  customerName: string;
  ssn: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: 'Employed' | 'Self-Employed' | 'Retired' | 'Unemployed';
  employer: string;
  monthlyIncome: number;
  yearsEmployed: number;
  residenceType: 'Own' | 'Rent' | 'Other';
  monthlyPayment: number;
  yearsAtResidence: number;
  vehicleOfInterest: string;
  requestedAmount: number;
  downPayment: number;
  tradeInValue: number;
  creditScore?: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Denied' | 'Conditional';
  submittedTo?: string;
  submittedDate?: string;
  approvalDate?: string;
  approvedAmount?: number;
  apr?: number;
  term?: number;
  monthlyPaymentApproved?: number;
  stipulations?: string;
  denialReason?: string;
  applicationDate: string;
  salesPerson: string;
  notes: string;
}

interface PendingCreditApplication extends CreditApplication {
  fiManagerAssigned?: string;
  lenderNotes?: string;
  documentsReceived?: string[];
  followUpDate?: string;
}

interface CreditApplicationsContextType {
  submitToFI: (application: CreditApplication, lender: string) => PendingCreditApplication;
  pendingApplications: PendingCreditApplication[];
  updatePendingApplication: (application: PendingCreditApplication) => void;
  removePendingApplication: (id: number) => void;
  approveApplication: (id: number, approvalData: {
    approvedAmount: number;
    apr: number;
    term: number;
    monthlyPaymentApproved: number;
    stipulations?: string;
  }) => void;
  denyApplication: (id: number, denialReason: string) => void;
}

const CreditApplicationsContext = createContext<CreditApplicationsContextType | undefined>(undefined);

export const CreditApplicationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingApplications, setPendingApplications] = useState<PendingCreditApplication[]>([]);

  const submitToFI = (application: CreditApplication, lender: string): PendingCreditApplication => {
    const pendingApp: PendingCreditApplication = {
      ...application,
      status: 'Submitted',
      submittedTo: lender,
      submittedDate: new Date().toISOString().split('T')[0],
      fiManagerAssigned: '',
      lenderNotes: '',
      documentsReceived: [],
      followUpDate: '',
      notes: `${application.notes}\n\nSubmitted to ${lender} on ${new Date().toISOString().split('T')[0]}`,
    };

    setPendingApplications(prev => [...prev, pendingApp]);
    return pendingApp;
  };

  const updatePendingApplication = (application: PendingCreditApplication) => {
    setPendingApplications(prev => 
      prev.map(app => app.id === application.id ? application : app)
    );
  };

  const removePendingApplication = (id: number) => {
    setPendingApplications(prev => prev.filter(app => app.id !== id));
  };

  const approveApplication = (id: number, approvalData: {
    approvedAmount: number;
    apr: number;
    term: number;
    monthlyPaymentApproved: number;
    stipulations?: string;
  }) => {
    setPendingApplications(prev =>
      prev.map(app =>
        app.id === id
          ? {
              ...app,
              status: approvalData.stipulations ? 'Conditional' : 'Approved',
              approvalDate: new Date().toISOString().split('T')[0],
              ...approvalData,
            }
          : app
      )
    );
  };

  const denyApplication = (id: number, denialReason: string) => {
    setPendingApplications(prev =>
      prev.map(app =>
        app.id === id
          ? {
              ...app,
              status: 'Denied',
              approvalDate: new Date().toISOString().split('T')[0],
              denialReason,
            }
          : app
      )
    );
  };

  return (
    <CreditApplicationsContext.Provider
      value={{
        submitToFI,
        pendingApplications,
        updatePendingApplication,
        removePendingApplication,
        approveApplication,
        denyApplication,
      }}
    >
      {children}
    </CreditApplicationsContext.Provider>
  );
};

export const useCreditApplications = () => {
  const context = useContext(CreditApplicationsContext);
  if (!context) {
    throw new Error('useCreditApplications must be used within a CreditApplicationsProvider');
  }
  return context;
};
