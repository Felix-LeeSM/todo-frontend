import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { SignInForm, type SignInFormData } from "@domain/auth/contexts/components/SignInForm";
import { authApi } from "@domain/auth/services/authApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "@/shared/handleApiError";

export function SignInPage() {
  const { handleSignIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (formData: SignInFormData) => {
    return authApi
      .signIn(formData)
      .then((res) => handleSignIn(res))
      .then(() => navigate("/groups"))
      .catch(handleApiError);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 lg:mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            <span className="text-xl lg:text-2xl font-bold text-gray-900">TodoFlow</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl lg:text-2xl">로그인</CardTitle>
            <CardDescription>계정에 로그인하여 할일을 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm onSubmit={(formData) => handleSubmit(formData)} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
