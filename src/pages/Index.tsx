import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

interface Announcement {
  id: number;
  name: string;
  age: string;
  city: string;
  email: string;
  socials: string;
  text: string;
  userEmail: string;
}

const ITEMS_PER_PAGE = 9;

const mockAnnouncements: Announcement[] = [
  { id: 1, name: "Александра", age: "24", city: "Москва", email: "alex@example.com", socials: "@alex_in_msk", text: "Ищу единомышленников для совместных прогулок по городу и посещения культурных мероприятий!", userEmail: "alex@example.com" },
  { id: 2, name: "Дмитрий", age: "27", city: "Санкт-Петербург", email: "dmitry@example.com", socials: "@dmitry_spb", text: "Предлагаю услуги репетитора по математике. Опыт работы 5 лет.", userEmail: "dmitry@example.com" },
  { id: 3, name: "Екатерина", age: "22", city: "Казань", email: "kate@example.com", socials: "@kate_kzn", text: "Ищу компанию для занятий йогой по выходным. Начинающие приветствуются!", userEmail: "kate@example.com" },
  { id: 4, name: "Максим", age: "29", city: "Новосибирск", email: "max@example.com", socials: "@max_nsk", text: "Отдам котят в добрые руки. 2 месяца, приучены к лотку.", userEmail: "max@example.com" },
  { id: 5, name: "Анна", age: "25", city: "Екатеринбург", email: "anna@example.com", socials: "@anna_ekb", text: "Организую книжный клуб. Встречи каждую субботу в кафе.", userEmail: "anna@example.com" },
  { id: 6, name: "Иван", age: "26", city: "Нижний Новгород", email: "ivan@example.com", socials: "@ivan_nn", text: "Ищу партнера для игры в теннис. Уровень средний.", userEmail: "ivan@example.com" },
  { id: 7, name: "Мария", age: "23", city: "Краснодар", email: "maria@example.com", socials: "@maria_krd", text: "Продаю handmade украшения. Уникальные авторские работы!", userEmail: "maria@example.com" },
  { id: 8, name: "Артём", age: "28", city: "Владивосток", email: "artem@example.com", socials: "@artem_vvo", text: "Ищу соседа по квартире. Район центральный, все удобства.", userEmail: "artem@example.com" },
  { id: 9, name: "София", age: "24", city: "Уфа", email: "sofia@example.com", socials: "@sofia_ufa", text: "Набираю группу на курсы английского языка. Начало в следующем месяце.", userEmail: "sofia@example.com" },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    email: "",
    socials: "",
    text: "",
    captcha: "",
  });

  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAnnouncements = announcements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.captcha !== "42") {
      toast.error("Неверная капча! Подсказка: 6 × 7 = ?");
      return;
    }

    const newAnnouncement: Announcement = {
      id: announcements.length + 1,
      name: formData.name,
      age: formData.age,
      city: formData.city,
      email: formData.email,
      socials: formData.socials,
      text: formData.text,
      userEmail: formData.email,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setCurrentUserEmail(formData.email);
    setFormData({ name: "", age: "", city: "", email: "", socials: "", text: "", captcha: "" });
    setDialogOpen(false);
    toast.success("Объявление успешно добавлено!");
  };

  const handleDelete = (id: number, userEmail: string) => {
    if (!isAdmin && userEmail !== currentUserEmail) {
      toast.error("Вы можете удалять только свои объявления!");
      return;
    }
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Объявление удалено");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-pink-50/30">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="Megaphone" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DoskaBoard
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Категории</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">О проекте</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
              </nav>
              
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Label htmlFor="admin-mode" className="text-xs font-medium cursor-pointer">Админ</Label>
                <Switch 
                  id="admin-mode"
                  checked={isAdmin} 
                  onCheckedChange={setIsAdmin}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить объявление
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Новое объявление</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Введите ваше имя"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Возраст</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Введите возраст"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Ваш город"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@mail.com"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socials">Соцсети</Label>
                    <Input
                      id="socials"
                      required
                      value={formData.socials}
                      onChange={(e) => handleInputChange("socials", e.target.value)}
                      placeholder="@username"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text">Текст объявления</Label>
                    <Textarea
                      id="text"
                      required
                      value={formData.text}
                      onChange={(e) => handleInputChange("text", e.target.value)}
                      placeholder="Расскажите подробнее о вашем объявлении..."
                      className="border-2 focus:border-primary min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.text.length}/500</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captcha">Капча: Сколько будет 6 × 7?</Label>
                    <Input
                      id="captcha"
                      required
                      value={formData.captcha}
                      onChange={(e) => handleInputChange("captcha", e.target.value)}
                      placeholder="Введите ответ"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90 transition-opacity">
                    Отправить
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Актуальные объявления
          </h2>
          <p className="text-muted-foreground text-lg">Находите интересных людей в вашем городе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentAnnouncements.map((announcement, index) => (
            <Card 
              key={announcement.id} 
              className="hover-scale cursor-pointer border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-2 gradient-primary" />
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {announcement.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-xl text-foreground">{announcement.name}</h3>
                      {(isAdmin || announcement.userEmail === currentUserEmail) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить объявление?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие нельзя отменить. Объявление будет удалено навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(announcement.id, announcement.userEmail)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Calendar" size={16} className="text-primary" />
                        <span>{announcement.age} лет</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="MapPin" size={16} className="text-secondary" />
                        <span>{announcement.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Mail" size={16} className="text-accent" />
                        <span className="truncate">{announcement.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Users" size={16} className="text-primary" />
                        <span>{announcement.socials}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-foreground/80 leading-relaxed">{announcement.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={currentPage === page ? "gradient-primary text-white" : "cursor-pointer hover:bg-primary/10"}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="text-sm">© 2024 DoskaBoard. Доска объявлений нового поколения</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;