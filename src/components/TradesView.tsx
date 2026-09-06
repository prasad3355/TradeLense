import React, { useState, useRef } from 'react';
import { Trade } from '../types';
import { 
  Upload, 
  FileImage, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  RefreshCw, 
  Image as ImageIcon,
  AlertTriangle,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface TradesViewProps {
  onAddTrade: (trade: Trade) => void;
  onNavigateToDashboard: () => void;
}

export default function TradesView({ onAddTrade, onNavigateToDashboard }: TradesViewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [usePreset, setUsePreset] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  // Correction Override States
  const [assetName, setAssetName] = useState('');
  const [positionType, setPositionType] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [tpLevel, setTpLevel] = useState<number>(0);
  const [slLevel, setSlLevel] = useState<number>(0);
  const [timeframeVal, setTimeframeVal] = useState('1H');
  const [sessionVal, setSessionVal] = useState('London');
  const [pipsVal, setPipsVal] = useState<number>(0);
  const [positionSize, setPositionSize] = useState<number>(1.0);
  const [customPnl, setCustomPnl] = useState<number>(0);
  const [selectedEmotion, setSelectedEmotion] = useState('none');
  const [manualNotes, setManualNotes] = useState('');
  const [setupTypeVal, setSetupTypeVal] = useState('breakout');
  const [mistakeTypeVal, setMistakeTypeVal] = useState('none');
  
  const [scanFailed, setScanFailed] = useState(false);
  const [diagnostics, setDiagnostics] = useState<{
    geminiConnected: boolean;
    visionRequestSent: boolean;
    visionResponseReceived: boolean;
  }>({
    geminiConnected: true,
    visionRequestSent: false,
    visionResponseReceived: false
  });

  const clearFormInputsForFailure = () => {
    setAssetName('');
    setPositionType('LONG');
    setEntryPrice(0);
    setExitPrice(0);
    setTpLevel(0);
    setSlLevel(0);
    setTimeframeVal('');
    setSessionVal('London');
    setPipsVal(0);
    setPositionSize(1);
    setCustomPnl(0);
    setSelectedEmotion('none');
    setManualNotes('');
    setSetupTypeVal('breakout');
    setMistakeTypeVal('none');
    setUserConfirmedLowConfidence(false);
  };
  
  const [userConfirmedLowConfidence, setUserConfirmedLowConfidence] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Validation checks
  const getValidationWarnings = () => {
    const warnings: string[] = [];
    if (positionType === 'LONG') {
      if (slLevel && slLevel >= entryPrice) {
        warnings.push("Stop Loss cannot be above or equal to Entry Price on a LONG position.");
      }
      if (tpLevel && tpLevel <= entryPrice) {
        warnings.push("Take Profit cannot be below or equal to Entry Price on a LONG position.");
      }
    } else if (positionType === 'SHORT') {
      if (slLevel && slLevel <= entryPrice) {
        warnings.push("Stop Loss cannot be below or equal to Entry Price on a SHORT position.");
      }
      if (tpLevel && tpLevel >= entryPrice) {
        warnings.push("Take Profit cannot be above or equal to Entry Price on a SHORT position.");
      }
    }
    
    // calculate actual RR based on entry, tp, sl
    const risk = Math.abs(entryPrice - slLevel);
    const reward = Math.abs(tpLevel - entryPrice);
    if (risk > 0 && reward > 0) {
      const calculatedRR = reward / risk;
      if (calculatedRR < 1) {
        warnings.push(`Risk-Reward ratio (1:${calculatedRR.toFixed(2)}) is mathematically inefficient (sub 1:1).`);
      }
    }
    return warnings;
  };

  // Convert File to Compressed Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const qPref = localStorage.getItem('tradelense_img_quality') || 'balanced';
      
      let maxDim = 1200;
      let quality = 0.75;
      
      if (qPref === 'high') {
        maxDim = 2400; // Large size
        quality = 0.95; // Crisp
      } else if (qPref === 'extreme') {
        maxDim = 800;  // Tiny size
        quality = 0.40; // Extremely compressed
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Export image as lossy compressed JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl.split(',')[1]);
          } else {
            // Context fallback
            const base64 = event.target?.result as string;
            resolve(base64.split(',')[1]);
          }
        };
        img.onerror = () => {
          const base64 = event.target?.result as string;
          resolve(base64.split(',')[1]);
        };
      };
      reader.onerror = () => resolve('');
    });
  };

  const handleSetExtracted = (data: any) => {
    setExtractedData(data);
    if (data) {
      setAssetName(data.asset || 'EUR / USD');
      setPositionType(data.type === 'SHORT' ? 'SHORT' : 'LONG');
      setEntryPrice(data.entryPrice || 0);
      setExitPrice(data.exitPrice || 0);
      setTpLevel(data.tp || data.exitPrice || 0);
      setSlLevel(data.sl || 0);
      setTimeframeVal(data.timeframe || '1H');
      setSessionVal(data.session || 'London');
      setPipsVal(data.pips || 0);
      setPositionSize(data.size || 1.0);
      
      // Calculate a highly realistic dynamic initial PNL based on points/pips and pair specifications
      let basePnl = 0;
      if (data.pnl) {
        basePnl = data.pnl;
      } else if (data.pips) {
        basePnl = data.pips * 10; 
      } else {
        const diff = (data.exitPrice - data.entryPrice) * (data.type === 'LONG' ? 1 : -1);
        let multiplier = 1000;
        if (data.asset && (data.asset.includes('BTC') || data.asset.includes('68'))) multiplier = 0.5;
        if (data.asset && data.asset.includes('ETH')) multiplier = 2;
        if (data.asset && (data.asset.includes('NQ') || data.asset.includes('NASDAQ') || data.asset.includes('Gold') || data.asset.includes('XAU'))) multiplier = 50;
        if (data.asset && (data.asset.includes('EUR') || data.asset.includes('/'))) multiplier = 10000;
        basePnl = Math.round(diff * multiplier * 100) / 100;
      }

      setCustomPnl(basePnl);
      setSelectedEmotion(data.emotion_detected || 'none');
      setManualNotes(data.notes || '');
      setSetupTypeVal(data.setup_type || 'breakout');
      setMistakeTypeVal(data.mistake_type || 'none');
      setUserConfirmedLowConfidence(false);
    }
  };

  const startScanAnimation = async (imageB64?: string, mimeType?: string, preset?: string) => {
    setScanning(true);
    setProgress(0);
    setExtractedData(null);
    setApiError(null);
    setScanFailed(false);
    setDiagnostics({
      geminiConnected: true,
      visionRequestSent: !!imageB64,
      visionResponseReceived: false
    });

    // Slowly increment progress bar for suspenseful feedback
    const interval = setInterval(() => {
      setProgress(val => {
        if (val >= 90) {
          clearInterval(interval);
          return 90;
        }
        return val + 15;
      });
    }, 120);

    try {
      // Direct full-stack POST request to our customized server-side OCR engine
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageB64 || null,
          mimeType: mimeType || null,
          presetName: preset || null
        })
      });

      if (!res.ok) {
        throw new Error('Neural OCR server error. Please try again or select another preset.');
      }

      const parsed = await res.json();
      
      // Complete the progress bar cleanly
      setProgress(100);

      if (parsed.isFailed || parsed.success === false) {
        setScanFailed(true);
        setDiagnostics({
          geminiConnected: parsed.geminiConnected ?? false,
          visionRequestSent: parsed.visionRequestSent ?? true,
          visionResponseReceived: parsed.visionResponseReceived ?? false
        });
        setApiError(parsed.error || "Neural OCR failed. Gemini API experienced high demand or config issue.");
        clearFormInputsForFailure();
      } else {
        setScanFailed(false);
        setDiagnostics({
          geminiConnected: parsed.geminiConnected ?? (!parsed.isMock),
          visionRequestSent: parsed.visionRequestSent ?? true,
          visionResponseReceived: parsed.visionResponseReceived ?? true
        });
        handleSetExtracted(parsed);
      }

    } catch (err: any) {
      console.error(err);
      setScanFailed(true);
      setApiError(err.message || 'Error occurred querying the scanner.');
      setDiagnostics({
        geminiConnected: false,
        visionRequestSent: !!imageB64,
        visionResponseReceived: false
      });
      clearFormInputsForFailure();
    } finally {
      clearInterval(interval);
      setScanning(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUsePreset(null);
    setExtractedData(null);
    setSaveSuccess(false);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Automatical neural scanning sequence triggered on upload
    const base64 = await fileToBase64(file);
    startScanAnimation(base64, file.type, undefined);
  };

  const selectPreset = (presetName: 'gold' | 'nasdaq' | 'eurusd') => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUsePreset(presetName);
    setExtractedData(null);
    setSaveSuccess(false);

    // Start scanning simulation for preset charts
    startScanAnimation(undefined, undefined, presetName);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUsePreset(null);
    setExtractedData(null);
    setSaveSuccess(false);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const base64 = await fileToBase64(file);
    startScanAnimation(base64, file.type, undefined);
  };

  const handleLogToTerminal = () => {
    if (!extractedData) return;

    const warnings = getValidationWarnings();
    const isLowConfidence = extractedData.confidence ? extractedData.confidence < 85 : false;

    // Trigger low precision alerts or strict mathematical safety errors
    if ((isLowConfidence || warnings.length > 0) && !userConfirmedLowConfidence) {
      setUserConfirmedLowConfidence(true);
      setApiError("⚠️ Structural validation warnings detected. Verify highlight inputs below, then click Commit Log once more to override.");
      return;
    }

    const calculatedRR = Math.abs(tpLevel - entryPrice) / (Math.abs(entryPrice - slLevel) || 1);

    // Append user-verified details and generate a fresh enriched Trade element back upstream
    const newTrade: Trade = {
      id: `tx-ocr-${Date.now()}`,
      asset: assetName,
      type: positionType,
      entryPrice: parseFloat(entryPrice as any) || 0,
      exitPrice: parseFloat(exitPrice as any) || 0,
      pnl: parseFloat(customPnl as any) || 0,
      time: new Date().toISOString(),
      duration: extractedData.duration || '2h',
      notes: manualNotes,

      // Expanded visual extraction metadata
      sl: parseFloat(slLevel as any) || undefined,
      tp: parseFloat(tpLevel as any) || undefined,
      rr: parseFloat((extractedData.rr || calculatedRR || 2.0).toFixed(2) as any),
      pips: parseInt(pipsVal as any) || undefined,
      riskPercent: extractedData.riskPercent || 1.5,
      rewardPercent: extractedData.rewardPercent || 3.5,
      timeframe: timeframeVal,
      chartTime: extractedData.chartTime || new Date().toISOString(),
      candleCount: extractedData.candleCount || 10,
      detectedTool: extractedData.detectedTool || 'NONE',
      estimatedOutcome: extractedData.estimatedOutcome || 'MANUAL_CLOSED',
      session: sessionVal as any,
      day: (extractedData.day || 'Wednesday') as any,

      // Structured AI Intelligence
      setup_type: setupTypeVal as any,
      market_structure: extractedData.market_structure || 'Identified technical consolidation zone split',
      emotion_detected: selectedEmotion as any,
      mistake_type: mistakeTypeVal as any,
      discipline_score: extractedData.discipline_score || (warnings.length > 0 ? 70 : 92),
      execution_quality: extractedData.execution_quality || 85,
      risk_management_quality: extractedData.risk_management_quality || (warnings.length > 0 ? 65 : 95),
      setup_quality: extractedData.setup_quality || 88,
      confidence_score: extractedData.confidence || 90,

      // Position Overrides
      size: parseFloat(positionSize as any) || 1.0,
      user_emotion: selectedEmotion,
      user_notes: manualNotes,
      image_url: extractedData.image_url || extractedData.imageUrl || undefined,
      validationWarnings: warnings
    };

    onAddTrade(newTrade);
    setSaveSuccess(true);
    setApiError(null);
    
    // Clear state files and route back
    setTimeout(() => {
      onNavigateToDashboard();
    }, 1500);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUsePreset(null);
    setExtractedData(null);
    setSaveSuccess(false);
    setProgress(0);
    setApiError(null);
    setUserConfirmedLowConfidence(false);
  };

  return (
    <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Trade Analysis Terminal</h2>
        <p className="text-xs text-[#849495] font-light">
          Cognitive OCR & Pattern Recognition engine powered by Google Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Upload Drag/Drop zone */}
        <div className="md:col-span-7 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`min-h-[350px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
              previewUrl || usePreset 
                ? 'border-brand-cyan/20 bg-black/40' 
                : 'border-white/10 hover:border-brand-cyan/40 bg-white/[0.01]'
            }`}
          >
            {/* The laser scanning bar animation (Visible when scanning is running) */}
            {scanning && (
              <div className="absolute top-0 inset-x-0 z-20 laser-line pointer-events-none" />
            )}

            {/* Core Display depending on stage */}
            {(!previewUrl && !usePreset) ? (
              <div 
                className="text-center space-y-4 cursor-pointer p-6 w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,219,231,0.15)] group-hover:scale-105 transition-transform">
                  <Upload className="text-brand-cyan w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-white mb-1">
                    Drop execution chart blueprint here
                  </h4>
                  <p className="text-xs text-[#849495] font-light max-w-xs mx-auto">
                    Supports PNG, JPG snapshots from trading consoles. Click to browse. No image? Try one of the high-fidelity presets below.
                  </p>
                </div>
              </div>
            ) : (
              // Active Preview state
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
                {previewUrl ? (
                  <div className="relative max-w-xs max-h-56 rounded border border-white/10 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-contain" />
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[9px] font-mono text-brand-cyan font-bold">
                      USER SNAPSHOT
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-8 bg-[#131118] border border-brand-cyan/20 rounded-lg text-center shadow-[0_0_30px_rgba(0,219,231,0.05)]">
                    <ImageIcon className="w-10 h-10 text-brand-cyan animate-pulse" />
                    <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Preset Activated: <span className="text-brand-cyan">{usePreset?.toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] text-[#849495]">Analyzing candlestick boundaries and technical triggers...</span>
                  </div>
                )}

                {/* Rescan trigger button */}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RESET SCANNER</span>
                </button>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Quick Sandbox preset items list */}
          <div className="glass-fill p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              No Snapshot handy? Simulate Preset chart matrices:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                onClick={() => selectPreset('gold')}
                className="p-3 bg-black/40 border border-white/5 rounded-lg text-left hover:border-brand-cyan/40 group transition-all cursor-pointer"
              >
                <div className="font-sans font-semibold text-xs text-white mb-0.5 group-hover:text-brand-cyan">XAU/USD Breakout</div>
                <div className="text-[10px] text-[#849495] font-light">Gold Bullish Channel Breach</div>
              </button>
              
              <button 
                onClick={() => selectPreset('nasdaq')}
                className="p-3 bg-black/40 border border-white/5 rounded-lg text-left hover:border-brand-purple/40 group transition-all cursor-pointer"
              >
                <div className="font-sans font-semibold text-xs text-white mb-0.5 group-hover:text-brand-purple">NQ100 Head & Shoulders</div>
                <div className="text-[10px] text-[#849495] font-light">Nasdaq Index trend reversal pivot</div>
              </button>
              
              <button 
                onClick={() => selectPreset('eurusd')}
                className="p-3 bg-black/40 border border-white/5 rounded-lg text-left hover:border-brand-emerald/40 group transition-all cursor-pointer"
              >
                <div className="font-sans font-semibold text-xs text-white mb-0.5 group-hover:text-brand-emerald">EUR/USD Deviation</div>
                <div className="text-[10px] text-[#849495] font-light">Forex consolidation liquidity sweep</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Scan Status Progress and extracted parameters details */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-fill p-6 rounded-xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-cyan animate-pulse" />
                <span>AI Core Extraction Diagnostic</span>
              </h3>
              {extractedData && (
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest ${
                  extractedData.isMock ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30' : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                }`}>
                  {extractedData.isMock ? 'DEFERRED DEMO' : 'LIVE COGNITIVE'}
                </span>
              )}
            </div>

            {/* Error Message if any */}
            {apiError && !scanFailed && (
              <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded text-xs text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-light leading-relaxed">{apiError}</span>
              </div>
            )}

            {/* Scanning / In-progress loader component */}
            {scanning && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between text-xs font-mono text-[#849495]">
                  <span className="animate-pulse">DECODING IMAGE BLUEPRINT MATRIX...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-cyan shadow-[0_0_10px_#00dbe7] transition-all duration-300 animate-pulse" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <p className="text-[10px] text-[#849495] font-light italic">
                  Running Multi-stage Pipeline (OCR Neural, Long/Short tool modeling, behavioral trait extraction)...
                </p>
              </div>
            )}

            {/* Extracted Details list view with Correction Overrides Form */}
            {scanFailed ? (
              <div className="space-y-6">
                {/* 1 & 2. AI Extraction Unavailable Fallback Panel */}
                <div className="flex flex-col gap-3 bg-red-500/10 border border-red-500/35 rounded-lg p-4 text-xs text-red-100">
                  <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <span>AI EXTRACTION UNAVAILABLE</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed font-light">
                    The cognitive engine was unable to perform OCR and structure extraction from the uploaded layout.
                  </p>
                  
                  {/* Reasons list */}
                  <div className="space-y-1.5 mt-1">
                    <div className="font-mono text-[9px] uppercase font-bold text-[#849495] tracking-wider">POSSIBLE REASONS:</div>
                    <ul className="list-disc list-inside text-[10.5px] text-red-300 font-light space-y-1">
                      <li>Gemini API unavailable</li>
                      <li>Vision request failed</li>
                      <li>OCR parsing failed</li>
                      <li>Rate limited</li>
                    </ul>
                  </div>

                  {/* 3. Confidence level N/A */}
                  <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded p-2.5 mt-2">
                    <span className="font-mono text-[10px] text-[#849495] uppercase font-bold tracking-wider">
                      OCR Reliability Confidence:
                    </span>
                    <span className="font-mono text-xs font-bold text-red-400">
                      N/A
                    </span>
                  </div>
                </div>

                {/* 8. Diagnostic Output */}
                <div className="bg-black/30 border border-white/5 rounded-lg p-4 space-y-2.5">
                  <div className="text-[10px] font-mono text-white/50 font-bold uppercase tracking-wider">
                    Engine Diagnostics
                  </div>
                  <div className="grid grid-cols-1 gap-2 font-mono text-[11px]">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-[#849495]">Gemini Connected:</span>
                      <span className={`font-bold ${diagnostics.geminiConnected ? 'text-brand-emerald' : 'text-red-400'}`}>
                        {diagnostics.geminiConnected ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-[#849495]">Vision Request Sent:</span>
                      <span className={`font-bold ${diagnostics.visionRequestSent ? 'text-brand-emerald' : 'text-red-400'}`}>
                        {diagnostics.visionRequestSent ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#849495]">Vision Response Received:</span>
                      <span className={`font-bold ${diagnostics.visionResponseReceived ? 'text-brand-emerald' : 'text-red-400'}`}>
                        {diagnostics.visionResponseReceived ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                    {apiError && (
                      <div className="flex flex-col gap-1 py-1.5 border-t border-white/5 mt-1 pt-1.5">
                        <span className="text-[#849495] text-[10px] uppercase font-bold tracking-wider">Raw Error Log:</span>
                        <pre className="text-[9.5px] text-red-300 font-mono bg-red-950/20 border border-red-900/30 rounded p-2 overflow-x-auto max-h-[80px] break-all white-space-pre-wrap leading-tight">
                          {apiError}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Allowed Actions only */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (selectedFile) {
                        const file = selectedFile;
                        fileToBase64(file).then(base64 => {
                          startScanAnimation(base64, file.type, undefined);
                        });
                      } else if (usePreset) {
                        startScanAnimation(undefined, undefined, usePreset);
                      } else {
                        startScanAnimation();
                      }
                    }}
                    className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Scan</span>
                  </button>

                  <button
                    onClick={() => {
                      handleReset();
                      fileInputRef.current?.click();
                    }}
                    className="py-3 bg-brand-cyan/25 hover:bg-brand-cyan/35 border border-brand-cyan/40 rounded-lg text-xs font-semibold text-brand-cyan tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                </div>

                {/* 6. Switch to Manual Entry (showing empty fields only) Link */}
                <div className="text-center mt-2 pb-2">
                  <button
                    onClick={() => {
                      setScanFailed(false);
                      setApiError(null);
                      setExtractedData({
                        confidence: 'N/A',
                        isManual: true
                      });
                      clearFormInputsForFailure();
                    }}
                    className="text-[11px] text-[#849495] hover:text-white transition-colors underline font-mono cursor-pointer"
                  >
                    Skip to manual entry (show empty fields only)
                  </button>
                </div>

                {/* 4. Disabled Trade Save/Commit Button */}
                <button
                  disabled
                  className="w-full py-4 bg-white/5 border border-white/5 text-[#849495]/40 text-xs font-semibold rounded-lg tracking-widest uppercase cursor-not-allowed"
                >
                  Save Trade (Extraction Fail)
                </button>
              </div>
            ) : extractedData ? (
              <div className="space-y-6">
                
                {/* Visual Confidence Alert / Label */}
                {extractedData.confidence === 'N/A' ? (
                  <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-white/40" />
                      <span className="font-mono text-[10px] text-white/50 font-bold uppercase tracking-widest">
                        MANUAL INTUITIVE ENTRY
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white">
                      N/A
                    </span>
                  </div>
                ) : extractedData.confidence < 85 ? (
                  <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-400">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                    <div>
                      <span className="font-bold">LOW CONFIDENCE SCAN LEVEL: {extractedData.confidence}%</span>
                      <p className="text-[10px] opacity-80 mt-0.5 font-light">Please check and verify all fields below.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-brand-cyan/5 border border-brand-cyan/15 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-cyan animate-bounce" />
                      <span className="font-mono text-[10px] text-brand-cyan font-bold uppercase tracking-widest">
                        OCR RELIABILITY CONFIDENCE
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white">
                      {extractedData.confidence}% EXCELLENT
                    </span>
                  </div>
                )}

                {/* Validation Warnings Alert Banner */}
                {getValidationWarnings().length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/25 p-3.5 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>SANITY VALIDATION FAILURES:</span>
                    </div>
                    <ul className="list-disc list-inside text-[10px] text-red-300 font-light space-y-1">
                      {getValidationWarnings().map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Frictionless User Inputs Override Section */}
                <div className="space-y-4 border-b border-white/5 pb-5">
                  <div className="text-[10px] font-mono text-brand-cyan font-bold tracking-widest uppercase">
                    Primary Operational Inputs (Required)
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#849495] uppercase font-semibold">Position Size (Lots)</label>
                      <input 
                        type="number" 
                        value={positionSize}
                        onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0.01"
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-brand-cyan/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#849495] uppercase font-semibold">Realized Net PnL ($)</label>
                      <input 
                        type="number" 
                        value={customPnl}
                        onChange={(e) => setCustomPnl(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        className={`w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono focus:border-brand-cyan/50 focus:outline-none ${
                          customPnl >= 0 ? 'text-brand-emerald' : 'text-brand-purple'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-mono text-[#849495] uppercase font-semibold">Felt/Observed Trading Emotion</label>
                      <select 
                        value={selectedEmotion}
                        onChange={(e) => setSelectedEmotion(e.target.value)}
                        className="w-full bg-[#131118] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-brand-cyan/50 focus:outline-none"
                      >
                        <option value="none">No Emotional Intrusion (Disciplined)</option>
                        <option value="greed">Greed (Oversized, chasing extensions)</option>
                        <option value="fear exits">Fear of Exits (Early scaleout of winners)</option>
                        <option value="impatience">Impatience (Forced early entry trigger)</option>
                        <option value="overconfidence">Overconfidence (Skipping rule checks)</option>
                        <option value="revenge behavior">Revenge trading (Compensating recent loss)</option>
                        <option value="hesitation">Hesitation (Delayed entry on validation)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#849495] uppercase font-semibold">Manual Notes Override / Reflection</label>
                    <textarea 
                      value={manualNotes}
                      rows={3}
                      onChange={(e) => setManualNotes(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-xs text-[#b9cacb] font-light leading-relaxed focus:border-brand-cyan/50 focus:outline-none resize-none"
                      placeholder="Add personal observations or cognitive feedback on execution mistakes..."
                    />
                  </div>
                </div>

                {/* Editable Advanced AI Detected Parameters Grid */}
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-white/50 font-bold tracking-widest uppercase flex items-center justify-between">
                    <span>AI Technical Extraction Values</span>
                    <span className="text-[9px] text-[#849495] lowercase">click any to correct</span>
                  </div>

                  <div className="space-y-3 font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 border border-white/5 p-2.5 rounded hover:border-white/10 transition-colors">
                        <label className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest block">ASSET</label>
                        <input 
                          type="text"
                          value={assetName}
                          onChange={(e) => setAssetName(e.target.value)}
                          className="w-full bg-transparent border-none text-xs text-white font-semibold mt-0.5 p-0 focus:outline-none focus:ring-0"
                        />
                      </div>
                      <div className="bg-black/20 border border-white/5 p-2.5 rounded hover:border-white/10 transition-colors">
                        <label className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest block">DIRECTION</label>
                        <select 
                          value={positionType}
                          onChange={(e) => setPositionType(e.target.value as any)}
                          className="w-full bg-transparent border-none text-xs font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0 cursor-pointer text-brand-cyan"
                        >
                          <option value="LONG" className="bg-[#131118]">LONG</option>
                          <option value="SHORT" className="bg-[#131118]">SHORT</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 border border-white/5 p-2.5 rounded hover:border-white/10 transition-colors">
                        <label className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest block">ENTRY PRICE</label>
                        <input 
                          type="number"
                          value={entryPrice}
                          onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                          step="any"
                          className="w-full bg-transparent border-none text-xs text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0"
                        />
                      </div>
                      <div className="bg-black/20 border border-white/5 p-2.5 rounded hover:border-white/10 transition-colors">
                        <label className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest block">EXIT PRICE</label>
                        <input 
                          type="number"
                          value={exitPrice}
                          onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                          step="any"
                          className="w-full bg-transparent border-none text-xs text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 border border-white/5 p-2.5 rounded hover:border-white/10 transition-colors">
                        <label className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest block">STOP LOSS (SL)</label>
                        <input 
                          type="number"
                          value={slLevel}
                          onChange={(e) => setSlLevel(parseFloat(e.target.value) || 0)}
                          step="any"
                          className="w-full bg-transparent border-none text-xs text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0 text-brand-purple"
                        />
                      </div>
                      <div className="bg-black/20 border border-white/5 p-2.5 rounded hover:border-white/10 transition-colors">
                        <label className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest block">TAKE PROFIT (TP)</label>
                        <input 
                          type="number"
                          value={tpLevel}
                          onChange={(e) => setTpLevel(parseFloat(e.target.value) || 0)}
                          step="any"
                          className="w-full bg-transparent border-none text-xs text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0 text-brand-emerald"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-black/20 border border-white/5 p-2 rounded">
                        <span className="text-[7.5px] font-mono text-[#849495] uppercase font-bold block">TIMEFRAME</span>
                        <input 
                          type="text"
                          value={timeframeVal}
                          onChange={(e) => setTimeframeVal(e.target.value)}
                          className="w-full bg-transparent border-none text-[10.5px] text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0"
                        />
                      </div>
                      <div className="bg-black/20 border border-white/5 p-2 rounded">
                        <span className="text-[7.5px] font-mono text-[#849495] uppercase font-bold block">SESSION</span>
                        <select 
                          value={sessionVal}
                          onChange={(e) => setSessionVal(e.target.value)}
                          className="w-full bg-transparent border-none text-[10.5px] text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0"
                        >
                          <option value="London" className="bg-[#131118]">London</option>
                          <option value="New York" className="bg-[#131118]">New York</option>
                          <option value="Asian" className="bg-[#131118]">Asian</option>
                          <option value="London/NY Overlap" className="bg-[#131118]">Ldn/NY</option>
                        </select>
                      </div>
                      <div className="bg-black/20 border border-white/5 p-2 rounded">
                        <span className="text-[7.5px] font-mono text-[#849495] uppercase font-bold block">PIPS / PTS</span>
                        <input 
                          type="number"
                          value={pipsVal}
                          onChange={(e) => setPipsVal(parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent border-none text-[10.5px] text-white font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 border border-white/5 p-2 rounded hover:border-white/10 transition-colors">
                        <span className="text-[7.5px] font-mono text-[#849495] uppercase font-bold block">SETUP TYPE</span>
                        <select 
                          value={setupTypeVal}
                          onChange={(e) => setSetupTypeVal(e.target.value)}
                          className="w-full bg-transparent border-none text-[10.5px] text-brand-cyan font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="breakout" className="bg-[#131118]">breakout</option>
                          <option value="liquidity sweep" className="bg-[#131118]">liquidity sweep</option>
                          <option value="reversal" className="bg-[#131118]">reversal</option>
                          <option value="scalp" className="bg-[#131118]">scalp</option>
                          <option value="trend continuation" className="bg-[#131118]">trend cont.</option>
                          <option value="support resistance bounce" className="bg-[#131118]">S/R bounce</option>
                        </select>
                      </div>

                      <div className="bg-black/20 border border-white/5 p-2 rounded hover:border-white/10 transition-colors">
                        <span className="text-[7.5px] font-mono text-[#849495] uppercase font-bold block">EXECUTION MISTAKE</span>
                        <select 
                          value={mistakeTypeVal}
                          onChange={(e) => setMistakeTypeVal(e.target.value)}
                          className="w-full bg-transparent border-none text-[10.5px] text-brand-purple font-mono font-bold mt-0.5 p-0 focus:outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="none" className="bg-[#131118]">none</option>
                          <option value="early exit" className="bg-[#131118]">early exit</option>
                          <option value="late entry" className="bg-[#131118]">late entry</option>
                          <option value="oversized position" className="bg-[#131118]">oversized</option>
                          <option value="overtrading" className="bg-[#131118]">overtrading</option>
                          <option value="revenge trading" className="bg-[#131118]">revenge</option>
                          <option value="FOMO entry" className="bg-[#131118]">FOMO entry</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Override and Log button */}
                {saveSuccess ? (
                  <div className="bg-brand-emerald/10 border border-brand-emerald/20 p-4 rounded-lg flex items-center gap-3 text-brand-emerald text-xs">
                    <CheckCircle2 className="w-5 h-5 animate-pulse text-brand-emerald" />
                    <div>
                      <div className="font-bold uppercase tracking-wide">EXECUTION COMMITTED SUCCESSFULLY</div>
                      <div className="mt-0.5 opacity-80 font-light text-[10px]">Updating Trading DNA and Cognitive profiling matrices...</div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLogToTerminal}
                    className={`w-full py-4 font-semibold text-xs rounded-lg tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                      userConfirmedLowConfidence 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                        : 'bg-brand-cyan hover:shadow-[0_0_25px_rgba(0,219,231,0.25)] text-black'
                    }`}
                  >
                    {userConfirmedLowConfidence ? 'Force Override & Commit Log' : 'Verify & Commit to Journal'}
                  </button>
                )}

              </div>
            ) : (
              !scanning && (
                <div className="text-center p-12 text-[#849495] text-xs font-light space-y-2">
                  <ShieldCheck className="w-8 h-8 text-white/10 mx-auto" />
                  <p>Awaiting snapshot analysis or preset activation to load. Drag a TradingView chart relative left or choose a preset matrix simulation.</p>
                </div>
              )
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

