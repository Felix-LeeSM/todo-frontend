import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { GroupInfoContext } from "@domain/group/contexts/GroupContext";
import { toRoleDisplayName } from "@domain/group/services/mapper";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Button } from "@domain/shared/components/ui/button";
import { CalendarDays, CheckCircle, ListTodo, LogOut } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

export function Header() {
  const { user, handleLogOut } = useContext(AuthContext);
  const { myRole } = useContext(GroupInfoContext);

  const activeClassName = "text-blue-600 font-medium";
  const inactiveClassName = "text-gray-600 hover:text-gray-900";

  const navLinkBaseClassName = "flex items-center gap-2 transition-colors duration-200";

  return user ? (
    <header className="bg-white border-b border-b-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/groups" className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="hidden sm:inline text-2xl font-bold text-gray-900">TodoFlow</span>
          </NavLink>

          <nav className="flex items-center space-x-4 md:space-x-6">
            <NavLink
              to="/groups"
              className={({ isActive }) => `${navLinkBaseClassName} ${isActive ? activeClassName : inactiveClassName}`}
            >
              <ListTodo className="h-5 w-5" />
              <span className="hidden md:inline">그룹</span>
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) => `${navLinkBaseClassName} ${isActive ? activeClassName : inactiveClassName}`}
            >
              <CalendarDays className="h-5 w-5" />
              <span className="hidden md:inline">달력</span>
            </NavLink>

            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogOut}>
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">로그아웃</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user.nickname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <p className="font-medium">{user.nickname}</p>
                {myRole ? <p className="font-medium text-gray-500">{toRoleDisplayName(myRole)}</p> : null}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  ) : null;
}
