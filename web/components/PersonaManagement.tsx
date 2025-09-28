"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, User, Calendar, AlertCircle } from "lucide-react";
import { PersonaUploadModal } from "./PersonaUploadModal";

interface PersonaData {
  id: string;
  name: string;
  age: number;
  occupation: string;
  condition: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  background: {
    demographics: string[];
    presentingConcerns: string[];
    clinicalNotes: string[];
    sessionGoals: string[];
    therapeuticConsiderations: string[];
  };
  voiceSettings: {
    voice: string;
    speed: number;
    pitch: number;
  };
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PersonaManagementProps {
  userId?: string;
  onPersonaSelect?: (persona: PersonaData) => void;
  selectedPersonaId?: string;
}

export const PersonaManagement: React.FC<PersonaManagementProps> = ({
  userId = "default-user",
  onPersonaSelect,
  selectedPersonaId,
}) => {
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPersonas();
  }, [userId]);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/personas/all/${userId}`
      );
      const result = await response.json();

      if (result.success) {
        setPersonas(result.personas);
      } else {
        setError("Failed to load personas");
      }
    } catch (error) {
      setError("Failed to load personas");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaUpload = (newPersona: PersonaData) => {
    setPersonas((prev) => [...prev, newPersona]);
    setShowUploadModal(false);
  };

  const handleDeletePersona = async (personaId: string) => {
    if (!confirm("Are you sure you want to delete this persona?")) return;

    try {
      setDeletingId(personaId);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/personas/${personaId}/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPersonas((prev) => prev.filter((p) => p.id !== personaId));
      } else {
        setError("Failed to delete persona");
      }
    } catch (error) {
      setError("Failed to delete persona");
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Persona Management</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Custom Persona</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={`group bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-105 ${
              selectedPersonaId === persona.id
                ? "border-purple-500/50 bg-purple-500/10"
                : "border-gray-800"
            }`}
            onClick={() => onPersonaSelect?.(persona)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {persona.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {persona.age}, {persona.occupation}
                  </p>
                </div>
              </div>

              {!persona.isDefault && (
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit functionality
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePersona(persona.id);
                    }}
                    disabled={deletingId === persona.id}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Condition:</span>
                <span className="text-sm font-semibold text-white px-2 py-1 rounded-full bg-gray-700/50 border border-gray-600">
                  {persona.condition}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Difficulty:</span>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full border ${getDifficultyColor(
                    persona.difficulty
                  )}`}
                >
                  {persona.difficulty}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4 line-clamp-3">
              {persona.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(persona.createdAt)}</span>
              </div>
              {persona.isDefault && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                  Default
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {personas.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            No personas found
          </h3>
          <p className="text-gray-500 mb-6">
            Upload a document to create your first custom persona
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Upload Document
          </button>
        </div>
      )}

      <PersonaUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handlePersonaUpload}
        userId={userId}
      />
    </div>
  );
};
