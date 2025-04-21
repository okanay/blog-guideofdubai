import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useNavigate } from "@/i18n/navigate";
import ProtectedRoute from "@/providers/auth/protected-route";
import { Link } from "@/i18n/link";

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
        window.location.reload();
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
    <ProtectedRoute control="authorize" navigateTo="/editor">
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-white to-zinc-50">
        {/* Üst Şerit */}
        <div className="from-primary-600 via-primary-500 to-primary-600 absolute top-0 right-0 left-0 h-1 bg-gradient-to-r"></div>

        {/* Ana İçerik */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo ve Başlık */}
            <div className="flex flex-col items-center space-y-6">
              <Link
                to="/"
                aria-label="Guide of Dubai - Return to homepage"
                className="transition-opacity duration-300 focus:opacity-75 focus:outline-none"
              >
                <img
                  src="/images/brand.svg"
                  alt="Guide of Dubai Brand Logo"
                  loading="eager"
                  className="h-10 w-fit"
                  width="120"
                  height="40"
                />
              </Link>

              <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                  Editör Paneli Giriş
                </h1>
                <p className="mt-2 text-base text-zinc-600">
                  Blog içerikleri düzenleyip yönetebildiği sisteme giriş yapın.
                </p>
              </div>
            </div>

            {/* Form Kartı */}
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-zinc-200 transition-all duration-300">
              {/* Hata Mesajı */}
              {errorMessage && (
                <div className="bg-red-50 p-4 text-sm text-red-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-5 flex-shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Kullanıcı Adı Alanı */}
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Kullanıcı Adı
                    </label>
                    <div className="group relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="group-focus-within:text-primary-500 size-5 text-zinc-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-zinc-200 px-10 py-3 text-zinc-900 transition-colors duration-200 placeholder:text-zinc-400 focus:ring-1 focus:outline-none"
                        placeholder="Kullanıcı adınızı girin"
                      />
                    </div>
                  </div>

                  {/* Şifre Alanı */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-zinc-700"
                      >
                        Şifre
                      </label>
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-800 text-xs font-medium transition-colors duration-200 hover:underline"
                      >
                        Şifremi Unuttum
                      </a>
                    </div>
                    <div className="group relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="group-focus-within:text-primary-500 size-5 text-zinc-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-zinc-200 px-10 py-3 text-zinc-900 transition-colors duration-200 placeholder:text-zinc-400 focus:ring-1 focus:outline-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        aria-label={
                          showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-5 text-zinc-500 transition-colors duration-200 hover:text-zinc-700" />
                        ) : (
                          <Eye className="size-5 text-zinc-500 transition-colors duration-200 hover:text-zinc-700" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Giriş Butonu */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white shadow-md transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:shadow-none"
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
