import { useState } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { User } from "../../features/user/userTypes";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

interface Props {
  users: User[];
}

const UserTable = ({ users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isCurrentUserAdmin = currentUser?.roles?.includes("admin");

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => {
                const isAdminRow = user.role.includes("admin");
                const canModify = isCurrentUserAdmin || !isAdminRow;
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.role.map((role, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {/* {new Date(user.createdAt).toLocaleDateString()} */}
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        //"en-GB" locale uses dd/mm/yyyy format by default
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-left space-x-2">
                      <button
                        onClick={() => canModify && handleEdit(user)}
                        disabled={!canModify}
                        // className="px-3 py-1 text-xs bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition disabled:cursor-not-allowed"
                        className={`px-3 py-1 text-xs rounded transition ${
                          canModify
                            ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => canModify && handleDelete(user)}
                        disabled={!canModify}
                        // className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition disabled:cursor-not-allowed"
                        className={`px-3 py-1 text-xs rounded transition ${
                          canModify
                            ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        user={selectedUser}
      />
    </>
  );
};

export default UserTable;
