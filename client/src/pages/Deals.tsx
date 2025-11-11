import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Tabs,
  Tab,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import GridOnIcon from '@mui/icons-material/GridOn';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDeals } from '../contexts/DealsContext';

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
  documents: DealDocument[];
}

interface DealDocument {
  id: number;
  name: string;
  status: 'Pending' | 'Completed';
  completedDate: string;
}

interface TradeIn {
  id: number;
  tradeNumber: string;
  vehicleInfo: string;
  year: number;
  make: string;
  model: string;
  appraisalValue: number;
  customerName: string;
  status: string;
}

const Deals: React.FC = () => {
  const { submitDealToFI, returnedDeals, removeReturnedDeal } = useDeals();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [availableTradeIns, setAvailableTradeIns] = useState<TradeIn[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [fourSquareOpen, setFourSquareOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const fourSquareRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDeal, setMenuDeal] = useState<Deal | null>(null);
  
  // Four Square state
  const [fourSquareData, setFourSquareData] = useState({
    interestRate: 5.99,
    loanTerm: 60, // months
    downPaymentOptions: [3000, 5000, 7000],
  });
  
  const [formData, setFormData] = useState<Partial<Deal>>({
    dealNumber: '',
    customerName: '',
    vehicleInfo: '',
    vehicleType: 'New',
    salePrice: 0,
    tradeInValue: 0,
    tradeInVehicle: '',
    tradeInId: undefined,
    downPayment: 0,
    financeAmount: 0,
    dealStage: 'Negotiation',
    paperworkStatus: 'Not Started',
    deliveryDate: '',
    actualDeliveryDate: '',
    salesPerson: '',
    fiManager: '',
    totalProfit: 0,
    frontEndProfit: 0,
    backEndProfit: 0,
    dealDate: new Date().toISOString().split('T')[0],
    notes: '',
    documents: [],
  });

  // Mock data
  useEffect(() => {
    // Mock available trade-ins
    const mockTradeIns: TradeIn[] = [
      { id: 1, tradeNumber: 'TR-2025-1001', vehicleInfo: '2020 Honda Accord Sport', year: 2020, make: 'Honda', model: 'Accord Sport', appraisalValue: 17500, customerName: 'John Smith', status: 'Accepted' },
      { id: 2, tradeNumber: 'TR-2025-1002', vehicleInfo: '2018 Ford Explorer XLT', year: 2018, make: 'Ford', model: 'Explorer XLT', appraisalValue: 15000, customerName: 'Robert Taylor', status: 'Accepted' },
      { id: 3, tradeNumber: 'TR-2025-1003', vehicleInfo: '2019 Mazda CX-5 Grand Touring', year: 2019, make: 'Mazda', model: 'CX-5 Grand Touring', appraisalValue: 20000, customerName: 'Jennifer Wilson', status: 'Accepted' },
      { id: 4, tradeNumber: 'TR-2025-1004', vehicleInfo: '2017 Subaru Outback 2.5i', year: 2017, make: 'Subaru', model: 'Outback 2.5i', appraisalValue: 11500, customerName: 'Lisa Anderson', status: 'Accepted' },
      { id: 5, tradeNumber: 'TR-2025-1005', vehicleInfo: '2016 Chevrolet Silverado 1500', year: 2016, make: 'Chevrolet', model: 'Silverado 1500', appraisalValue: 16000, customerName: 'Michael Brown', status: 'Appraised' },
      { id: 6, tradeNumber: 'TR-2025-1006', vehicleInfo: '2021 Toyota RAV4 XLE', year: 2021, make: 'Toyota', model: 'RAV4 XLE', appraisalValue: 24000, customerName: 'Sarah Martinez', status: 'Appraised' },
    ];
    setAvailableTradeIns(mockTradeIns);

    const mockDeals: Deal[] = [
      {
        id: 1,
        dealNumber: 'DL-2025-1001',
        customerName: 'John Smith',
        vehicleInfo: '2024 Honda CR-V EX',
        vehicleType: 'New',
        salePrice: 35000,
        tradeInValue: 8000,
        tradeInVehicle: '2020 Honda Accord Sport',
        tradeInId: 1,
        downPayment: 5000,
        financeAmount: 22000,
        dealStage: 'Delivered',
        paperworkStatus: 'Completed',
        deliveryDate: '2025-11-08',
        actualDeliveryDate: '2025-11-08',
        salesPerson: 'Sarah Johnson',
        fiManager: 'Mike Wilson',
        totalProfit: 4500,
        frontEndProfit: 2000,
        backEndProfit: 2500,
        dealDate: '2025-11-05',
        notes: 'Smooth transaction, customer very happy',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Completed', completedDate: '2025-11-05' },
          { id: 2, name: 'Finance Contract', status: 'Completed', completedDate: '2025-11-06' },
          { id: 3, name: 'Trade-In Agreement', status: 'Completed', completedDate: '2025-11-05' },
          { id: 4, name: 'Title Transfer', status: 'Completed', completedDate: '2025-11-08' },
          { id: 5, name: 'Registration', status: 'Completed', completedDate: '2025-11-08' },
        ],
      },
      {
        id: 2,
        dealNumber: 'DL-2025-1002',
        customerName: 'Emily Davis',
        vehicleInfo: '2025 Toyota Camry XLE',
        vehicleType: 'New',
        salePrice: 32000,
        tradeInValue: 0,
        downPayment: 8000,
        financeAmount: 24000,
        dealStage: 'Ready for Delivery',
        paperworkStatus: 'Completed',
        deliveryDate: '2025-11-12',
        actualDeliveryDate: '',
        salesPerson: 'Mike Wilson',
        fiManager: 'Mike Wilson',
        totalProfit: 5100,
        frontEndProfit: 2500,
        backEndProfit: 2600,
        dealDate: '2025-11-09',
        notes: 'Customer requested ceramic coating before delivery',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Completed', completedDate: '2025-11-09' },
          { id: 2, name: 'Finance Contract', status: 'Completed', completedDate: '2025-11-10' },
          { id: 3, name: 'Trade-In Agreement', status: 'Completed', completedDate: '' },
          { id: 4, name: 'Title Transfer', status: 'Pending', completedDate: '' },
          { id: 5, name: 'Registration', status: 'Pending', completedDate: '' },
        ],
      },
      {
        id: 3,
        dealNumber: 'DL-2025-1003',
        customerName: 'Robert Taylor',
        vehicleInfo: '2024 Ford F-150 Lariat',
        vehicleType: 'New',
        salePrice: 58000,
        tradeInValue: 15000,
        tradeInVehicle: '2018 Ford Explorer XLT',
        tradeInId: 2,
        downPayment: 10000,
        financeAmount: 33000,
        dealStage: 'Finance Approval',
        paperworkStatus: 'Pending Signatures',
        deliveryDate: '2025-11-14',
        actualDeliveryDate: '',
        salesPerson: 'Sarah Johnson',
        fiManager: 'Mike Wilson',
        totalProfit: 4200,
        frontEndProfit: 3000,
        backEndProfit: 1200,
        dealDate: '2025-11-10',
        notes: 'Waiting for final finance approval from Ford Credit',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Completed', completedDate: '2025-11-10' },
          { id: 2, name: 'Finance Contract', status: 'Pending', completedDate: '' },
          { id: 3, name: 'Trade-In Agreement', status: 'Completed', completedDate: '2025-11-10' },
          { id: 4, name: 'Title Transfer', status: 'Pending', completedDate: '' },
          { id: 5, name: 'Registration', status: 'Pending', completedDate: '' },
        ],
      },
      {
        id: 4,
        dealNumber: 'DL-2025-1004',
        customerName: 'Jennifer Wilson',
        vehicleInfo: '2023 Mazda CX-5 Touring',
        vehicleType: 'Used',
        salePrice: 27500,
        tradeInValue: 6000,
        tradeInVehicle: '2019 Mazda CX-5 Grand Touring',
        tradeInId: 3,
        downPayment: 4000,
        financeAmount: 17500,
        dealStage: 'Paperwork',
        paperworkStatus: 'In Progress',
        deliveryDate: '2025-11-13',
        actualDeliveryDate: '',
        salesPerson: 'Mike Wilson',
        fiManager: 'Mike Wilson',
        totalProfit: 3800,
        frontEndProfit: 2200,
        backEndProfit: 1600,
        dealDate: '2025-11-11',
        notes: 'Customer still reviewing F&I products',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Completed', completedDate: '2025-11-11' },
          { id: 2, name: 'Finance Contract', status: 'Pending', completedDate: '' },
          { id: 3, name: 'Trade-In Agreement', status: 'Completed', completedDate: '2025-11-11' },
          { id: 4, name: 'Title Transfer', status: 'Pending', completedDate: '' },
          { id: 5, name: 'Registration', status: 'Pending', completedDate: '' },
        ],
      },
      {
        id: 5,
        dealNumber: 'DL-2025-1005',
        customerName: 'Michael Brown',
        vehicleInfo: '2024 Chevrolet Silverado 1500',
        vehicleType: 'New',
        salePrice: 52000,
        tradeInValue: 12000,
        downPayment: 7000,
        financeAmount: 33000,
        dealStage: 'Negotiation',
        paperworkStatus: 'Not Started',
        deliveryDate: '2025-11-16',
        actualDeliveryDate: '',
        salesPerson: 'Sarah Johnson',
        fiManager: '',
        totalProfit: 0,
        frontEndProfit: 0,
        backEndProfit: 0,
        dealDate: '2025-11-11',
        notes: 'Customer considering multiple trim levels',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Pending', completedDate: '' },
          { id: 2, name: 'Finance Contract', status: 'Pending', completedDate: '' },
          { id: 3, name: 'Trade-In Agreement', status: 'Pending', completedDate: '' },
          { id: 4, name: 'Title Transfer', status: 'Pending', completedDate: '' },
          { id: 5, name: 'Registration', status: 'Pending', completedDate: '' },
        ],
      },
      {
        id: 6,
        dealNumber: 'DL-2025-1006',
        customerName: 'Lisa Anderson',
        vehicleInfo: '2024 Subaru Outback Premium',
        vehicleType: 'New',
        salePrice: 36000,
        tradeInValue: 9000,
        downPayment: 6000,
        financeAmount: 21000,
        dealStage: 'Delivered',
        paperworkStatus: 'Completed',
        deliveryDate: '2025-11-07',
        actualDeliveryDate: '2025-11-07',
        salesPerson: 'Mike Wilson',
        fiManager: 'Mike Wilson',
        totalProfit: 4800,
        frontEndProfit: 2300,
        backEndProfit: 2500,
        dealDate: '2025-11-04',
        notes: 'Repeat customer, excellent experience',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Completed', completedDate: '2025-11-04' },
          { id: 2, name: 'Finance Contract', status: 'Completed', completedDate: '2025-11-05' },
          { id: 3, name: 'Trade-In Agreement', status: 'Completed', completedDate: '2025-11-04' },
          { id: 4, name: 'Title Transfer', status: 'Completed', completedDate: '2025-11-07' },
          { id: 5, name: 'Registration', status: 'Completed', completedDate: '2025-11-07' },
        ],
      },
    ];
    
    // Merge mock deals with any returned deals from F&I
    // Ensure returned deals have documents property
    const validReturnedDeals = returnedDeals.map(deal => ({
      ...deal,
      documents: deal.documents || []
    }));
    const allDeals = [...mockDeals, ...validReturnedDeals];
    setDeals(allDeals);
  }, [returnedDeals]);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredDeals = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return deals;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return deals.filter((deal) => {
      if (normalizeText(deal.dealNumber).includes(searchTerm)) return true;
      if (normalizeText(deal.customerName).includes(searchTerm)) return true;
      if (normalizeText(deal.vehicleInfo).includes(searchTerm)) return true;
      if (normalizeText(deal.dealStage).includes(searchTerm)) return true;
      if (normalizeText(deal.paperworkStatus).includes(searchTerm)) return true;
      if (normalizeText(deal.salesPerson).includes(searchTerm)) return true;
      if (normalizeText(deal.fiManager).includes(searchTerm)) return true;
      if (deal.notes && normalizeText(deal.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [deals, searchQuery]);

  const handleOpen = (dealMode: 'add' | 'edit' | 'view', deal?: Deal) => {
    setMode(dealMode);
    if (deal) {
      setSelectedDeal(deal);
      if (dealMode === 'edit') {
        setFormData(deal);
      }
    } else {
      setFormData({
        dealNumber: `DL-2025-${(deals.length + 1001).toString()}`,
        customerName: '',
        vehicleInfo: '',
        vehicleType: 'New',
        salePrice: 0,
        tradeInValue: 0,
        tradeInVehicle: '',
        tradeInId: undefined,
        downPayment: 0,
        financeAmount: 0,
        dealStage: 'Negotiation',
        paperworkStatus: 'Not Started',
        deliveryDate: '',
        actualDeliveryDate: '',
        salesPerson: '',
        fiManager: '',
        totalProfit: 0,
        frontEndProfit: 0,
        backEndProfit: 0,
        dealDate: new Date().toISOString().split('T')[0],
        notes: '',
        documents: [
          { id: 1, name: 'Purchase Agreement', status: 'Pending', completedDate: '' },
          { id: 2, name: 'Finance Contract', status: 'Pending', completedDate: '' },
          { id: 3, name: 'Trade-In Agreement', status: 'Pending', completedDate: '' },
          { id: 4, name: 'Title Transfer', status: 'Pending', completedDate: '' },
          { id: 5, name: 'Registration', status: 'Pending', completedDate: '' },
        ],
      });
    }
    if (dealMode === 'view') {
      setViewOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setFourSquareOpen(false);
    setSelectedDeal(null);
    setTabValue(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, deal: Deal) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuDeal(deal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDeal(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete' | 'foursquare' | 'submit') => {
    if (menuDeal) {
      if (action === 'view') {
        handleOpen('view', menuDeal);
      } else if (action === 'edit') {
        handleOpen('edit', menuDeal);
      } else if (action === 'delete') {
        handleDelete(menuDeal.id);
      } else if (action === 'foursquare') {
        handleOpenFourSquare(menuDeal);
      } else if (action === 'submit') {
        handleSubmitToFI(menuDeal);
      }
    }
    handleMenuClose();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  // Four Square calculations
  const calculatePayment = (principal: number, rate: number, months: number): number => {
    if (principal <= 0 || months <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };
  
  const getFourSquareCalculations = () => {
    if (!selectedDeal) return [];
    
    const { salePrice, tradeInValue } = selectedDeal;
    const { interestRate, loanTerm, downPaymentOptions } = fourSquareData;
    
    return downPaymentOptions.map(downPayment => {
      const netSalePrice = salePrice - tradeInValue;
      const amountToFinance = netSalePrice - downPayment;
      const monthlyPayment = calculatePayment(amountToFinance, interestRate, loanTerm);
      const totalPayments = monthlyPayment * loanTerm;
      const totalInterest = totalPayments - amountToFinance;
      const totalCost = downPayment + totalPayments + tradeInValue;
      
      return {
        downPayment,
        amountToFinance,
        monthlyPayment,
        totalPayments,
        totalInterest,
        totalCost,
      };
    });
  };
  
  const handleOpenFourSquare = (deal: Deal) => {
    setSelectedDeal(deal);
    // Set default down payment options based on sale price
    const suggestedDown = Math.round(deal.salePrice * 0.1 / 1000) * 1000; // 10% rounded
    setFourSquareData({
      ...fourSquareData,
      downPaymentOptions: [
        suggestedDown,
        suggestedDown + 2000,
        suggestedDown + 5000,
      ],
    });
    setFourSquareOpen(true);
  };
  
  const handlePrintFourSquare = () => {
    if (!selectedDeal) return;
    
    const calculations = getFourSquareCalculations();
    const { interestRate, loanTerm } = fourSquareData;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Four Square - ${selectedDeal.dealNumber}</title>
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11px;
            color: #333;
            line-height: 1.3;
          }
          .container {
            max-width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #1976d2;
          }
          .header h1 { 
            font-size: 20px;
            margin-bottom: 5px;
            color: #1976d2;
          }
          .header h2 { 
            font-size: 14px;
            margin: 3px 0;
            color: #666;
          }
          .four-square-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 15px;
          }
          .quadrant {
            border: 2px solid #1976d2;
            padding: 12px;
            background: #f8f9fa;
            min-height: 140px;
          }
          .quadrant h3 {
            font-size: 13px;
            margin-bottom: 8px;
            color: #1976d2;
            border-bottom: 1px solid #1976d2;
            padding-bottom: 5px;
          }
          .quadrant-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 10px;
          }
          .quadrant-row .label {
            color: #666;
          }
          .quadrant-row .value {
            font-weight: bold;
          }
          .quadrant .total-row {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #ddd;
            font-size: 12px;
          }
          .down-payment-options {
            display: flex;
            gap: 8px;
            margin-top: 8px;
          }
          .down-option {
            flex: 1;
            padding: 6px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 3px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
          }
          .financing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
          }
          .financing-item {
            background: white;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
          }
          .financing-item .label {
            font-size: 9px;
            color: #666;
            margin-bottom: 2px;
          }
          .financing-item .value {
            font-size: 12px;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 10px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 6px 4px;
            text-align: left;
          }
          th {
            background-color: #1976d2;
            color: white;
            font-weight: bold;
            font-size: 10px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .highlight {
            background-color: #e3f2fd !important;
            font-weight: bold;
          }
          .monthly-payment {
            color: #1976d2;
            font-weight: bold;
          }
          .interest-cost {
            color: #d32f2f;
          }
          .footer {
            margin-top: auto;
            padding-top: 8px;
            border-top: 1px solid #ddd;
            font-size: 9px;
            color: #666;
            text-align: center;
          }
          .note {
            font-size: 9px;
            color: #666;
            margin-top: 5px;
            font-style: italic;
          }
          @media print {
            body { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .container {
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Four Square Payment Options</h1>
            <h2>${selectedDeal.dealNumber} - ${selectedDeal.customerName}</h2>
            <h2>${selectedDeal.vehicleInfo}</h2>
          </div>

          <div class="four-square-grid">
            <!-- Vehicle Price -->
            <div class="quadrant">
              <h3>Vehicle Price</h3>
              <div class="quadrant-row">
                <span class="label">Sale Price:</span>
                <span class="value">$${selectedDeal.salePrice.toLocaleString()}</span>
              </div>
              <div class="quadrant-row">
                <span class="label">Vehicle Type:</span>
                <span class="value">${selectedDeal.vehicleType}</span>
              </div>
              <div class="quadrant-row total-row">
                <span class="label">Selling Price:</span>
                <span class="value" style="color: #1976d2; font-size: 14px;">$${selectedDeal.salePrice.toLocaleString()}</span>
              </div>
            </div>

            <!-- Trade-In -->
            <div class="quadrant">
              <h3>Trade-In</h3>
              ${selectedDeal.tradeInVehicle ? `
                <div class="quadrant-row">
                  <span class="label">Vehicle:</span>
                  <span class="value">${selectedDeal.tradeInVehicle}</span>
                </div>
                <div class="quadrant-row">
                  <span class="label">Allowance:</span>
                  <span class="value">$${selectedDeal.tradeInValue.toLocaleString()}</span>
                </div>
              ` : `
                <div class="quadrant-row">
                  <span class="label" style="font-style: italic;">No trade-in</span>
                </div>
              `}
              <div class="quadrant-row total-row">
                <span class="label">Trade Value:</span>
                <span class="value" style="color: #1976d2; font-size: 14px;">$${selectedDeal.tradeInValue.toLocaleString()}</span>
              </div>
            </div>

            <!-- Cash Down -->
            <div class="quadrant">
              <h3>Cash Down</h3>
              <div class="quadrant-row">
                <span class="label">Net Sale Price:</span>
                <span class="value">$${(selectedDeal.salePrice - selectedDeal.tradeInValue).toLocaleString()}</span>
              </div>
              <div style="margin-top: 8px;">
                <div style="font-size: 9px; color: #666; margin-bottom: 5px;">Down Payment Options:</div>
                <div class="down-payment-options">
                  ${fourSquareData.downPaymentOptions.map(down => 
                    `<div class="down-option">$${down.toLocaleString()}</div>`
                  ).join('')}
                </div>
              </div>
            </div>

            <!-- Financing Terms -->
            <div class="quadrant">
              <h3>Financing Terms</h3>
              <div class="financing-grid">
                <div class="financing-item">
                  <div class="label">Interest Rate</div>
                  <div class="value">${interestRate.toFixed(2)}%</div>
                </div>
                <div class="financing-item">
                  <div class="label">Loan Term</div>
                  <div class="value">${loanTerm} months</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Down Payment</th>
                  <th>Amount Financed</th>
                  <th>Monthly Payment</th>
                  <th>Total Payments</th>
                  <th>Total Interest</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                ${calculations.map((calc, idx) => `
                  <tr>
                    <td><strong>Option ${idx + 1}</strong></td>
                    <td>$${calc.downPayment.toLocaleString()}</td>
                    <td>$${calc.amountToFinance.toLocaleString()}</td>
                    <td class="monthly-payment">$${calc.monthlyPayment.toFixed(2)}</td>
                    <td>$${calc.totalPayments.toFixed(2)}</td>
                    <td class="interest-cost">$${calc.totalInterest.toFixed(2)}</td>
                    <td><strong>$${calc.totalCost.toFixed(2)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="note">
            <strong>Terms:</strong> ${interestRate}% APR for ${loanTerm} months. 
            Monthly payments shown are estimates. Actual rates and payments may vary based on credit approval.
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleString()} | Deal: ${selectedDeal.dealNumber}
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
  
  const handleExportFourSquare = () => {
    if (!selectedDeal) return;
    
    const calculations = getFourSquareCalculations();
    const { interestRate, loanTerm } = fourSquareData;
    
    const csvContent = [
      '=== FOUR SQUARE PAYMENT OPTIONS ===',
      `Deal Number:,${selectedDeal.dealNumber}`,
      `Customer:,${selectedDeal.customerName}`,
      `Vehicle:,${selectedDeal.vehicleInfo}`,
      `Generated:,${new Date().toLocaleString()}`,
      '',
      '=== VEHICLE INFORMATION ===',
      `Sale Price:,$${selectedDeal.salePrice.toLocaleString()}`,
      `Vehicle Type:,${selectedDeal.vehicleType}`,
      `Trade-In Vehicle:,${selectedDeal.tradeInVehicle || 'None'}`,
      `Trade-In Value:,$${selectedDeal.tradeInValue.toLocaleString()}`,
      `Net Sale Price:,$${(selectedDeal.salePrice - selectedDeal.tradeInValue).toLocaleString()}`,
      '',
      '=== FINANCING TERMS ===',
      `Interest Rate:,${interestRate}%`,
      `Loan Term:,${loanTerm} months`,
      '',
      '=== PAYMENT OPTIONS COMPARISON ===',
      'Option,Down Payment,Amount Financed,Monthly Payment,Total Payments,Total Interest,Total Cost',
      ...calculations.map((calc, idx) => 
        `Option ${idx + 1},` +
        `$${calc.downPayment.toLocaleString()},` +
        `$${calc.amountToFinance.toLocaleString()},` +
        `$${calc.monthlyPayment.toFixed(2)},` +
        `$${calc.totalPayments.toFixed(2)},` +
        `$${calc.totalInterest.toFixed(2)},` +
        `$${calc.totalCost.toFixed(2)}`
      ),
      '',
      '=== NOTES ===',
      `"Terms: ${interestRate}% APR for ${loanTerm} months"`,
      '"Monthly payments shown are estimates. Actual rates and payments may vary based on credit approval."',
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FourSquare_${selectedDeal.dealNumber}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleTradeInSelect = (tradeInId: number | string) => {
    if (tradeInId === '' || tradeInId === 0) {
      // No trade-in selected
      setFormData({ 
        ...formData, 
        tradeInId: undefined, 
        tradeInVehicle: '', 
        tradeInValue: 0 
      });
    } else {
      const selectedTradeIn = availableTradeIns.find(t => t.id === Number(tradeInId));
      if (selectedTradeIn) {
        setFormData({ 
          ...formData, 
          tradeInId: selectedTradeIn.id, 
          tradeInVehicle: selectedTradeIn.vehicleInfo,
          tradeInValue: selectedTradeIn.appraisalValue 
        });
      }
    }
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newDeal: Deal = {
        ...formData as Deal,
        id: deals.length + 1,
      };
      setDeals([...deals, newDeal]);
    } else if (mode === 'edit' && selectedDeal) {
      const updatedDeals = deals.map(deal =>
        deal.id === selectedDeal.id ? { ...deal, ...formData } : deal
      );
      setDeals(updatedDeals);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(deal => deal.id !== id));
    }
  };

  const handleSubmitToFI = (deal: Deal) => {
    if (window.confirm(`Submit deal ${deal.dealNumber} to F&I for ${deal.customerName}?\n\nThis will move the deal to F&I Deal Management where finance and insurance products can be added.`)) {
      submitDealToFI(deal);
      setDeals(deals.filter(d => d.id !== deal.id));
      
      // If this was a returned deal, also remove it from returnedDeals
      if (returnedDeals.some(d => d.id === deal.id)) {
        removeReturnedDeal(deal.id);
      }
      
      alert(`Deal ${deal.dealNumber} has been submitted to F&I successfully!`);
    }
  };

  const getDealStageColor = (stage: string) => {
    switch (stage) {
      case 'Negotiation': return 'info';
      case 'Paperwork': return 'warning';
      case 'Finance Approval': return 'primary';
      case 'Ready for Delivery': return 'success';
      case 'Delivered': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaperworkStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'default';
      case 'In Progress': return 'info';
      case 'Pending Signatures': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDealStageIndex = (stage: string): number => {
    const stages = ['Negotiation', 'Paperwork', 'Finance Approval', 'Ready for Delivery', 'Delivered'];
    return stages.indexOf(stage);
  };

  // Statistics
  const stats = {
    total: filteredDeals.length,
    active: filteredDeals.filter(d => d.dealStage !== 'Delivered' && d.dealStage !== 'Cancelled').length,
    delivered: filteredDeals.filter(d => d.dealStage === 'Delivered').length,
    totalProfit: filteredDeals.reduce((sum, d) => sum + d.totalProfit, 0),
  };

  const columns: GridColDef[] = [
    { field: 'dealNumber', headerName: 'Deal #', width: 130 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'vehicleInfo', headerName: 'Vehicle', width: 180 },
    {
      field: 'vehicleType',
      headerName: 'Type',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={params.value === 'New' ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      width: 120,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'dealStage',
      headerName: 'Stage',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getDealStageColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    {
      field: 'deliveryDate',
      headerName: 'Delivery',
      width: 110,
    },
    {
      field: 'totalProfit',
      headerName: 'Profit',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Typography color="success.main" fontWeight="bold">
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row as Deal)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Deals Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add New Deal
        </Button>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search deals by deal number, customer, vehicle, stage, status, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Found {filteredDeals.length} of {deals.length} deals
          </Typography>
        )}
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Deals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Deals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {stats.active}
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Delivered
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {stats.delivered}
                  </Typography>
                </Box>
                <LocalShippingIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Profit
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {formatCurrency(stats.totalProfit)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Deals Data Grid */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredDeals}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          onRowClick={(params) => handleOpen('view', params.row as Deal)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'add' ? 'Add New Deal' : 'Edit Deal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deal Number"
                value={formData.dealNumber}
                onChange={(e) => setFormData({ ...formData, dealNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Vehicle Information"
                value={formData.vehicleInfo}
                onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Vehicle Type"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Used">Used</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sale Price"
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Trade-In Vehicle"
                value={formData.tradeInId || ''}
                onChange={(e) => handleTradeInSelect(e.target.value)}
                helperText="Select an existing trade-in or enter value manually below"
              >
                <MenuItem value="">
                  <em>No Trade-In</em>
                </MenuItem>
                {availableTradeIns.map((tradeIn) => (
                  <MenuItem key={tradeIn.id} value={tradeIn.id}>
                    {tradeIn.vehicleInfo} - {tradeIn.customerName} (${tradeIn.appraisalValue.toLocaleString()})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trade-In Value"
                type="number"
                value={formData.tradeInValue}
                onChange={(e) => setFormData({ ...formData, tradeInValue: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText={formData.tradeInVehicle ? `Trade-In: ${formData.tradeInVehicle}` : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Down Payment"
                type="number"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Finance Amount"
                type="number"
                value={formData.financeAmount}
                onChange={(e) => setFormData({ ...formData, financeAmount: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Deal Stage"
                value={formData.dealStage}
                onChange={(e) => setFormData({ ...formData, dealStage: e.target.value as any })}
              >
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Paperwork">Paperwork</MenuItem>
                <MenuItem value="Finance Approval">Finance Approval</MenuItem>
                <MenuItem value="Ready for Delivery">Ready for Delivery</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Paperwork Status"
                value={formData.paperworkStatus}
                onChange={(e) => setFormData({ ...formData, paperworkStatus: e.target.value as any })}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Pending Signatures">Pending Signatures</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Delivery Date"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actual Delivery Date"
                type="date"
                value={formData.actualDeliveryDate}
                onChange={(e) => setFormData({ ...formData, actualDeliveryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sales Person"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="F&I Manager"
                value={formData.fiManager}
                onChange={(e) => setFormData({ ...formData, fiManager: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Front-End Profit"
                type="number"
                value={formData.frontEndProfit}
                onChange={(e) => setFormData({ ...formData, frontEndProfit: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Back-End Profit"
                type="number"
                value={formData.backEndProfit}
                onChange={(e) => setFormData({ ...formData, backEndProfit: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Profit"
                type="number"
                value={formData.totalProfit}
                onChange={(e) => setFormData({ ...formData, totalProfit: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'add' ? 'Add Deal' : 'Update Deal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Deal Details</DialogTitle>
        <DialogContent>
          {selectedDeal && (
            <Box sx={{ mt: 1 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Deal Information" />
                <Tab label="Deal Progress" />
                <Tab label="Documents" />
              </Tabs>

              {/* Deal Information Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {selectedDeal.dealNumber} - {selectedDeal.customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">
                      {selectedDeal.vehicleInfo} ({selectedDeal.vehicleType})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Sale Price</Typography>
                    <Typography variant="h6">{formatCurrency(selectedDeal.salePrice)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Trade-In Value</Typography>
                    <Typography variant="h6">{formatCurrency(selectedDeal.tradeInValue)}</Typography>
                  </Grid>
                  {selectedDeal.tradeInVehicle && (
                    <Grid item xs={12}>
                      <Alert severity="info" icon={<DirectionsCarIcon />}>
                        <strong>Trade-In Vehicle:</strong> {selectedDeal.tradeInVehicle}
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Down Payment</Typography>
                    <Typography>{formatCurrency(selectedDeal.downPayment)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Finance Amount</Typography>
                    <Typography>{formatCurrency(selectedDeal.financeAmount)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body2">Front-End Profit</Typography>
                    <Typography color="success.main">{formatCurrency(selectedDeal.frontEndProfit)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body2">Back-End Profit</Typography>
                    <Typography color="success.main">{formatCurrency(selectedDeal.backEndProfit)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body2">Total Profit</Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(selectedDeal.totalProfit)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Sales Person</Typography>
                    <Typography>{selectedDeal.salesPerson}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">F&I Manager</Typography>
                    <Typography>{selectedDeal.fiManager || 'Not assigned'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Expected Delivery</Typography>
                    <Typography>{selectedDeal.deliveryDate || 'Not scheduled'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Actual Delivery</Typography>
                    <Typography>{selectedDeal.actualDeliveryDate || 'Not delivered yet'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">Notes</Typography>
                    <Typography>{selectedDeal.notes || 'No notes'}</Typography>
                  </Grid>
                </Grid>
              )}

              {/* Deal Progress Tab */}
              {tabValue === 1 && (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Deal Stage Progress</Typography>
                    <Stepper activeStep={getDealStageIndex(selectedDeal.dealStage)} alternativeLabel>
                      <Step>
                        <StepLabel>Negotiation</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Paperwork</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Finance Approval</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Ready for Delivery</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Delivered</StepLabel>
                      </Step>
                    </Stepper>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Current Status</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography color="textSecondary" variant="body2">Deal Stage</Typography>
                        <Chip
                          label={selectedDeal.dealStage}
                          color={getDealStageColor(selectedDeal.dealStage) as any}
                          sx={{ mt: 0.5 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography color="textSecondary" variant="body2">Paperwork Status</Typography>
                        <Chip
                          label={selectedDeal.paperworkStatus}
                          color={getPaperworkStatusColor(selectedDeal.paperworkStatus) as any}
                          sx={{ mt: 0.5 }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {selectedDeal.dealStage === 'Delivered' && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                      <strong>Deal Completed!</strong> Vehicle delivered on {selectedDeal.actualDeliveryDate}
                    </Alert>
                  )}
                  {selectedDeal.dealStage === 'Cancelled' && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                      <strong>Deal Cancelled</strong>
                    </Alert>
                  )}
                </Box>
              )}

              {/* Documents Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1 }} />
                    Required Documents
                  </Typography>
                  <List>
                    {selectedDeal.documents.map((doc) => (
                      <React.Fragment key={doc.id}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography>{doc.name}</Typography>
                                <Chip
                                  label={doc.status}
                                  color={doc.status === 'Completed' ? 'success' : 'default'}
                                  size="small"
                                  icon={doc.status === 'Completed' ? <CheckCircleIcon /> : <PendingIcon />}
                                />
                              </Box>
                            }
                            secondary={doc.completedDate ? `Completed on ${doc.completedDate}` : 'Pending'}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {selectedDeal.documents.filter(d => d.status === 'Completed').length} of{' '}
                      {selectedDeal.documents.length} documents completed
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedDeal) handleOpen('edit', selectedDeal);
            }}
            variant="contained"
          >
            Edit Deal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Four Square Dialog */}
      <Dialog open={fourSquareOpen} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GridOnIcon sx={{ mr: 1 }} />
              Four Square Payment Options
            </Box>
            <Box>
              <Tooltip title="Export to CSV">
                <IconButton onClick={handleExportFourSquare} color="primary">
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrintFourSquare} color="primary">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box ref={fourSquareRef}>
            {selectedDeal && (
              <>
                <Box className="header" sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom>Four Square</Typography>
                  <Typography variant="h6" color="primary">{selectedDeal.dealNumber} - {selectedDeal.customerName}</Typography>
                  <Typography variant="subtitle1">{selectedDeal.vehicleInfo}</Typography>
                </Box>

                {/* Four Square Grid */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {/* Top Left - Vehicle Price */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        border: '3px solid #1976d2',
                        bgcolor: '#e3f2fd'
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                        Vehicle Price
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography>Sale Price:</Typography>
                          <Typography fontWeight="bold">{formatCurrency(selectedDeal.salePrice)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography>Vehicle Type:</Typography>
                          <Chip label={selectedDeal.vehicleType} size="small" color="primary" />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">Selling Price:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatCurrency(selectedDeal.salePrice)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Top Right - Trade-In */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        border: '3px solid #1976d2',
                        bgcolor: '#e3f2fd'
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                        Trade-In
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {selectedDeal.tradeInVehicle ? (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                              <Typography>Vehicle:</Typography>
                              <Typography fontWeight="bold">{selectedDeal.tradeInVehicle}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                              <Typography>Allowance:</Typography>
                              <Typography fontWeight="bold">{formatCurrency(selectedDeal.tradeInValue)}</Typography>
                            </Box>
                          </>
                        ) : (
                          <Typography color="text.secondary" sx={{ mb: 1.5 }}>No trade-in</Typography>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">Trade Value:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatCurrency(selectedDeal.tradeInValue)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Bottom Left - Down Payment */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        border: '3px solid #1976d2',
                        bgcolor: '#e3f2fd'
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                        Cash Down
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography>Net Sale Price:</Typography>
                          <Typography fontWeight="bold">
                            {formatCurrency(selectedDeal.salePrice - selectedDeal.tradeInValue)}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Adjust down payment options:
                          </Typography>
                          <Grid container spacing={1}>
                            {fourSquareData.downPaymentOptions.map((down, idx) => (
                              <Grid item xs={4} key={idx}>
                                <TextField
                                  size="small"
                                  fullWidth
                                  type="number"
                                  value={down}
                                  onChange={(e) => {
                                    const newOptions = [...fourSquareData.downPaymentOptions];
                                    newOptions[idx] = parseFloat(e.target.value) || 0;
                                    setFourSquareData({ ...fourSquareData, downPaymentOptions: newOptions });
                                  }}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Bottom Right - Payment */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        border: '3px solid #1976d2',
                        bgcolor: '#e3f2fd'
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                        Financing Terms
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Interest Rate (%)"
                              type="number"
                              value={fourSquareData.interestRate}
                              onChange={(e) => setFourSquareData({ 
                                ...fourSquareData, 
                                interestRate: parseFloat(e.target.value) || 0 
                              })}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              size="small"
                              select
                              label="Loan Term"
                              value={fourSquareData.loanTerm}
                              onChange={(e) => setFourSquareData({ 
                                ...fourSquareData, 
                                loanTerm: parseInt(e.target.value) 
                              })}
                            >
                              <MenuItem value={36}>36 months</MenuItem>
                              <MenuItem value={48}>48 months</MenuItem>
                              <MenuItem value={60}>60 months</MenuItem>
                              <MenuItem value={72}>72 months</MenuItem>
                              <MenuItem value={84}>84 months</MenuItem>
                            </TextField>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Payment Options Table */}
                <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Payment Options Comparison
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Option</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Down Payment</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Amount Financed</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Monthly Payment</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Total Payments</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Total Interest</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: 'white' }}>Total Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFourSquareCalculations().map((calc, idx) => (
                        <TableRow 
                          key={idx}
                          sx={{ 
                            '&:nth-of-type(even)': { bgcolor: '#f5f5f5' },
                            '&:hover': { bgcolor: '#e3f2fd' }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 'bold' }}>Option {idx + 1}</TableCell>
                          <TableCell>{formatCurrency(calc.downPayment)}</TableCell>
                          <TableCell>{formatCurrency(calc.amountToFinance)}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            {formatCurrency(calc.monthlyPayment)}
                          </TableCell>
                          <TableCell>{formatCurrency(calc.totalPayments)}</TableCell>
                          <TableCell sx={{ color: '#d32f2f' }}>{formatCurrency(calc.totalInterest)}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(calc.totalCost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>

                {/* Summary */}
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Terms:</strong> {fourSquareData.interestRate}% APR for {fourSquareData.loanTerm} months
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> Monthly payments shown are estimates. Actual rates and payments may vary based on credit approval.
                  </Typography>
                </Box>

                <Box className="footer" sx={{ mt: 3, pt: 2, borderTop: '2px solid #ddd', textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Generated on {new Date().toLocaleString()} | Deal: {selectedDeal.dealNumber}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleExportFourSquare} startIcon={<FileDownloadIcon />} color="primary">
            Export CSV
          </Button>
          <Button onClick={handlePrintFourSquare} startIcon={<PrintIcon />} variant="contained">
            Print
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="info" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('foursquare')}>
          <ListItemIcon>
            <GridOnIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          Four Square
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('submit')}>
          <ListItemIcon>
            <SendIcon fontSize="small" color="success" />
          </ListItemIcon>
          Submit to F&I
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Edit Deal
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Deal
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Deals;
