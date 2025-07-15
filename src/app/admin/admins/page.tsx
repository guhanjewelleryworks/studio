// src/app/admin/admins/page.tsx
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users2, ArrowLeft, RefreshCw, Loader2, AlertTriangle, Trash2, UserPlus, Eye, EyeOff, ShieldAlert, BadgeInfo, Pencil } from 'lucide-react';
import Link from 'next/link';
import { fetchAllAdmins, createAdmin, deleteAdmin, updateAdmin } from '@/actions/admin-actions';
import type { Admin, NewAdminInput, Permission, UpdateAdminInput } from '@/types/goldsmith';
import { validPermissions } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminAccess } from '@/hooks/useAdminAccess';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

const permissionDescriptions: Record<Permission, string> = {
    canManageAdmins: "Add, edit, and delete other administrators.",
    canManageCustomers: "View and manage customer accounts.",
    canManageGoldsmiths: "Approve, reject, and manage goldsmith partner profiles.",
    canManageOrders: "View and update status for all customer orders.",
    canManageCommunications: "View and archive messages from the public contact form.",
    canManageSettings: "Change global platform settings like announcements.",
    canViewAuditLogs: "View the log of all significant actions on the platform.",
    canGenerateReports: "Generate and download platform reports.",
    canViewDatabase: "View raw data from the database collections.",
};

export default function AdminAdminsPage() {
  const { hasPermission, isAccessLoading } = useAdminAccess('canManageAdmins');
  const [admins, setAdmins] = useState<Omit<Admin, 'password'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Create Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSelectedPermissions, setNewSelectedPermissions] = useState<Permission[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Edit Dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Omit<Admin, 'password'> | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingPermissions, setEditingPermissions] = useState<Permission[]>([]);

  const loadAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllAdmins();
      setAdmins(data || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setError("Could not load administrator data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAccessLoading && hasPermission) {
      loadAdmins();
    }
  }, [isAccessLoading, hasPermission]);


  const handleCreateAdmin = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasPermission) {
        toast({ title: "Access Denied", description: "You do not have permission to create new admins.", variant: "destructive" });
        return;
    }

    if (!newName || !newEmail || !newPassword || newSelectedPermissions.length === 0) {
        toast({ title: "Missing fields", description: "Please provide name, email, password, and at least one permission.", variant: "destructive" });
        return;
    }
    setIsProcessing(true);
    const newAdminData: NewAdminInput = {
        name: newName,
        email: newEmail,
        password: newPassword,
        permissions: newSelectedPermissions,
    };

    const result = await createAdmin(newAdminData);
    if (result.success) {
        toast({ title: "Admin Created", description: `Administrator account for ${newName} has been created.` });
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setNewSelectedPermissions([]);
        loadAdmins();
    } else {
        toast({ title: "Creation Failed", description: result.error, variant: "destructive" });
    }
    setIsProcessing(false);
  };
  
  const handleEditAdmin = (admin: Omit<Admin, 'password'>) => {
    setSelectedAdmin(admin);
    setEditingName(admin.name);
    setEditingPermissions(admin.permissions || []);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedAdmin || !hasPermission) return;
    
    setIsProcessing(true);
    const updateData: UpdateAdminInput = {
      id: selectedAdmin.id,
      name: editingName,
      permissions: editingPermissions
    };

    const result = await updateAdmin(updateData);
    if (result.success) {
      toast({ title: "Admin Updated", description: `Details for ${editingName} have been updated.` });
      setIsEditDialogOpen(false);
      loadAdmins();
    } else {
      toast({ title: "Update Failed", description: result.error, variant: "destructive" });
    }
    setIsProcessing(false);
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!hasPermission) {
        toast({ title: "Access Denied", description: "You do not have permission to delete admins.", variant: "destructive" });
        return;
    }
    setIsProcessing(true);
    const result = await deleteAdmin(adminId);
     if (result.success) {
        toast({ title: "Admin Deleted", description: `Administrator account for ${adminName} has been deleted.` });
        loadAdmins();
    } else {
        toast({ title: "Deletion Failed", description: result.error, variant: "destructive" });
    }
    setIsProcessing(false);
  };
  
  const togglePermission = (permission: Permission, isEditing: boolean = false) => {
    if (isEditing) {
       setEditingPermissions(prev => 
        prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
      );
    } else {
      setNewSelectedPermissions(prev => 
          prev.includes(permission) 
          ? prev.filter(p => p !== permission)
          : [...prev, permission]
      );
    }
  };

  if (isAccessLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="container py-8 text-center">
        <Card className="max-w-md mx-auto shadow-lg bg-card border-destructive/20">
          <CardHeader>
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have the required permissions to manage administrators.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Manage Administrators</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadAdmins} variant="outline" size="sm" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                {isLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
                Refresh
            </Button>
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
                <CardHeader>
                <CardTitle className="text-xl text-accent font-heading">Current Administrators</CardTitle>
                <CardDescription className="text-muted-foreground">
                    List of users with access to the admin portal.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error Loading Data</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-foreground">Name</TableHead>
                                    <TableHead className="text-foreground">Email</TableHead>
                                    <TableHead className="text-foreground">Role</TableHead>
                                    <TableHead className="text-foreground">Permissions</TableHead>
                                    <TableHead className="text-right text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium text-foreground">{admin.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                                    <TableCell><Badge variant={admin.role === 'superadmin' ? 'destructive' : 'secondary'} className="capitalize">{admin.role}</Badge></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {admin.permissions.length === validPermissions.length 
                                        ? "All" 
                                        : `${admin.permissions.length || 0} assigned`
                                        }
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {(admin.role !== 'superadmin' && hasPermission) ? (
                                        <>
                                            <Button variant="ghost" size="icon" className="text-accent hover:bg-accent/10" onClick={() => handleEditAdmin(admin)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" disabled={isProcessing}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the admin account for <span className="font-bold text-accent">{admin.name}</span>.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteAdmin(admin.id, admin.name)} className="bg-destructive hover:bg-destructive/90">
                                                        Yes, delete admin
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                        ) : (
                                            admin.role === 'superadmin' ?
                                            <span className="text-xs text-muted-foreground italic pr-4">Cannot modify superadmin</span>
                                            : null
                                        )}
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-xl text-accent font-heading">Add New Administrator</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Assign permissions to the new administrator.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Jane Doe" required disabled={isProcessing}/>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="e.g. jane@example.com" required disabled={isProcessing}/>
                        </div>
                        <div className="space-y-1.5 relative">
                            <Label htmlFor="password">Initial Password</Label>
                            <Input id="password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Set a strong initial password" required disabled={isProcessing}/>
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                            <div className="space-y-3">
                            <Label>Permissions</Label>
                            <Alert variant="default" className="p-2 border-blue-500/20 bg-blue-500/5">
                            <BadgeInfo className="h-4 w-4 !text-blue-500"/>
                            <AlertDescription className="text-xs text-blue-800 dark:text-blue-300">
                                Assigning 'Manage Admins' will grant superadmin privileges.
                            </AlertDescription>
                            </Alert>
                            <div className="space-y-2 rounded-md border p-3 max-h-60 overflow-y-auto">
                            {validPermissions.map(permission => (
                                <div key={permission} className="flex items-start space-x-2">
                                    <Checkbox 
                                        id={permission} 
                                        checked={newSelectedPermissions.includes(permission)}
                                        onCheckedChange={() => togglePermission(permission, false)}
                                        disabled={isProcessing}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label htmlFor={permission} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {permission.replace(/([A-Z])/g, ' $1').replace('can ', '').trim()}
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            {permissionDescriptions[permission]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4"/>}
                            {isProcessing ? "Creating..." : "Create Admin"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Modify the name and permissions for {selectedAdmin?.email}.
            </DialogDescription>
          </DialogHeader>
           <form onSubmit={handleUpdateAdmin} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                  <Label htmlFor="editingName">Full Name</Label>
                  <Input id="editingName" value={editingName} onChange={(e) => setEditingName(e.target.value)} disabled={isProcessing} />
              </div>
               <div className="space-y-3">
                  <Label>Permissions</Label>
                  <Alert variant="default" className="p-2 border-blue-500/20 bg-blue-500/5">
                  <BadgeInfo className="h-4 w-4 !text-blue-500"/>
                  <AlertDescription className="text-xs text-blue-800 dark:text-blue-300">
                      Assigning 'Manage Admins' will grant superadmin privileges.
                  </AlertDescription>
                  </Alert>
                  <div className="space-y-2 rounded-md border p-3 max-h-60 overflow-y-auto">
                  {validPermissions.map(permission => (
                      <div key={`edit-${permission}`} className="flex items-start space-x-2">
                          <Checkbox 
                              id={`edit-${permission}`}
                              checked={editingPermissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission, true)}
                              disabled={isProcessing}
                          />
                          <div className="grid gap-1.5 leading-none">
                              <label htmlFor={`edit-${permission}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {permission.replace(/([A-Z])/g, ' $1').replace('can ', '').trim()}
                              </label>
                          </div>
                      </div>
                  ))}
                  </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save changes
                </Button>
              </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
