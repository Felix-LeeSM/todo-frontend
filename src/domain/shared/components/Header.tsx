import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { GroupInfoContext } from "@domain/group/contexts/GroupContext";
import { toRoleDisplayName } from "@domain/group/services/mapper";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Button } from "@domain/shared/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useContext } from "react";
// 이유: NavLink는 현재 경로를 감지하여 스타일링을 도와주는 컴포넌트다. Link 대신 사용한다.
import { NavLink } from "react-router-dom";

export function Header() {
  const { user, handleLogOut } = useContext(AuthContext);
  const { myRole } = useContext(GroupInfoContext);

  // 이유: 활성/비활성 클래스를 상수로 관리하면 중복이 줄고 유지보수가 용이해진다.
  const activeClassName = "text-blue-600 font-medium";
  const inactiveClassName = "text-gray-600 hover:text-gray-900";

  return user ? (
    <header className="bg-white border-b border-b-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/groups" className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TodoFlow</span>
          </NavLink>

          <nav className="flex items-center space-x-6">
            {/* 이유: className에 함수를 전달, isActive 상태에 따라 클래스를 동적으로 할당한다.
              /groups/* 모든 경로에서 '그룹' 링크가 활성화된다.
            */}
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                isActive ? activeClassName : inactiveClassName
              }
            >
              그룹
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                isActive ? activeClassName : inactiveClassName
              }
            >
              달력
            </NavLink>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleLogOut();
              }}
            >
              로그아웃
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user.nickname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
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