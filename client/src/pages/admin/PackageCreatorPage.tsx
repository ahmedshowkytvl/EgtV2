import React, { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { PackageCreatorForm } from "@/components/dashboard/PackageCreatorForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { IconSelector } from "@/components/ui/IconSelector";
import { Home, Package, ArrowLeft } from "lucide-react";
export default function PackageCreatorPage() {
  // Temporarily remove useLanguage to fix runtime error
  const t = (key: string, fallback: string) => fallback;
  const [, setLocation] = useLocation();
  const params = useParams();
  const packageId = params?.id; // Get package ID from URL if it exists
  const isEditMode = !!packageId;
  
  // Add debugging to help diagnose the issue
  useEffect(() => {
    console.log("PackageCreatorPage mounted");
    console.log("isEditMode:", isEditMode);
    console.log("packageId:", packageId);
  }, [isEditMode, packageId]);
  
  const pageTitle = isEditMode ? t('admin.packages.editPackage', 'Edit Package') : t('admin.packages.createPackage', 'Create New Package');

  return (
    <div>
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" className="flex items-center gap-1">
              <Home size={16} />
              <span>Dashboard</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/packages" className="flex items-center gap-1">
              <Package size={16} />
              <span>Packages</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>{pageTitle}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">{pageTitle}</h1>
          <Button 
            variant="outline" 
            className="gap-1" 
            onClick={() => {
              // The form component will handle the unsaved changes warning
              const event = new CustomEvent('navigate-request', { 
                detail: { destination: '/admin/packages' } 
              });
              window.dispatchEvent(event);
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Packages</span>
          </Button>
        </div>
        <PackageCreatorForm 
          packageId={packageId} 
          onNavigateRequest={() => setLocation("/admin/packages")}
        />
      </div>
    </div>
  );
}