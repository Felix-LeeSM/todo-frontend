import { GroupContext } from "@domain/group/contexts/GroupContext";
import TodoManager from "@domain/todo/components/TodoManager";
import { useContext } from "react";
import { Link } from "react-router-dom";

export function Todo() {
  const { groupDetails: group } = useContext(GroupContext);
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          <Link to="/groups" replace={true}>
            Back to Groups
          </Link>
        </button>
        {group ? <TodoManager group={group} /> : null}
      </div>
    </div>
  );
}
