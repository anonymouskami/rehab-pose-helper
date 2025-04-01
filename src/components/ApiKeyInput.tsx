
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeySaved: (apiKey: string) => void;
}

const API_KEY_STORAGE_KEY = "rehab-pose-api-key";

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySaved }) => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);

  // Load saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setSavedApiKey(savedKey);
      onApiKeySaved(savedKey);
    }
  }, [onApiKeySaved]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    // Save to localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    setSavedApiKey(apiKey);
    onApiKeySaved(apiKey);
    
    toast.success("API key saved successfully");
    setApiKey(""); // Clear input
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setSavedApiKey(null);
    onApiKeySaved("");
    toast.success("API key removed");
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-md border">
      <h3 className="font-medium">AI Recommendation API Key</h3>
      
      {savedApiKey ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">API Key Saved</div>
            <span className="text-sm text-gray-500">Key: ••••••••{savedApiKey.slice(-4)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearApiKey} className="w-full">
            Remove API Key
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your AI API key"
            className="flex-1"
          />
          <Button onClick={handleSaveApiKey}>Save</Button>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Your API key will be stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
};

export default ApiKeyInput;
