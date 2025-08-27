import React, { useState, useEffect, useRef } from 'react';
import { Link, Copy, BarChart3, Trash2, Plus, Globe, Shield, Zap, TrendingUp, Download, Search, QrCode, Star, Settings, Target, X, Users, Sparkles, MoreHorizontal, Edit } from 'lucide-react';

// --- Reusable Modal Component ---
const Modal = ({ children, isOpen, onClose, size = 'max-w-md' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${size} transform transition-all duration-300 scale-95 animate-scale-in flex flex-col`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
            <div className="fixed inset-0 z-[-1]" onClick={onClose}></div>
        </div>
    );
};

// --- Analytics Modal Component ---
const AnalyticsModal = ({ url, onClose }) => {
    if (!url) return null;
    const chartData = (data, label) => {
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);
        if (total === 0) return <p className="text-sm text-gray-500 dark:text-gray-400">No {label} data yet.</p>;
        return (
            <div className="space-y-3">
                {Object.entries(data).sort(([,a],[,b]) => b-a).map(([key, value]) => (
                    <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                            <span className="text-gray-500 dark:text-gray-400">{value} clicks ({((value / total) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-progress" style={{ width: `${(value / total) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    return (
        <Modal isOpen={!!url} onClose={onClose} size="max-w-3xl">
            <div className="p-8 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
                        <p className="text-sm text-indigo-500 dark:text-indigo-400 font-mono break-all">{url.shortUrl}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center"><p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{url.clickCount}</p><p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p></div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center"><p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{url.uniqueClicks}</p><p className="text-sm text-gray-600 dark:text-gray-400">Unique Clicks</p></div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center"><p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{url.lastClicked ? new Date(url.lastClicked).toLocaleDateString() : 'N/A'}</p><p className="text-sm text-gray-600 dark:text-gray-400">Last Click</p></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div><h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Geographic Data</h3>{chartData(url.countries, 'geographic')}</div>
                    <div><h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Device Types</h3>{chartData(url.devices, 'device')}</div>
                    <div className="lg:col-span-2"><h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Referrers</h3>{chartData(url.referrers, 'referrer')}</div>
                </div>
            </div>
        </Modal>
    );
};

// --- QR Code Modal ---
const QRCodeModal = ({ url, onClose }) => {
    const [color, setColor] = useState("#000000");
    const canvasRef = useRef(null);

    useEffect(() => {
        const scriptId = 'qrcode-script';
        let script = document.getElementById(scriptId);
        const drawQRCode = () => {
            if (window.QRCode && canvasRef.current) {
                window.QRCode.toCanvas(canvasRef.current, url.shortUrl, { width: 256, color: { dark: color, light: '#FFFFFFFF' } }, (error) => { if (error) console.error(error); });
            }
        };
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.1/qrcode.min.js";
            script.async = true;
            script.onload = drawQRCode;
            document.body.appendChild(script);
        } else { drawQRCode(); }
    }, [url.shortUrl, color]);

    const downloadQRCode = () => {
        if (canvasRef.current) {
            const pngUrl = canvasRef.current.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `${url.shortCode}-qrcode.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <Modal isOpen={!!url} onClose={onClose} size="max-w-sm">
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">QR Code</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="flex justify-center p-4 bg-white rounded-lg mb-4"><canvas ref={canvasRef} style={{width: '256px', height: '256px'}}></canvas></div>
                <div className="flex items-center space-x-2 mb-4">
                    <label htmlFor="qrColor" className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</label>
                    <input id="qrColor" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded border-gray-300" />
                </div>
                <button onClick={downloadQRCode} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center"><Download size={18} className="mr-2" /> Download PNG</button>
            </div>
        </Modal>
    );
};

// --- Create/Edit Link Modal ---
const CreateLinkModal = ({ isOpen, onClose, onSave, apiKey }) => {
    const [destination, setDestination] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [description, setDescription] = useState('');
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isAiDescLoading, setIsAiDescLoading] = useState(false);
    const [isAiAliasLoading, setIsAiAliasLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidUrl = (string) => { try { new URL(string); return true; } catch (_) { return false; } };

    const callGemini = async (prompt) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            const result = await response.json();
            return result.candidates[0].content.parts[0].text;
        } catch (err) {
            console.error("Gemini API call failed:", err);
            setError("AI service is unavailable. Please try again later.");
            return null;
        }
    };

    const generateAIDescription = async () => {
        if (!isValidUrl(destination)) { setError("Please enter a valid URL first."); return; }
        setError('');
        setIsAiDescLoading(true);
        const prompt = `Based on the content of the URL "${destination}", generate a concise and compelling description for a link shortener. Max 100 characters.`;
        const generatedDesc = await callGemini(prompt);
        if (generatedDesc) setDescription(generatedDesc.replace(/"/g, ''));
        setIsAiDescLoading(false);
    };

    const generateAISuggestions = async () => {
        if (!isValidUrl(destination)) { setError("Please enter a valid URL first."); return; }
        setError('');
        setIsAiAliasLoading(true);
        setAiSuggestions([]);
        const prompt = `Based on the content of the URL "${destination}", generate 3 creative, short, and memorable URL aliases. Each alias should be a single word or a short hyphenated phrase (e.g., "creative-brief", "summer-sale"). Return them as a comma-separated list. For example: alias-one,alias-two,alias-three`;
        const suggestionsText = await callGemini(prompt);
        if (suggestionsText) setAiSuggestions(suggestionsText.split(',').map(s => s.trim()));
        setIsAiAliasLoading(false);
    };

    const handleSave = () => {
        if (!isValidUrl(destination)) { setError("A valid destination URL is required."); return; }
        onSave({ destination, customAlias, description });
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="max-w-2xl">
            <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create a New Link</h2>
                {error && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Destination URL</label>
                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="https://your-long-url.com" className="w-full mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                    <div className="relative mt-2">
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description for your link..." rows="3" className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition resize-none" />
                        <button onClick={generateAIDescription} disabled={isAiDescLoading} className="absolute right-3 top-3 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 disabled:opacity-50">
                            {isAiDescLoading ? <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div> : <Sparkles size={16} />}
                        </button>
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Link Alias (Optional)</label>
                    <input type="text" value={customAlias} onChange={e => setCustomAlias(e.target.value)} placeholder="e.g., summer-sale" className="w-full mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition" />
                    <button onClick={generateAISuggestions} disabled={isAiAliasLoading} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2 transition-colors mt-2">
                        <Sparkles size={16} /> {isAiAliasLoading ? 'Getting suggestions...' : 'Get AI Suggestions'}
                    </button>
                    {aiSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {aiSuggestions.map(s => <button key={s} onClick={() => setCustomAlias(s)} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors">{s}</button>)}
                        </div>
                    )}
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-indigo-400/30">Create Link</button>
                </div>
            </div>
        </Modal>
    )
}

const UrlShortener = () => {
  const [workspaces, setWorkspaces] = useState({});
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('personal');
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [showAnalyticsFor, setShowAnalyticsFor] = useState(null);
  const [showQRFor, setShowQRFor] = useState(null);
  
  useEffect(() => {
    const savedWorkspaces = localStorage.getItem('shortenerWorkspaces');
    if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
    else setWorkspaces({
        personal: { id: 'personal', name: 'Personal', urls: [], settings: { apiKey: `` } },
        team: { id: 'team', name: 'Marketing Team', urls: [], settings: { apiKey: `` } }
    });
    if (localStorage.getItem('darkMode') === 'true') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (Object.keys(workspaces).length > 0) localStorage.setItem('shortenerWorkspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => { 
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const currentUrls = workspaces[currentWorkspaceId]?.urls || [];
  const currentSettings = workspaces[currentWorkspaceId]?.settings || {};

  const handleCreateLink = (linkData) => {
    const shortCode = linkData.customAlias || Math.random().toString(36).substr(2, 6);
    const newUrl = {
      id: Date.now(), shortCode, shortUrl: `https://short.pro/${shortCode}`,
      destinations: [{url: linkData.destination}],
      createdAt: new Date(), clickCount: 0, isActive: true, description: linkData.description || null,
      clicks: [], starred: false, lastClicked: null, uniqueClicks: 0,
      referrers: {}, countries: {}, devices: {}
    };
    setWorkspaces(prev => ({ ...prev, [currentWorkspaceId]: { ...prev[currentWorkspaceId], urls: [newUrl, ...currentUrls] } }));
  };

  const handleUrlClick = (id) => {
    const url = currentUrls.find(u => u.id === id);
    if (!url || !url.isActive) return;
    const visitor = { country: 'US', device: 'Desktop', referrer: 'Google' };
    setWorkspaces(prev => ({ ...prev, [currentWorkspaceId]: { ...prev[currentWorkspaceId], urls: prev[currentWorkspaceId].urls.map(u => u.id === id ? { ...u, clickCount: u.clickCount + 1, lastClicked: new Date(), uniqueClicks: u.uniqueClicks + 1, countries: {...u.countries, [visitor.country]: (u.countries[visitor.country] || 0) + 1}, devices: {...u.devices, [visitor.device]: (u.devices[visitor.device] || 0) + 1}, referrers: {...u.referrers, [visitor.referrer]: (u.referrers[visitor.referrer] || 0) + 1}, } : u) } }));
    window.open(url.destinations[0].url, '_blank');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-fast { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes progress { 0% { width: 0%; } 100% { /* width is set inline */ } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-progress { animation: progress 1s ease-out forwards; }
      `}</style>
      <div className={`min-h-screen font-sans transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300`}>
        <CreateLinkModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSave={handleCreateLink} apiKey={currentSettings.apiKey}/>
        {showAnalyticsFor && <AnalyticsModal url={currentUrls.find(u => u.id === showAnalyticsFor)} onClose={() => setShowAnalyticsFor(null)} />}
        {showQRFor && <QRCodeModal url={currentUrls.find(u => u.id === showQRFor)} onClose={() => setShowQRFor(null)} />}
        
        <div className="container mx-auto px-4 py-8">
          <header className="mb-10 animate-fade-in">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <Users size={20} className="text-gray-500" />
                      <select value={currentWorkspaceId} onChange={e => setCurrentWorkspaceId(e.target.value)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 text-sm font-medium">
                          {Object.values(workspaces).map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
                      </select>
                  </div>
                  <div className="flex items-center">
                      <Zap className={`w-10 h-10 mr-2 text-indigo-500`} />
                      <h1 className={`text-3xl font-bold text-gray-800 dark:text-white`}>ShortLink Pro</h1>
                  </div>
                  <div className="flex items-center gap-2">
                      <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">{darkMode ? '☀️' : '🌙'}</button>
                      <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all">
                          <Plus size={18}/> Create Link
                      </button>
                  </div>
              </div>
          </header>

          {currentUrls.length > 0 ? (
            <div className="space-y-4 max-w-5xl mx-auto">
              {currentUrls.map((url, index) => (
                <div key={url.id} className={`p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 transition-all hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 animate-fade-in-up`} style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${url.isActive ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Link size={24} className={url.isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleUrlClick(url.id); }} className="font-semibold text-lg text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">{url.shortUrl}</a>
                                <button onClick={() => {navigator.clipboard.writeText(url.shortUrl); setCopiedId(url.id); setTimeout(() => setCopiedId(null), 2000)}} className="text-gray-400 hover:text-gray-600">{copiedId === url.id ? '✅' : <Copy size={16} />}</button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">{url.description || url.destinations[0].url}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-md">
                            <BarChart3 size={16} className="text-gray-500"/>
                            <span className="font-medium text-sm">{url.clickCount}</span>
                        </div>
                        <div className={`px-3 py-1.5 text-xs font-medium rounded-md ${url.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{url.isActive ? 'Active' : 'Inactive'}</div>
                        <button onClick={() => setShowQRFor(url.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-800"><QrCode size={18} /></button>
                        <button onClick={() => setShowAnalyticsFor(url.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-800"><TrendingUp size={18} /></button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-800"><MoreHorizontal size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in-up">
                <div className="inline-block bg-indigo-100 dark:bg-indigo-900/50 p-5 rounded-full">
                    <Link size={40} className="text-indigo-600 dark:text-indigo-400"/>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">No links yet!</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by creating your first smart link.</p>
                <button onClick={() => setCreateModalOpen(true)} className="mt-8 flex items-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all mx-auto">
                    <Plus size={20}/> Create Your First Link
                </button>
            </div>
          )}
        </div>
      </div>
    </>