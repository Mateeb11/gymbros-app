
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const GroupsList: React.FC = () => {
  const { groups, invitations } = useSelector((state: RootState) => state.groups);

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === 'pending'
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-secondary">My Groups</h1>
        <Link to="/groups/new">
          <Button variant="primary">Create New Group</Button>
        </Link>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-secondary mb-4">
            Pending Invitations
          </h2>
          <div className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <Card key={invitation.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-secondary">
                      {invitation.group_name || 'Group Invitation'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Invited on{' '}
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="primary" size="small">
                      Accept
                    </Button>
                    <Button variant="secondary" size="small">
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Groups */}
      <div>
        <h2 className="text-lg font-bold text-secondary mb-4">Your Groups</h2>
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card
                key={group.id}
                onClick={() => {}}
                className="cursor-pointer"
              >
                {group.cover_image_url && (
                  <img
                    src={group.cover_image_url}
                    alt={group.name}
                    className="w-full h-32 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="font-bold text-secondary mb-2">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{group.goal}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {group.memberCount || 0} members
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      group.userRole === 'admin'
                        ? 'bg-accent text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {group.userRole || 'member'}
                  </span>
                </div>
                <Link to={`/groups/${group.id}`}>
                  <Button variant="secondary" size="small" className="w-full mt-4">
                    View Group
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven't joined any groups yet.
              </p>
              <Link to="/groups/new">
                <Button variant="primary">Create Your First Group</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupsList;
