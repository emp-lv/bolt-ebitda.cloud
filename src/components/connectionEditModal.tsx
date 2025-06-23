import React, { useState } from 'react';
import { X, DollarSign, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Connection, ConnectionType } from '../types/connection';

interface ConnectionEditModalProps {
  connection: Connection;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Connection>) => void;
  onDelete: () => void;
  profileName: string;
  type: 'source' | 'destination';
}

function ConnectionEditModal({
  connection,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  profileName,
  type
}: ConnectionEditModalProps) {
  const [formData, setFormData] = useState({
    type: connection.type,
    net: connection.net,
    public: connection.public,
    showNet: connection.showNet,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const connectionTypes: ConnectionType[] = ['owner', 'affiliate', 'partner', 'other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-lg border border-white/20 p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Edit {type === 'source' ? 'Income Source' : 'Destination'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Connection with {profileName}
            </label>
            <p className="text-white/60 text-sm">
              {type === 'source' 
                ? 'This profile receives income from the connected profile'
                : 'This profile sends income to the connected profile'
              }
            </p>
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
              Net Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="number"
                value={formData.net}
                onChange={(e) => setFormData(prev => ({ ...prev, net: parseInt(e.target.value) || 0 }))}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="0"
              />
            </div>
            <p className="text-white/60 text-xs mt-1">
              {type === 'source' 
                ? 'Amount this connection adds to your income'
                : 'Amount this connection costs you'
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
              <div className="flex items-center space-x-2">
                {formData.public ? (
                  <Eye className="w-4 h-4 text-green-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-white text-sm">Public Connection</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showNet}
                onChange={(e) => setFormData(prev => ({ ...prev, showNet: e.target.checked }))}
                className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Show Net Amount</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Disconnect</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-gray-900/95 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Confirm Disconnect</h4>
              <p className="text-white/80 mb-6">
                Are you sure you want to disconnect from {profileName}?
              </p>
              <div className="flex items-center space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-white/80 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectionEditModal;