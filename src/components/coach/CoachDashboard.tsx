import React, { useState } from 'react';
import { Plus, UserPlus, Search, Settings, Calendar, BarChart3 } from 'lucide-react';
import type { User, WorkoutProgram, Team, MetricEntry, CustomMetric } from '../../types';
import { AthleteList } from './AthleteList';
import { TeamList } from './TeamList';
import { ProgramList } from './ProgramList';
import { ProgramForm } from '../program/ProgramForm';
import ChatInterface from '../ChatInterface';
import MetricsDashboard from '../metrics/MetricsDashboard';
import { TeamModal } from './modals/TeamModal';
import { AssignProgramModal } from './modals/AssignProgramModal';
import { NewTeamModal } from './modals/NewTeamModal';
import { AthleteMetricsModal } from './modals/AthleteMetricsModal';
import { CustomMetricModal } from './modals/CustomMetricModal';
import HabitsDashboard from '../habits/HabitsDashboard';
import CoachAnalytics from '../analytics/CoachAnalytics';

// Mock data imports moved to a separate data file
import { MOCK_ATHLETES, INITIAL_TEAMS, INITIAL_PROGRAMS } from '../../data/mockData';

type CoachDashboardProps = {
  user: User;
  onNewMessage: () => void;
};

function CoachDashboard({ user, onNewMessage }: CoachDashboardProps) {
  // State management
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [programs, setPrograms] = useState<WorkoutProgram[]>(INITIAL_PROGRAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'programs' | 'habits' | 'analytics'>('programs');
  
  // Modal states
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [showCustomMetricModal, setShowCustomMetricModal] = useState(false);
  const [showAthleteMetricsModal, setShowAthleteMetricsModal] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<User | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [selectedAthleteForMetrics, setSelectedAthleteForMetrics] = useState<User | null>(null);
  
  // Custom metrics state
  const [customMetrics, setCustomMetrics] = useState<CustomMetric[]>([]);

  // Handlers for custom metrics
  const handleCreateCustomMetric = (metricData: Omit<CustomMetric, 'id'>) => {
    const newMetric: CustomMetric = {
      ...metricData,
      id: Date.now().toString(),
    };
    setCustomMetrics([...customMetrics, newMetric]);
    setShowCustomMetricModal(false);
  };

  // Handler for recording athlete metrics
  const handleAddAthleteMetric = (entry: Omit<MetricEntry, 'id'>) => {
    // In a real app, this would be saved to the backend
    console.log('Recording metric:', entry);
    setShowAthleteMetricsModal(false);
  };

  const handleSaveProgram = (programData: Omit<WorkoutProgram, 'id' | 'assignedTo' | 'assignedTeams'>) => {
    if (selectedProgramId) {
      setPrograms(programs.map(program => 
        program.id === selectedProgramId
          ? { ...program, ...programData }
          : program
      ));
    } else {
      setPrograms([
        ...programs,
        {
          id: Date.now().toString(),
          ...programData,
          assignedTo: [],
          assignedTeams: [],
        },
      ]);
    }
    setShowNewProgram(false);
    setSelectedProgramId(null);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    setPrograms(programs.map(program => ({
      ...program,
      assignedTeams: program.assignedTeams.filter(id => id !== teamId),
    })));
  };

  const handleOpenChat = (athlete: User) => {
    setSelectedAthlete(athlete);
    setShowChat(true);
  };

  const handleOpenMetrics = (athlete: User) => {
    setSelectedAthleteForMetrics(athlete);
    setShowMetrics(true);
  };

  const handleAddMetrics = (athlete: User) => {
    setSelectedAthlete(athlete);
    setShowAthleteMetricsModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'programs' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus className="w-5 h-5" />
            Programs
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'habits' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Habits
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'analytics' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </div>
        {activeTab === 'programs' && (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedProgramId(null);
                setShowNewProgram(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Program
            </button>
            <button
              onClick={() => setShowNewTeamModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              New Team
            </button>
            <button
              onClick={() => setShowCustomMetricModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Custom Metrics
            </button>
          </div>
        )}
      </div>

      {activeTab === 'programs' ? (
        <>
          {/* Search Athletes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Quick Athlete Search</h3>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search athletes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            {searchQuery && (
              <AthleteList
                athletes={MOCK_ATHLETES}
                searchQuery={searchQuery}
                onOpenChat={handleOpenChat}
                onOpenMetrics={handleOpenMetrics}
                onAddMetrics={handleAddMetrics}
              />
            )}
          </div>

          {/* Teams Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Teams</h3>
            <TeamList
              teams={teams}
              onDeleteTeam={handleDeleteTeam}
              onManageTeam={(id) => {
                setSelectedProgramId(id);
                setShowTeamModal(true);
              }}
            />
          </div>

          {/* Programs Section */}
          <ProgramList
            programs={programs}
            onEditProgram={(program) => {
              setSelectedProgramId(program.id);
              setShowNewProgram(true);
            }}
            onDuplicateProgram={(program) => {
              const newProgram: WorkoutProgram = {
                ...program,
                id: Date.now().toString(),
                name: `${program.name} (Copy)`,
                assignedTo: [],
                assignedTeams: [],
              };
              setPrograms([...programs, newProgram]);
            }}
            onAssignProgram={(id) => {
              setSelectedProgramId(id);
              setShowAssignModal(true);
            }}
            onDeleteProgram={(id) => {
              setPrograms(programs.filter(p => p.id !== id));
            }}
          />
        </>
      ) : activeTab === 'habits' ? (
        <HabitsDashboard user={user} />
      ) : (
        <CoachAnalytics />
      )}

      {/* Modals */}
      {showNewProgram && (
        <ProgramForm
          onClose={() => {
            setShowNewProgram(false);
            setSelectedProgramId(null);
          }}
          onSave={handleSaveProgram}
          initialProgram={selectedProgramId ? programs.find(p => p.id === selectedProgramId) : undefined}
        />
      )}

      {showTeamModal && selectedProgramId && (
        <TeamModal
          team={teams.find(t => t.id === selectedProgramId)!}
          athletes={MOCK_ATHLETES}
          onClose={() => setShowTeamModal(false)}
          onUpdateTeam={(updatedTeam) => {
            setTeams(teams.map(team =>
              team.id === updatedTeam.id ? updatedTeam : team
            ));
          }}
        />
      )}

      {showAssignModal && selectedProgramId && (
        <AssignProgramModal
          program={programs.find(p => p.id === selectedProgramId)!}
          teams={teams}
          athletes={MOCK_ATHLETES}
          onClose={() => setShowAssignModal(false)}
          onUpdateProgram={(updatedProgram) => {
            setPrograms(programs.map(program =>
              program.id === updatedProgram.id ? updatedProgram : program
            ));
          }}
        />
      )}

      {showNewTeamModal && (
        <NewTeamModal
          athletes={MOCK_ATHLETES}
          onClose={() => setShowNewTeamModal(false)}
          onCreateTeam={(newTeam) => {
            setTeams([...teams, { ...newTeam, id: Date.now().toString() }]);
          }}
        />
      )}

      {showCustomMetricModal && (
        <CustomMetricModal
          user={user}
          onClose={() => setShowCustomMetricModal(false)}
          onSave={handleCreateCustomMetric}
        />
      )}

      {showAthleteMetricsModal && selectedAthlete && (
        <AthleteMetricsModal
          athlete={selectedAthlete}
          onClose={() => setShowAthleteMetricsModal(false)}
          onAddMetric={handleAddAthleteMetric}
        />
      )}

      {showChat && selectedAthlete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <ChatInterface
              currentUser={user}
              otherUser={selectedAthlete}
              onClose={() => setShowChat(false)}
              onNewMessage={onNewMessage}
              isModal
            />
          </div>
        </div>
      )}

      {/* Metrics Modal */}
      {showMetrics && selectedAthleteForMetrics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Metrics for {selectedAthleteForMetrics.name}
              </h2>
              <button
                onClick={() => setShowMetrics(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <MetricsDashboard
                user={selectedAthleteForMetrics}
                athleteId={selectedAthleteForMetrics.id}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachDashboard;