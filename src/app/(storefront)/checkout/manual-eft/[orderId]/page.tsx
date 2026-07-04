"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ManualEFTPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("proofOfPayment", file);

    try {
      const res = await fetch(`/api/orders/${orderId}/proof-of-payment`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-brand-gold mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Bank Transfer Payment</h1>
          <p className="text-gray-500 mt-2">Order #{orderId}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-amber-800 mb-4">Bank Details</h3>
          <div className="space-y-2 text-sm text-amber-700 font-mono">
            <p><strong>Account Holder:</strong> LD PHAAHLA</p>
            <p><strong>Account Number:</strong> 51045370183</p>
            <p><strong>Branch Code:</strong> 678910</p>
            <p><strong>Reference:</strong> {orderId}</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Proof Uploaded</h2>
            <p className="text-gray-500 mb-6">Your proof of payment has been submitted. Our team will verify it within 24 hours.</p>
            <button onClick={() => router.push("/account/orders")} className="btn-primary w-full max-w-xs">
              View Orders
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Upload Proof of Payment</label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-brand-gold'}`}
                onClick={() => document.getElementById("pof-input")?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
              >
                <input
                  id="pof-input"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
                  className="hidden"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 text-green-500 mb-2" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click or drag to upload</p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG (max 5MB)</p>
                  </>
                )}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-primary w-full"
            >
              {uploading ? "Uploading..." : "Submit Proof of Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}