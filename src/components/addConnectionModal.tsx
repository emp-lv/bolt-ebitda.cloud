import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Profile } from '../types/profile';
import { ConnectionType } from '../types/connection';

interface AddConnectionModalProps {
  targetProfile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    type: ConnectionType;
    net: number;
    public: boolean;
    showNet: boolean;
  }) => void;
  connectionType: 'source' | 'destination';
}

function AddConnectionModal({
  targetProfile,
  isOpen,
  onClose,
  onAdd,
  connectionType
}: AddConnectionModalProps) {
  const [formData, setFormData] = useState({
    type: 'affiliate' as ConnectionType,
    net: 0,
    public: true,
    showNet: false,
  });

  if (!isOpen) return null;

  const handleAdd = () => {
    onAdd(formData);
    onClose();
    // Reset form
    setFormData({
      type: 'affiliate',
      net: 0,
      public: true,
      showNet: false,
    });
  };

  const connectionTypes: ConnectionType[] = ['owner', 'affiliate', 'partner', 'other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-lg border border-white/20 p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Add {connectionType === 'source' ? 'Income Source' : 'Destination'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <img 
              src={targetProfile.image} 
              alt={targetProfile.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="text-white font-medium">{targetProfile.name}</h4>
              <p className="text-white/60 text-sm">{targetProfile.description}</p>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Connection Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ConnectionType }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              {connectionTypes.map(type => (
                <option key={type} value={type} className="bg-gray-800 capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Expected Net Amount ($)
            </label>
            <input
              type="number"
              value={formData.net}
              onChange={(e) => setFormData(prev => ({ ...prev, net: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              placeholder="0"
            />
            <p className="text-white/60 text-xs mt-1">
              {connectionType === 'source' 
                ? 'Expected monthly income from this connection'
                : 'Expected monthly cost for this connection'
              }
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.public}
                onChange={(e) => setFormData(prev => ({ ...prev, public: e.target.checked }))}
                className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
              />
              <span className="text-white text-sm">Make connection public</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showNet}
                onChange={(e) => setFormData(prev => ({ ...prev, showNet: e.target.checked }))}
                className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
              />
              <span className="text-white text-sm">Show net amount publicly</span>
            </label>
          </div>

          {connectionType === 'source' && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> This connection will be pending until approved by {targetProfile.name}.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Connect</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddConnectionModal;