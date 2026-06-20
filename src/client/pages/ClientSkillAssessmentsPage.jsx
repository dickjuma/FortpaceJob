import React from 'react';
import { Award, CheckCircle2, AlertCircle, Clock, BarChart3, FileText } from 'lucide-react';
import { useSkillTests, useSkillTestResults } from '../services/clientHooks';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#22C55E] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{sub}</p>
    </div>
  );
}

export default function ClientSkillAssessmentsPage() {
  const testsQuery = useSkillTests();
  const resultsQuery = useSkillTestResults();
  const tests = testsQuery.data || [];
  const results = resultsQuery.data || [];
  const completed = results.filter((result) => result.score !== undefined || result.passed !== undefined);
  const passed = results.filter((result) => result.passed === true).length;
  const averageScore = completed.length
    ? Math.round(completed.reduce((sum, result) => sum + (Number(result.score) || 0), 0) / completed.length)
    : 0;

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Award className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Skill Assessments</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Review available skill tests and completed assessment results before hiring decisions.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard icon={FileText} label="Available Tests" value={tests.length} sub="Published assessment templates" />
            <StatCard icon={CheckCircle2} label="Completed" value={completed.length} sub="Candidate results available" />
            <StatCard icon={Award} label="Average Score" value={`${averageScore}%`} sub={`${passed} passed results`} />
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-black text-gray-900">Available Tests</h2>
                <span className="rounded-full bg-[#4C1D95]/10 px-3 py-1 text-xs font-bold text-[#4C1D95]">{tests.length}</span>
              </div>
              {testsQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : tests.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                  No tests are currently published.
                </div>
              ) : (
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div key={test.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{test.name || test.title || 'Assessment'}</p>
                          <p className="mt-1 text-xs text-gray-500">{test.category || test.skill || 'General assessment'}</p>
                        </div>
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-gray-600">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1">{test.durationMinutes || test.duration || 'Not specified'} min</span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1">{(test.questions || []).length || test.questionCount || 0} questions</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-black text-gray-900">Completed Results</h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">{passed}</span>
              </div>
              {resultsQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : results.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                  No candidate results have been submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result) => {
                    const candidate = result.freelancer?.user || result.freelancer || result.candidate || {};
                    const name = candidate.name || [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || 'Candidate';
                    return (
                      <div key={result.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-900">{name}</p>
                            <p className="mt-1 text-xs text-gray-500">{result.testName || result.test?.title || 'Assessment result'}</p>
                          </div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${result.passed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {result.passed ? 'Passed' : 'Review'}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-gray-500">Score</span>
                          <span className="font-black text-[#4C1D95]">{Number(result.score) || 0}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {(testsQuery.error || resultsQuery.error) && (
            <div className="mx-6 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-700">
              <AlertCircle className="mx-auto mb-2 h-6 w-6" />
              Failed to load one or more assessment datasets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
