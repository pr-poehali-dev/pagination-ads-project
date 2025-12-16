import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        toast.success("Вход выполнен успешно!");
        navigate("/");
      } else {
        toast.error("Неверный пароль!");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DoskaBoard
            </h1>
          </div>
          <p className="text-muted-foreground">Панель администратора</p>
        </div>

        <Card className="border-2 shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Вход</CardTitle>
            <CardDescription className="text-center">
              Введите пароль администратора
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={18} className="mr-2" />
                    Войти
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться на главную
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="px-4 py-2 rounded-lg bg-muted/50 inline-block">
            <Icon name="Info" size={14} className="inline mr-1" />
            Демо пароль: <span className="font-mono font-semibold">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
