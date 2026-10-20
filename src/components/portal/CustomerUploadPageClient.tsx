"use client";

import { CustomerUploadForm } from "@/components/portal/CustomerUploadForm";
import { getFileRequest } from "@/lib/portal/intake-store";

export function CustomerUploadPageClient({ token }: { token: string }) {
  const request = getFileRequest(token);

  if (!request) {
    return (
      <div className="customer-upload customer-upload--missing">
        <h1>Link not found</h1>
        <p className="look-field__hint">
          This upload link may have been replaced or was created in another browser session (demo).
        </p>
      </div>
    );
  }

  return <CustomerUploadForm request={request} />;
}
