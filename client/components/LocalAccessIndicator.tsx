import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HardDrive,
  Folder,
  File,
  Image,
  FileText,
  Music,
  Video,
  Chrome,
  Code,
  Database,
  ChevronDown,
  ChevronRight,
  Eye,
  Lock,
  Wifi,
  WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalFile {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'audio' | 'video' | 'code' | 'database';
  path: string;
  size?: string;
  lastAccessed: Date;
  permission: 'read' | 'write' | 'execute';
}

interface LocalApp {
  id: string;
  name: string;
  type: 'browser' | 'editor' | 'media' | 'system' | 'office';
  status: 'active' | 'background' | 'closed';
  lastUsed: Date;
  permissions: string[];
}

export default function LocalAccessIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    files: true,
    apps: true
  });

  // Mock data for demonstration
  const [accessedFiles] = useState<LocalFile[]>([
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      path: '/Users/username/Documents',
      lastAccessed: new Date(Date.now() - 1000 * 60 * 5),
      permission: 'read'
    },
    {
      id: '2',
      name: 'project-notes.txt',
      type: 'document',
      path: '/Users/username/Documents/project-notes.txt',
      size: '2.4 KB',
      lastAccessed: new Date(Date.now() - 1000 * 60 * 10),
      permission: 'read'
    },
    {
      id: '3',
      name: 'presentation.pdf',
      type: 'document',
      path: '/Users/username/Downloads/presentation.pdf',
      size: '5.2 MB',
      lastAccessed: new Date(Date.now() - 1000 * 60 * 15),
      permission: 'read'
    },
    {
      id: '4',
      name: 'vacation-photos',
      type: 'folder',
      path: '/Users/username/Pictures/vacation-photos',
      lastAccessed: new Date(Date.now() - 1000 * 60 * 30),
      permission: 'read'
    }
  ]);

  const [accessedApps] = useState<LocalApp[]>([
    {
      id: '1',
      name: 'Chrome Browser',
      type: 'browser',
      status: 'active',
      lastUsed: new Date(Date.now() - 1000 * 60 * 2),
      permissions: ['Network Access', 'File Downloads']
    },
    {
      id: '2',
      name: 'VS Code',
      type: 'editor',
      status: 'background',
      lastUsed: new Date(Date.now() - 1000 * 60 * 20),
      permissions: ['File System', 'Terminal Access']
    },
    {
      id: '3',
      name: 'Spotify',
      type: 'media',
      status: 'background',
      lastUsed: new Date(Date.now() - 1000 * 60 * 45),
      permissions: ['Audio Output', 'Network Access']
    }
  ]);

  const getFileIcon = (type: LocalFile['type']) => {
    switch (type) {
      case 'folder': return <Folder className="h-4 w-4 text-blue-500" />;
      case 'document': return <FileText className="h-4 w-4 text-green-600" />;
      case 'image': return <Image className="h-4 w-4 text-purple-500" />;
      case 'audio': return <Music className="h-4 w-4 text-orange-500" />;
      case 'video': return <Video className="h-4 w-4 text-red-500" />;
      case 'code': return <Code className="h-4 w-4 text-indigo-500" />;
      case 'database': return <Database className="h-4 w-4 text-yellow-600" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAppIcon = (type: LocalApp['type']) => {
    switch (type) {
      case 'browser': return <Chrome className="h-4 w-4 text-blue-500" />;
      case 'editor': return <Code className="h-4 w-4 text-indigo-500" />;
      case 'media': return <Music className="h-4 w-4 text-green-500" />;
      case 'system': return <HardDrive className="h-4 w-4 text-gray-600" />;
      case 'office': return <FileText className="h-4 w-4 text-blue-600" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: LocalApp['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
      case 'background':
        return <Badge variant="secondary">Background</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="File & app access status"
              >
                <HardDrive className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              File & App Access Status
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="max-w-2xl h-[70vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            File & App Access Status
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-6">
              {/* Recently Accessed Files */}
              <div>
                <Collapsible 
                  open={expandedSections.files} 
                  onOpenChange={() => toggleSection('files')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Recent Files</h3>
                        <Badge variant="secondary">{accessedFiles.length}</Badge>
                      </div>
                      {expandedSections.files ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-2 mt-3">
                    {accessedFiles.map((file) => (
                      <Card key={file.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{file.path}</p>
                              {file.size && (
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={file.permission === 'read' ? 'secondary' : 'default'}>
                              {file.permission === 'read' && <Eye className="h-3 w-3 mr-1" />}
                              {file.permission === 'write' && <Lock className="h-3 w-3 mr-1" />}
                              {file.permission}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(file.lastAccessed)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Active Applications */}
              <div>
                <Collapsible 
                  open={expandedSections.apps} 
                  onOpenChange={() => toggleSection('apps')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Applications</h3>
                        <Badge variant="secondary">{accessedApps.length}</Badge>
                      </div>
                      {expandedSections.apps ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-2 mt-3">
                    {accessedApps.map((app) => (
                      <Card key={app.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getAppIcon(app.type)}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{app.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {app.permissions.map((permission) => (
                                  <Badge 
                                    key={permission} 
                                    variant="outline" 
                                    className="text-xs"
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(app.status)}
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(app.lastUsed)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Security Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Privacy & Security</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        All data processing happens locally on your device. No information is sent to external servers.
                        File access is read-only unless explicitly granted write permissions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
