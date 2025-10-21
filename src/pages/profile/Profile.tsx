import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { setUser } from '../../store/slices/authSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    user?.weight_unit_preference || 'kg'
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // TODO: Update user profile in Supabase
    if (user) {
      dispatch(
        setUser({
          ...user,
          name,
          weight_unit_preference: weightUnit,
        })
      );
    }
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setWeightUnit(user?.weight_unit_preference || 'kg');
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-secondary mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary">
                Personal Information
              </h2>
              {!isEditing && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <div>
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2 text-secondary">
                    Weight Unit Preference
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="kg"
                        checked={weightUnit === 'kg'}
                        onChange={(e) =>
                          setWeightUnit(e.target.value as 'kg' | 'lbs')
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Kilograms (kg)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="lbs"
                        checked={weightUnit === 'lbs'}
                        onChange={(e) =>
                          setWeightUnit(e.target.value as 'kg' | 'lbs')
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Pounds (lbs)</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-600">
                    Full Name
                  </label>
                  <p className="text-secondary">{user?.name}</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-600">
                    Email
                  </label>
                  <p className="text-secondary">{user?.email}</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-600">
                    Weight Unit Preference
                  </label>
                  <p className="text-secondary">
                    {user?.weight_unit_preference === 'kg'
                      ? 'Kilograms (kg)'
                      : 'Pounds (lbs)'}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Change Password */}
          <Card className="mt-6">
            <h2 className="text-lg font-bold text-secondary mb-4">
              Change Password
            </h2>
            <Button variant="secondary">Update Password</Button>
          </Card>

          {/* Danger Zone */}
          <Card className="mt-6 border-error border-2">
            <h2 className="text-lg font-bold text-error mb-4">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button variant="secondary" className="text-error border-error">
              Delete Account
            </Button>
          </Card>
        </div>

        {/* Profile Picture */}
        <div>
          <Card>
            <h2 className="text-lg font-bold text-secondary mb-4">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center mb-4">
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <Button variant="secondary" size="small">
                Upload Photo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
