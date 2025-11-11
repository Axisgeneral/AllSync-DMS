import React, { useRef, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { exportToCSV, exportToPDF, importFromFile } from '../utils/exportImport';

interface ImportExportMenuProps {
  data: any[];
  filename: string;
  onImport: (importedData: any[]) => void;
  headers?: string[];
  title?: string;
}

const ImportExportMenu: React.FC<ImportExportMenuProps> = ({
  data,
  filename,
  onImport,
  headers,
  title,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    exportToCSV(data, filename, headers);
    setAnchorEl(null);
  };

  const handleExportPDF = () => {
    exportToPDF(data, filename, headers, title || filename);
    setAnchorEl(null);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importFromFile(
      file,
      (importedData) => {
        onImport(importedData);
        alert(`Successfully imported ${importedData.length} records`);
      },
      (error) => {
        alert(error);
      }
    );

    setAnchorEl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="primary"
        title="Import/Export"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export to CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export to PDF</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => fileInputRef.current?.click()}>
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import from File</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ImportExportMenu;
