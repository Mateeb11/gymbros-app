import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { deleteExercise } from '../../store/slices/exercisesSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

const ExercisesList: React.FC = () => {
  const { exercises } = useSelector((state: RootState) => state.exercises);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'machine' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'exercise_name' | 'weight'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort exercises
  const filteredExercises = exercises
    .filter((ex) => {
      const matchesSearch = ex.exercise_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || ex.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'exercise_name') {
        comparison = a.exercise_name.localeCompare(b.exercise_name);
      } else if (sortBy === 'weight') {
        comparison = a.weight - b.weight;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      dispatch(deleteExercise(id));
    }
  };

  const handleSort = (column: 'date' | 'exercise_name' | 'weight') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-secondary">Exercise Log</h1>
        <Link to="/exercises/new">
          <Button variant="primary">Add Exercise</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div>
            <label className="block text-sm font-bold mb-2 text-secondary">
              Type
            </label>
            <select
              className="input-field"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as 'all' | 'machine' | 'free')
              }
            >
              <option value="all">All Types</option>
              <option value="machine">Machine</option>
              <option value="free">Free Weights</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-secondary">
              Sort By
            </label>
            <select
              className="input-field"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'date' | 'exercise_name' | 'weight')
              }
            >
              <option value="date">Date</option>
              <option value="exercise_name">Exercise Name</option>
              <option value="weight">Weight</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Exercises Table */}
      {filteredExercises.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-secondary text-primary">
              <tr>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-opacity-90"
                  onClick={() => handleSort('date')}
                >
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-opacity-90"
                  onClick={() => handleSort('exercise_name')}
                >
                  Exercise{' '}
                  {sortBy === 'exercise_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left">Type</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-opacity-90"
                  onClick={() => handleSort('weight')}
                >
                  Weight {sortBy === 'weight' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left">Sets & Reps</th>
                <th className="px-4 py-3 text-left">Notes</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map((exercise, index) => (
                <tr
                  key={exercise.id}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 text-sm">
                    {new Date(exercise.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold">
                    {exercise.exercise_name}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{exercise.type}</td>
                  <td className="px-4 py-3 text-sm">
                    {exercise.weight} {exercise.weight_unit}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {exercise.sets} sets: {exercise.reps.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {exercise.notes || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Link to={`/exercises/edit/${exercise.id}`}>
                        <button className="text-accent hover:underline">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(exercise.id)}
                        className="text-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-600">
            No exercises found. Try adjusting your filters or add a new exercise.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ExercisesList;
