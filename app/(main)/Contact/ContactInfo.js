'use client';

import { useState } from "react";
import { Check, Copy, Mail, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ContactInfo() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      description: "Email copied to clipboard!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-7 lg:w-[22rem]">
      <h2 className="mb-6 text-2xl font-bold text-white">Contact information</h2>
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-200" />
          <span className="min-w-0 break-words text-white">Mohammad Raihan Shaikh</span>
        </div>
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => copyToClipboard('shkmraihan@gmail.com')}
        >
          <Mail className="h-5 w-5 text-gray-200" />
          <span className="min-w-0 break-all text-white transition-colors group-hover:text-green-400">
            shkmraihan@gmail.com
          </span>
          <div className="relative">
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

