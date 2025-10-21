
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { exercises } = useSelector((state: RootState) => state.exercises);

  // Calculate statistics
  const thisMonthWorkouts = exercises.filter((ex) => {
    const exerciseDate = new Date(ex.date);
    const now = new Date();
    return (
      exerciseDate.getMonth() === now.getMonth() &&
      exerciseDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const totalWeightLifted = exercises.reduce((total, ex) => {
    return total + ex.weight * ex.sets;
  }, 0);

  const recentExercises = exercises.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-secondary mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-sm text-gray-600">
          Here's your fitness overview for today
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-bold text-gray-600 mb-2">
            Workouts This Month
          </h3>
          <p className="text-xl font-bold text-accent">{thisMonthWorkouts}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-600 mb-2">
            Total Weight Lifted
          </h3>
          <p className="text-xl font-bold text-accent">
            {totalWeightLifted.toLocaleString()} {user?.weight_unit_preference || 'kg'}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-600 mb-2">
            Current Streak
          </h3>
          <p className="text-xl font-bold text-accent">0 days</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-secondary mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/exercises/new">
            <Button variant="primary">Log Exercise</Button>
          </Link>
          <Link to="/groups">
            <Button variant="secondary">View Groups</Button>
          </Link>
        </div>
      </div>

      {/* Recent Exercises */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-secondary">Recent Exercises</h2>
          <Link to="/exercises" className="text-accent text-sm hover:underline">
            View All
          </Link>
        </div>

        {recentExercises.length > 0 ? (
          <div className="space-y-4">
            {recentExercises.map((exercise) => (
              <Card key={exercise.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-secondary">
                      {exercise.exercise_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(exercise.date).toLocaleDateString()} • {exercise.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">
                      {exercise.weight} {exercise.weight_unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets • {exercise.reps.join(', ')} reps
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-600">
              No exercises logged yet. Start by logging your first workout!
            </p>
          </Card>
        )}
      </div>

      {/* Motivational Section */}
      <div className="mt-8">
        <Card className="bg-accent text-white">
          <p className="text-sm italic">
            "The only bad workout is the one that didn't happen."
          </p>
          <p className="text-xs mt-2">Keep pushing forward!</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
