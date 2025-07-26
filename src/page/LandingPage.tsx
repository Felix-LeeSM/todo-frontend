import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { authApi } from "@domain/auth/services/authApi";
import { Button } from "@domain/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { ArrowRight, Calendar, CheckCircle, Star, Users } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();
  const { handleSignIn } = useContext(AuthContext);
  const showDemo = () => {
    authApi.signIn({ username: "felix", password: "1q2w3e4r!!" }).then((user) => {
      handleSignIn(user);
      navigate("/groups");
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            <span className="text-xl lg:text-2xl font-bold text-gray-900">TodoFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/signin">로그인</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">시작하기</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
          팀과 함께하는 <span className="text-blue-600">스마트한</span> 할일 관리
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          드래그 앤 드롭, 달력 뷰, 그룹 협업까지. 모든 할일을 한 곳에서 효율적으로 관리하세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/signup">
              무료로 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                showDemo();
              }}
            >
              데모 보기
            </button>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-12">강력한 기능들</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>드래그 앤 드롭</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>직관적인 드래그 앤 드롭으로 할일의 상태를 쉽게 변경하세요.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>달력 뷰</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>달력에서 할일을 시각적으로 확인하고 마감일을 관리하세요.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>그룹 협업</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>팀원들과 그룹을 만들어 함께 프로젝트를 관리하세요.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>중요도 표시</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>중요한 할일에 별표를 표시하고 우선순위를 관리하세요.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90">
            무료로 계정을 만들고 팀과 함께 효율적인 할일 관리를 경험하세요.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">
              무료 계정 만들기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6" />
            <span className="text-xl font-bold">TodoFlow</span>
          </div>
          <p className="text-gray-400">© 2024 TodoFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
