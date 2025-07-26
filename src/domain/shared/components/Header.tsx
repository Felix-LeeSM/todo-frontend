import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { GroupInfoContext } from "@domain/group/contexts/GroupContext";
import { toRoleDisplayName } from "@domain/group/services/mapper";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Button } from "@domain/shared/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const { user, handleLogOut } = useContext(AuthContext);
  const { myRole } = useContext(GroupInfoContext);

  return user ? (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TodoFlow</span>
          </Link>

          {/* Header 네비게이션 부분 수정 */}
          <nav className="flex items-center space-x-6">
            <Link to="/groups" className="text-blue-600 font-medium">
              그룹
            </Link>
            <Link to="/calendar" className="text-gray-600 hover:text-gray-900">
              달력
            </Link>
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
