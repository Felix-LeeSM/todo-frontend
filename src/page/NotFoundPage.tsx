import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { Button } from "@domain/shared/components/ui/button";
import { ArrowLeft, CheckCircle, Home } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DayArchive</span>
          </Link>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button className="w-full" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>

          {user ? (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link to="/groups">
                <ArrowLeft className="mr-2 h-4 w-4" />
                그룹 페이지로 이동
              </Link>
            </Button>
          ) : null}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            문제가 지속되면{" "}
            <a className="underline" href="mailto:haradwaith@naver.com">
              개발자 이메일
            </a>
            로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
