import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useNavigate } from "@/i18n/navigate";

export const Route = createFileRoute("/$lang/_auth/login")({
  head: ({ params: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        { title: seoData.auth.login.title },
        { name: "description", content: seoData.auth.login.description },
      ],
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form doğrulama
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage("Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(formData);

      if (response.success) {
        navigate({ to: "/" });
      } else {
        setErrorMessage(
          "Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.",
        );
      }
    } catch (error) {
      setErrorMessage(
        "Giriş başarısız. Bir sorun oluştu, lütfen daha sonra tekrar deneyin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">Guide Of Dubai</h1>
          <p className="mt-2 text-zinc-600">Hesabınıza giriş yapın</p>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="size-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kullanıcı Adı / E-posta Alanı */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700"
              >
                Kullanıcı Adı
              </label>
              <div className="relative rounded-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="size-5 text-zinc-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="focus:border-primary focus:ring-primary block w-full rounded-md border border-zinc-200 py-3 pr-3 pl-10 focus:ring-1 focus:outline-none"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>
            </div>

            {/* Şifre Alanı */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700"
              >
                Şifre
              </label>
              <div className="relative rounded-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="size-5 text-zinc-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:border-primary focus:ring-primary block w-full rounded-md border border-zinc-200 py-3 pr-10 pl-10 focus:ring-1 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-zinc-500 hover:text-zinc-700" />
                  ) : (
                    <Eye className="size-5 text-zinc-500 hover:text-zinc-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="focus:ring-primary hover:bg-primary-700 bg-primary flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isLoading ? (
                <>
                  <svg
                    className="size-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <LogIn className="size-5" />
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>

          {/* Yardım Bağlantıları */}
          <div className="mt-6 flex justify-between text-sm">
            <a href="#" className="text-primary hover:text-blue-800">
              Şifremi Unuttum
            </a>
            <a href="#" className="text-primary hover:text-blue-800">
              Hesap Oluştur
            </a>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          <p>&copy; 2025 Guide Of Dubai. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </main>
  );
}
