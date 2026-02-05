"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Folder, FileText, Search, Plus, Filter, MoreVertical, HardDrive, Radio, Cloud, Sparkles, Upload, X } from "lucide-react"
import { useLiveStatus } from "@/hooks/use-live-metrics"
import { toast } from "sonner"
import { useState } from "react"

const folders = [
    { name: "Standard Ops", files: 12, size: "156 MB", color: "text-blue-500" },
    { name: "Safety Manuals", files: 8, size: "42 MB", color: "text-green-500" },
    { name: "Client Contracts", files: 24, size: "1.2 GB", color: "text-yellow-500" },
    { name: "Training Material", files: 45, size: "850 MB", color: "text-purple-500" },
]

const recentFiles = [
    { name: "2026_Operations_Strategy.pdf", folder: "Standard Ops", date: "2 hours ago", size: "4.2 MB" },
    { name: "Q1_Safety_Guidelines.docx", folder: "Safety Manuals", date: "Yesterday", size: "1.2 MB" },
    { name: "Site_Survey_Alpha.pdf", folder: "Field Logs", date: "Jan 14", size: "12.5 MB" },
    { name: "New_Hire_Onboarding.mp4", folder: "Training", date: "Jan 12", size: "145 MB" },
]

export default function DocumentsPage() {
    const status = useLiveStatus()
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = () => {
        setShowUploadModal(true)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setSelectedFiles(prev => [...prev, ...files])
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUploadFiles = async () => {
        if (selectedFiles.length === 0) {
            toast.error("No files selected")
            return
        }

        setIsUploading(true)
        
        // Simulate upload process
        toast.success(`Uploading ${selectedFiles.length} file(s)...`, {
            description: "Upload in progress"
        })

        // Simulate upload delay
        setTimeout(() => {
            toast.success("Upload Complete!", {
                description: `${selectedFiles.length} file(s) uploaded successfully`
            })
            setIsUploading(false)
            setSelectedFiles([])
            setShowUploadModal(false)
        }, 2000)

        // Here you would add your actual upload logic:
        // const formData = new FormData()
        // selectedFiles.forEach(file => formData.append('files', file))
        // await fetch('/api/upload', { method: 'POST', body: formData })
    }

    const handleFolderClick = (folderName: string) => {
        setSelectedFolder(folderName)
        toast.info(`Opened folder: ${folderName}`)
    }

    const handleFilterClick = () => {
        toast.info("Filter options: By Date, By Type, By Size")
    }

    const handleFileOptions = (fileName: string) => {
        toast.success(`Options for ${fileName}: Download, Share, Delete`)
    }

    const handleDocumentClick = (fileName: string) => {
        toast.success(`Opening ${fileName}...`, { description: "Document preview" })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="flex h-screen bg-background font-sans overflow-hidden">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Upload Protocol</h2>
                                <p className="text-sm text-muted-foreground mt-1">Select files to upload to cloud storage</p>
                            </div>
                            <button 
                                onClick={() => setShowUploadModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Drag & Drop Zone */}
                            <label className="block">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-white/5">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                                    <p className="text-sm font-bold text-foreground mb-1">Click to select files</p>
                                    <p className="text-xs text-muted-foreground">or drag and drop files here</p>
                                </div>
                            </label>

                            {/* Selected Files List */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <h3 className="text-sm font-bold text-foreground mb-3">Selected Files ({selectedFiles.length})</h3>
                                    <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground ml-2"
                                                    type="button"
                                                    disabled={isUploading}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 transition-all"
                                type="button"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadFiles}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                type="button"
                                disabled={selectedFiles.length === 0 || isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            <Sidebar currentPage="documents" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="space-y-1 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-display">Cloud Documents</h1>
                                <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-[0.1em] md:tracking-[0.2em] animate-pulse flex items-center gap-1.5 whitespace-nowrap">
                                    <Cloud className="w-3 h-3" />
                                    <span className="hidden sm:inline">Secure Cloud Sync: {status}</span>
                                    <span className="sm:hidden">Cloud: {status}</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium opacity-70">Operational Repository</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleUpload} className="px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap">
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Upload Protocol</span>
                                <span className="sm:hidden">Upload</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                        <HardDrive className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Storage</p>
                                        <h3 className="text-xl font-extrabold text-foreground">128 GB <span className="text-xs font-normal text-muted-foreground">/ 1 TB</span></h3>
                                    </div>
                                </div>
                                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[12.8%] shadow-[0_0_10px_var(--primary)]"></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold tracking-tight">Quick Access Folders</h3>
                            <button onClick={() => toast.info("Viewing all folders")} className="text-xs font-bold text-primary uppercase tracking-wider hover:underline underline-offset-4">View All</button>
                        </div>
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {folders.map((folder) => (
                                <Card key={folder.name} onClick={() => handleFolderClick(folder.name)} className="bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                                        <Folder className="w-12 h-12" />
                                    </div>
                                    <CardContent className="pt-6">
                                        <Folder className={`w-8 h-8 ${folder.color} mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_currentColor]`} />
                                        <h4 className="font-bold text-sm mb-1 text-foreground">{folder.name}</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{folder.files} files • {folder.size}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Card className="bg-card/40 backdrop-blur-xl border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search encrypted protocols..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleFilterClick} type="button" className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-all">
                                    <Filter className="w-3.5 h-3.5" />
                                    Filter
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr className="text-left text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.15em] border-b border-white/5 whitespace-nowrap sm:whitespace-normal">
                                        <th className="px-3 sm:px-6 py-4">Protocol Name</th>
                                        <th className="px-3 sm:px-6 py-4 hidden md:table-cell">Folder</th>
                                        <th className="px-3 sm:px-6 py-4 hidden sm:table-cell">Last Modified</th>
                                        <th className="px-3 sm:px-6 py-4 hidden lg:table-cell">Bit Scale</th>
                                        <th className="px-3 sm:px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentFiles.map((file) => (
                                        <tr key={file.name} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-3 sm:px-6 py-4">
                                                <button onClick={() => handleDocumentClick(file.name)} className="flex items-center gap-2 sm:gap-3 hover:opacity-70" type="button">
                                                    <div className="p-1 sm:p-2 bg-white/5 rounded-lg flex-shrink-0">
                                                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors line-clamp-1">{file.name}</span>
                                                </button>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs font-medium text-muted-foreground tracking-wide hidden md:table-cell">{file.folder}</td>
                                            <td className="px-3 sm:px-6 py-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">{file.date}</td>
                                            <td className="px-3 sm:px-6 py-4 text-xs font-bold font-mono text-muted-foreground hidden lg:table-cell">{file.size}</td>
                                            <td className="px-3 sm:px-6 py-4 text-right">
                                                <button onClick={() => handleFileOptions(file.name)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground" type="button">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    )
}