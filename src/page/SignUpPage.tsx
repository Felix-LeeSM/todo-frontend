import { SignUpForm, type SignUpFormData } from "@domain/auth/contexts/components/SignUpForm";
import { authApi } from "@domain/auth/services/authApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toastErrorMessage } from "@/shared/toastErrorMessage";

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: SignUpFormData) => {
    return authApi
      .signUp(formData)
      .then(() => navigate("/signin"))
      .catch(toastErrorMessage);
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
            <CardTitle className="text-xl lg:text-2xl">회원가입</CardTitle>
            <CardDescription>새 계정을 만들어 DayArchive를 시작하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm onSubmit={(data) => handleSubmit(data)} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link to="/signin" className="text-blue-600 hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
