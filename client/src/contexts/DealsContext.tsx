import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Document {
  id: number;
  name: string;
  status: 'Pending' | 'Completed';
  completedDate: string;
}

interface Deal {
  id: number;
  dealNumber: string;
  customerName: string;
  vehicleInfo: string;
  vehicleType: 'New' | 'Used';
  salePrice: number;
  tradeInValue: number;
  tradeInVehicle?: string;
  tradeInId?: number;
  downPayment: number;
  financeAmount: number;
  dealStage: 'Negotiation' | 'Paperwork' | 'Finance Approval' | 'Ready for Delivery' | 'Delivered' | 'Cancelled';
  paperworkStatus: 'Not Started' | 'In Progress' | 'Pending Signatures' | 'Completed';
  deliveryDate: string;
  actualDeliveryDate: string;
  salesPerson: string;
  fiManager: string;
  totalProfit: number;
  frontEndProfit: number;
  backEndProfit: number;
  dealDate: string;
  notes: string;
  documents?: Document[];
}

interface FIProduct {
  id: number;
  dealNumber: string;
  customerName: string;
  vehicleInfo: string;
  financeAmount: number;
  apr: number;
  term: number;
  monthlyPayment: number;
  warranty: WarrantyProduct | null;
  gapInsurance: boolean;
  gapCost: number;
  aftermarketProducts: AftermarketProduct[];
  lender: string;
  dealDate: string;
  status: 'Pending' | 'Approved' | 'Funded' | 'Delivered';
  salesPerson: string;
  fiManager: string;
  totalProfit: number;
  notes: string;
  // Original deal fields
  vehicleType?: 'New' | 'Used';
  salePrice?: number;
  tradeInValue?: number;
  tradeInVehicle?: string;
  downPayment?: number;
}

interface WarrantyProduct {
  type: string;
  provider: string;
  term: string;
  mileage: string;
  cost: number;
  retailPrice: number;
}

interface AftermarketProduct {
  id: number;
  name: string;
  category: string;
  cost: number;
  retailPrice: number;
}

interface DealsContextType {
  submitDealToFI: (deal: Deal) => FIProduct;
  returnDealToSales: (fiDeal: FIProduct) => Deal;
  fiDeals: FIProduct[];
  returnedDeals: Deal[];
  addFIDeal: (deal: FIProduct) => void;
  updateFIDeal: (deal: FIProduct) => void;
  deleteFIDeal: (id: number) => void;
  removeReturnedDeal: (id: number) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fiDeals, setFiDeals] = useState<FIProduct[]>([]);
  const [returnedDeals, setReturnedDeals] = useState<Deal[]>([]);

  const submitDealToFI = (deal: Deal): FIProduct => {
    // Convert Deal to FIProduct
    const fiDeal: FIProduct = {
      id: deal.id,
      dealNumber: deal.dealNumber,
      customerName: deal.customerName,
      vehicleInfo: deal.vehicleInfo,
      vehicleType: deal.vehicleType,
      salePrice: deal.salePrice,
      tradeInValue: deal.tradeInValue,
      tradeInVehicle: deal.tradeInVehicle,
      downPayment: deal.downPayment,
      financeAmount: deal.financeAmount,
      apr: 0,
      term: 60,
      monthlyPayment: 0,
      warranty: null,
      gapInsurance: false,
      gapCost: 0,
      aftermarketProducts: [],
      lender: '',
      dealDate: deal.dealDate,
      status: 'Pending',
      salesPerson: deal.salesPerson,
      fiManager: deal.fiManager,
      totalProfit: 0,
      notes: `Submitted from deal ${deal.dealNumber}. Original notes: ${deal.notes}`,
    };

    setFiDeals(prev => [...prev, fiDeal]);
    return fiDeal;
  };

  const returnDealToSales = (fiDeal: FIProduct): Deal => {
    // Convert FIProduct back to Deal format
    const deal: Deal = {
      id: fiDeal.id,
      dealNumber: fiDeal.dealNumber,
      customerName: fiDeal.customerName,
      vehicleInfo: fiDeal.vehicleInfo,
      vehicleType: fiDeal.vehicleType || 'Used',
      salePrice: fiDeal.salePrice || fiDeal.financeAmount,
      tradeInValue: fiDeal.tradeInValue || 0,
      tradeInVehicle: fiDeal.tradeInVehicle,
      downPayment: fiDeal.downPayment || 0,
      financeAmount: fiDeal.financeAmount,
      dealStage: 'Finance Approval', // Return to Finance Approval stage
      paperworkStatus: 'In Progress',
      deliveryDate: fiDeal.dealDate,
      actualDeliveryDate: '',
      salesPerson: fiDeal.salesPerson,
      fiManager: fiDeal.fiManager,
      totalProfit: fiDeal.totalProfit,
      frontEndProfit: fiDeal.totalProfit,
      backEndProfit: 0,
      dealDate: fiDeal.dealDate,
      notes: `Returned from F&I. ${fiDeal.notes}`,
      documents: [
        { id: 1, name: 'Purchase Agreement', status: 'Completed', completedDate: fiDeal.dealDate },
        { id: 2, name: 'Finance Contract', status: 'Pending', completedDate: '' },
        { id: 3, name: 'Trade-In Agreement', status: fiDeal.tradeInValue ? 'Completed' : 'Pending', completedDate: fiDeal.tradeInValue ? fiDeal.dealDate : '' },
        { id: 4, name: 'Title Transfer', status: 'Pending', completedDate: '' },
        { id: 5, name: 'Registration', status: 'Pending', completedDate: '' },
      ],
    };

    setReturnedDeals(prev => [...prev, deal]);
    return deal;
  };

  const addFIDeal = (deal: FIProduct) => {
    setFiDeals(prev => [...prev, deal]);
  };

  const updateFIDeal = (deal: FIProduct) => {
    setFiDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
  };

  const deleteFIDeal = (id: number) => {
    setFiDeals(prev => prev.filter(d => d.id !== id));
  };

  const removeReturnedDeal = (id: number) => {
    setReturnedDeals(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DealsContext.Provider value={{ 
      submitDealToFI, 
      returnDealToSales,
      fiDeals, 
      returnedDeals,
      addFIDeal, 
      updateFIDeal, 
      deleteFIDeal,
      removeReturnedDeal
    }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (!context) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};
