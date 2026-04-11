import React, { useState, useRef } from 'react';
import * as Lucide from 'lucide-react';
const { X, Upload, FileText, ChevronRight, Check, AlertCircle, Layout, Database, Copy } = Lucide as any;
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  boardColumns: any[];
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ isOpen, onClose, onImport, boardColumns }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [itemNameColumn, setItemNameColumn] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [duplicateHandling, setDuplicateHandling] = useState<'create' | 'skip' | 'overwrite'>('create');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        if (data.length > 0) {
          const sheetHeaders = data[0].map(h => String(h));
          setHeaders(sheetHeaders);
          setPreviewRows(XLSX.utils.sheet_to_json(ws).slice(0, 3));
          setStep(2);
        }
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const handleNext = () => {
    if (step === 2 && itemNameColumn) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleStartImport = () => {
    // Transform data based on mapping
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(ws) as any[];

      const finalItems = rawData.map(row => {
        const dynamicData: Record<string, any> = {};
        Object.entries(columnMapping).forEach(([excelCol, boardColId]) => {
          if (boardColId && boardColId !== 'skip') {
            dynamicData[boardColId] = row[excelCol];
          }
        });
        
        return {
          name: row[itemNameColumn],
          dynamicData
        };
      });

      onImport(finalItems);
      onClose();
    };
    if (file) reader.readAsBinaryString(file);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div 
        className="import-modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="import-modal-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Import data from Excel › to ecosystra</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
          </div>
          <p>Move data from an Excel spreadsheet into an existing ecosystra board</p>
        </div>

        <div className="import-modal-content">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} color="var(--primary)" />
                <p><span>Browse your files</span> or drag and drop here;</p>
                <p style={{ fontSize: 13 }}>Make sure its a CSV, XLS, or XLSX file.</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".csv, .xls, .xlsx"
                  onChange={handleFileUpload}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Map your data to an existing board</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Choose which column from the Excel file will appear as the item name (the first column in your board)</p>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Item name</label>
                  <select 
                    className="mapping-select" 
                    style={{ width: '100%' }}
                    value={itemNameColumn}
                    onChange={(e) => setItemNameColumn(e.target.value)}
                  >
                    <option value="">Choose column</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: 24, fontWeight: 500, marginBottom: 16 }}>Map the columns from Excel to the columns in this board</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <input type="checkbox" id="excludeFirst" defaultChecked />
                  <label htmlFor="excludeFirst" style={{ fontSize: 14 }}>Exclude first row of spreadsheet from import</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, padding: '0 16px' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Excel columns</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Existing board columns</span>
                </div>

                {headers.filter(h => h !== itemNameColumn).map(header => (
                  <div key={header} className="mapping-row">
                    <div>
                      <span className="mapping-source">{header}</span>
                      <span className="mapping-example">{previewRows[0]?.[header] || 'Example data'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ChevronRight size={16} color="var(--text-disabled)" />
                      <select 
                        className="mapping-select"
                        value={columnMapping[header] || ''}
                        onChange={(e) => setColumnMapping({...columnMapping, [header]: e.target.value})}
                      >
                        <option value="">Choose column</option>
                        <option value="skip">Skip column</option>
                        {boardColumns.map(col => (
                          <option key={col.id} value={col.id}>{col.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'var(--text-warning)', fontSize: 13 }}>
                  <AlertCircle size={14} />
                  <span>Unmapped columns will not be imported</span>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Choose how to handle duplicates</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>What should we do with any duplicated items? <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Learn more about duplicates</a></p>

                <div className="duplicate-options">
                  <div 
                    className={`duplicate-card ${duplicateHandling === 'create' ? 'active' : ''}`}
                    onClick={() => setDuplicateHandling('create')}
                  >
                    {duplicateHandling === 'create' && <div className="duplicate-check"><Check size={12} /></div>}
                    <div className="duplicate-card-icon"><Layout size={32} color="#0073e6" /></div>
                    <h3>Create new items</h3>
                    <p>Add all duplicates as new items to the board</p>
                  </div>

                  <div 
                    className={`duplicate-card ${duplicateHandling === 'skip' ? 'active' : ''}`}
                    onClick={() => setDuplicateHandling('skip')}
                  >
                    {duplicateHandling === 'skip' && <div className="duplicate-check"><Check size={12} /></div>}
                    <div className="duplicate-card-icon"><Database size={32} color="#f2ac00" /></div>
                    <h3>Skip items</h3>
                    <p>Don't add an item if the data from Excel matches this column</p>
                    <select className="mapping-select" style={{ fontSize: 12, padding: '4px 8px', minWidth: 'auto' }}>
                      <option>Choose column</option>
                    </select>
                  </div>

                  <div 
                    className={`duplicate-card ${duplicateHandling === 'overwrite' ? 'active' : ''}`}
                    onClick={() => setDuplicateHandling('overwrite')}
                  >
                    {duplicateHandling === 'overwrite' && <div className="duplicate-check"><Check size={12} /></div>}
                    <div className="duplicate-card-icon"><Copy size={32} color="#6c6cff" /></div>
                    <h3>Overwrite existing items</h3>
                    <p>Overwrite the whole item if the data matches this column</p>
                    <select className="mapping-select" style={{ fontSize: 12, padding: '4px 8px', minWidth: 'auto' }}>
                      <option>Choose column</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="import-modal-footer">
          {step > 1 && (
            <button 
              onClick={handleBack}
              style={{ padding: '8px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 15 }}
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button 
              onClick={handleNext}
              disabled={step === 2 && !itemNameColumn}
              className="btn-toolbar"
              style={{ 
                background: step === 2 && !itemNameColumn ? 'var(--bg-hover)' : 'var(--primary)', 
                color: step === 2 && !itemNameColumn ? 'var(--text-disabled)' : 'white',
                border: 'none',
                padding: '10px 24px'
              }}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleStartImport}
              className="btn-toolbar"
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 24px' }}
            >
              Start import
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
